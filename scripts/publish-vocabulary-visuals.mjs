import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'
import { queryRemoteD1, sqlString as remoteSqlString } from './lib/d1-query.mjs'
import {
  DEFAULT_VOCABULARY_VISUAL_QUEUE,
  loadVocabularyVisualQueue,
  validateManifestAgainstQueue,
  validateRemoteManifestRows,
} from './lib/vocabulary-visual-queue.mjs'

const rawArgs = process.argv.slice(2)
const args = new Set(rawArgs)
const publish = args.has('--publish')
const verifyRemote = publish || args.has('--verify-remote')
const root = process.cwd()
const require = createRequire(import.meta.url)
const wranglerCliPath = require.resolve('wrangler/bin/wrangler.js')
const wranglerTimeoutMs = Number(
  process.env.VOCABULARY_VISUAL_WRANGLER_TIMEOUT_MS ?? '120000',
)
const r2UploadAttempts = Number(
  process.env.VOCABULARY_VISUAL_R2_UPLOAD_ATTEMPTS ?? '2',
)

if (!Number.isInteger(wranglerTimeoutMs) || wranglerTimeoutMs < 1000) {
  throw new Error('VOCABULARY_VISUAL_WRANGLER_TIMEOUT_MS must be at least 1000.')
}

if (!Number.isInteger(r2UploadAttempts) || r2UploadAttempts < 1) {
  throw new Error('VOCABULARY_VISUAL_R2_UPLOAD_ATTEMPTS must be positive.')
}

function getArgValue(name, fallback) {
  const index = rawArgs.indexOf(name)

  if (index === -1) {
    return fallback
  }

  const value = rawArgs[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value`)
  }

  return value
}

const manifestPath = resolve(
  root,
  getArgValue(
    '--manifest',
    'scripts/fixtures/vocabulary-visuals-pilot-30.json',
  ),
)
const sourceDir = resolve(
  root,
  getArgValue('--source-dir', 'output/vocabulary-visuals/pilot-30'),
)
const preparedDir = resolve(
  root,
  getArgValue('--prepared-dir', 'tmp/vocabulary-visuals/pilot-30'),
)
const queuePath = getArgValue('--queue', DEFAULT_VOCABULARY_VISUAL_QUEUE)
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const { queue } = loadVocabularyVisualQueue(queuePath)
const queueRange = validateManifestAgainstQueue(manifest, queue)
const supportedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp'])

function sql(value) {
  if (value === null || value === undefined || value === '') {
    return 'NULL'
  }

  return `'${String(value).replaceAll("'", "''")}'`
}

function findSourceFile(word) {
  const match = readdirSync(sourceDir).find((filename) => {
    const extension = extname(filename).toLowerCase()
    return supportedExtensions.has(extension) && basename(filename, extension) === word
  })

  if (!match) {
    throw new Error(`Missing source image for ${word} in ${sourceDir}`)
  }

  return join(sourceDir, match)
}

function runWrangler(wranglerArgs, label, attempts = 1) {
  let lastError = null

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      execFileSync(process.execPath, [wranglerCliPath, ...wranglerArgs], {
        stdio: 'inherit',
        timeout: wranglerTimeoutMs,
        killSignal: 'SIGTERM',
      })
      return
    } catch (error) {
      lastError = error

      if (attempt < attempts) {
        console.warn(`${label} attempt ${attempt} failed; retrying.`)
      }
    }
  }

  throw lastError
}

if (verifyRemote) {
  const remoteRows = queryRemoteD1(`SELECT id, word, meaning_zh
FROM vocab
WHERE id IN (${manifest.items
    .map((item) => remoteSqlString(item.vocabularyId))
    .join(', ')});`)

  validateRemoteManifestRows(manifest, remoteRows)
  console.log(
    `Remote D1 validation: ${remoteRows.length} items matched with one query.`,
  )
}

if (!existsSync(sourceDir)) {
  throw new Error(`Source directory does not exist: ${sourceDir}`)
}

mkdirSync(preparedDir, { recursive: true })

const publishedItems = []

for (const item of manifest.items) {
  const sourcePath = findSourceFile(item.word)
  const webp = await sharp(sourcePath)
    .resize(1200, 800, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82, effort: 5 })
    .toBuffer()
  const contentHash = createHash('sha256').update(webp).digest('hex').slice(0, 12)
  const filename = `${item.word}-${contentHash}.webp`
  const preparedPath = join(preparedDir, filename)
  const objectKey = `${manifest.objectPrefix}/${item.word}/${contentHash}.webp`
  const imageUrl = `${manifest.assetBaseUrl}/${objectKey}`

  writeFileSync(preparedPath, webp)
  publishedItems.push({
    ...item,
    contentHash,
    objectKey,
    imageUrl,
    bytes: webp.byteLength,
  })
}

const publishedManifest = {
  ...manifest,
  generatedAt: new Date().toISOString(),
  items: publishedItems,
}
const publishedManifestJson = `${JSON.stringify(publishedManifest, null, 2)}\n`
const manifestHash = createHash('sha256')
  .update(publishedManifestJson)
  .digest('hex')
  .slice(0, 12)
const publishedManifestPath = join(preparedDir, `${manifest.batchId}-${manifestHash}.json`)
const manifestObjectKey = `manifests/vocabulary-visuals/${manifest.batchId}-${manifestHash}.json`

writeFileSync(publishedManifestPath, publishedManifestJson)

const statements = publishedItems.flatMap((item) => [
  `INSERT INTO vocab_examples (
    id, vocabulary_id, word, sentence_en, sentence_zh, updated_at
  ) VALUES (
    ${sql(item.exampleId)},
    ${sql(item.vocabularyId)},
    ${sql(item.word)},
    ${sql(item.sentenceEn)},
    ${sql(item.sentenceZh)},
    CURRENT_TIMESTAMP
  ) ON CONFLICT(id) DO UPDATE SET
    sentence_en = excluded.sentence_en,
    sentence_zh = excluded.sentence_zh,
    updated_at = excluded.updated_at;`,
  `INSERT INTO vocab_visuals (
    id, vocabulary_id, word, example_id, image_url, alt_text, updated_at
  ) VALUES (
    ${sql(`${item.vocabularyId}-visual`)},
    ${sql(item.vocabularyId)},
    ${sql(item.word)},
    ${sql(item.exampleId)},
    ${sql(item.imageUrl)},
    ${sql(item.altText)},
    CURRENT_TIMESTAMP
  ) ON CONFLICT(vocabulary_id) DO UPDATE SET
    word = excluded.word,
    example_id = excluded.example_id,
    image_url = excluded.image_url,
    alt_text = excluded.alt_text,
    updated_at = excluded.updated_at;`,
])
const sqlPath = join(preparedDir, `${manifest.batchId}.sql`)

writeFileSync(sqlPath, `${statements.join('\n\n')}\n`)

if (publish) {
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_API_TOKEN is required for --publish')
  }

  for (const item of publishedItems) {
    runWrangler(
      [
        'r2',
        'object',
        'put',
        `${manifest.bucket}/${item.objectKey}`,
        '--remote',
        '--file',
        join(preparedDir, `${item.word}-${item.contentHash}.webp`),
        '--content-type',
        'image/webp',
        '--cache-control',
        'public, max-age=31536000, immutable',
      ],
      `R2 upload for ${item.word}`,
      r2UploadAttempts,
    )
  }

  runWrangler(
    [
      'r2',
      'object',
      'put',
      `${manifest.bucket}/${manifestObjectKey}`,
      '--remote',
      '--file',
      publishedManifestPath,
      '--content-type',
      'application/json',
    ],
    'R2 manifest upload',
    r2UploadAttempts,
  )

  runWrangler(
    [
      'd1',
      'execute',
      'english-orbit-db',
      '--remote',
      '--file',
      sqlPath,
    ],
    'D1 import',
  )
}

console.log(
  `${publish ? 'Published' : 'Prepared'} ${publishedItems.length} vocabulary visuals.`,
)
console.log(
  queueRange.contiguous
    ? `Local queue validation: positions ${queueRange.start}-${queueRange.end}.`
    : `Local queue validation: ${queueRange.positions.length} selected positions matched.`,
)
console.log(`Manifest: ${publishedManifestPath}`)
console.log(`SQL: ${sqlPath}`)
