import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'
import sharp from 'sharp'

const args = new Set(process.argv.slice(2))
const publish = args.has('--publish')
const root = process.cwd()
const manifestPath = resolve(
  root,
  'scripts/fixtures/vocabulary-visuals-pilot-30.json',
)
const sourceDir = resolve(root, 'output/vocabulary-visuals/pilot-30')
const preparedDir = resolve(root, 'tmp/vocabulary-visuals/pilot-30')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
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
    execFileSync(
      'npx',
      [
        'wrangler',
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
      { stdio: 'inherit' },
    )
  }

  execFileSync(
    'npx',
    [
      'wrangler',
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
    { stdio: 'inherit' },
  )

  execFileSync(
    'npx',
    [
      'wrangler',
      'd1',
      'execute',
      'english-orbit-db',
      '--remote',
      '--file',
      sqlPath,
    ],
    { stdio: 'inherit' },
  )
}

console.log(
  `${publish ? 'Published' : 'Prepared'} ${publishedItems.length} vocabulary visuals.`,
)
console.log(`Manifest: ${publishedManifestPath}`)
console.log(`SQL: ${sqlPath}`)
