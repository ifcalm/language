import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const NODE = process.execPath
const WRANGLER = 'node_modules/wrangler/bin/wrangler.js'
const DATABASE = process.env.D1_DATABASE ?? 'english-orbit-db'
const BUCKET = process.env.R2_BUCKET ?? 'english-orbit'
const PUBLIC_BASE_URL =
  process.env.PRONUNCIATION_ASSET_BASE_URL ?? 'https://assets.english.ifcalm.org'
const TOP_N = Number(process.env.PRONUNCIATION_TOP_N ?? '100')
const SAY_RATE = Number(process.env.PRONUNCIATION_SAY_RATE ?? '90')
const START_PRIORITY = Number(process.env.PRONUNCIATION_START_PRIORITY ?? '1')
const END_PRIORITY = Number(process.env.PRONUNCIATION_END_PRIORITY ?? String(TOP_N))
const DRY_RUN = process.argv.includes('--dry-run')
const SKIP_UPLOAD = process.argv.includes('--skip-upload') || DRY_RUN
const SKIP_DB = process.argv.includes('--skip-db') || DRY_RUN
const KEEP_FILES = process.argv.includes('--keep-files')
const D1_LOCATION_FLAG = process.argv.includes('--local') ? '--local' : '--remote'

const accentConfigs = {
  us: {
    locale: 'en-US',
    voiceId: 'Samantha',
  },
  uk: {
    locale: 'en-GB',
    voiceId: 'Daniel',
  },
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? process.cwd(),
    encoding: options.encoding ?? 'utf8',
    stdio: options.stdio ?? 'pipe',
  })

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    )
  }

  return `${result.stdout ?? ''}${result.stderr ?? ''}`
}

function runWrangler(args, options = {}) {
  return run(NODE, [WRANGLER, ...args], options)
}

function runAsync(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? process.cwd(),
      stdio: options.stdio ?? 'pipe',
    })

    let stdout = ''
    let stderr = ''
    const timeoutMs = Number(options.timeoutMs ?? '0')
    const timeout =
      timeoutMs > 0
        ? setTimeout(() => {
            child.kill('SIGTERM')
            setTimeout(() => child.kill('SIGKILL'), 5000).unref()
          }, timeoutMs)
        : null

    if (child.stdout) {
      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString()
      })
    }

    if (child.stderr) {
      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString()
      })
    }

    child.on('error', (error) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      reject(error)
    })
    child.on('close', (code) => {
      if (timeout) {
        clearTimeout(timeout)
      }

      if (code === 0) {
        resolve(`${stdout}${stderr}`)
        return
      }

      reject(
        new Error(`${command} ${args.join(' ')} failed\n${stdout}${stderr}`),
      )
    })
  })
}

function runWranglerAsync(args, options = {}) {
  return runAsync(NODE, [WRANGLER, ...args], options)
}

function parseWranglerJson(output) {
  const start = output.indexOf('[\n')
  if (start === -1) {
    throw new Error(`Could not find JSON payload in Wrangler output:\n${output}`)
  }

  return JSON.parse(output.slice(start))
}

function fetchTopVocabulary() {
  if (
    !Number.isInteger(START_PRIORITY) ||
    !Number.isInteger(END_PRIORITY) ||
    START_PRIORITY < 1 ||
    END_PRIORITY < START_PRIORITY
  ) {
    throw new Error(
      'Pronunciation frequency-rank range must be positive integers, with end >= start.',
    )
  }

  const sql = `SELECT
  id,
  word,
  normalized_word,
  frequency_rank,
  phonetic_us,
  phonetic_uk
FROM vocab
WHERE frequency_rank BETWEEN ${START_PRIORITY} AND ${END_PRIORITY}
ORDER BY frequency_rank ASC
LIMIT ${END_PRIORITY - START_PRIORITY + 1};`
  const output = runWrangler([
    'd1',
    'execute',
    DATABASE,
    D1_LOCATION_FLAG,
    '--command',
    sql,
  ])
  const payload = parseWranglerJson(output)
  return payload[0]?.results ?? []
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function sqlString(value) {
  return `'${String(value ?? '').replaceAll("'", "''")}'`
}

function buildUpsertSql(rows) {
  const columns = [
    'id',
    'vocabulary_id',
    'word',
    'phonetic',
    'audio_url',
    'updated_at',
  ]

  const updateColumns = columns.filter((column) => column !== 'id')
  const statements = rows.map((row) => {
    const values = columns.map((column) => {
      if (column === 'updated_at') {
        return 'CURRENT_TIMESTAMP'
      }

      return sqlString(row[column])
    })
    const updates = updateColumns
      .map((column) =>
        column === 'updated_at'
          ? `  ${column} = CURRENT_TIMESTAMP`
          : `  ${column} = excluded.${column}`,
      )
      .join(',\n')

    return `INSERT INTO vocab_pronunciations (${columns.join(', ')})
VALUES (${values.join(', ')})
ON CONFLICT(id) DO UPDATE SET
${updates};`
  })

  return statements.join('\n\n')
}

function generateAudio({ text, voiceId, aiffPath, m4aPath }) {
  mkdirSync(dirname(aiffPath), { recursive: true })
  mkdirSync(dirname(m4aPath), { recursive: true })
  run('say', ['-v', voiceId, '-r', String(SAY_RATE), '-o', aiffPath, text])
  run('afconvert', ['-f', 'm4af', '-d', 'aac', aiffPath, m4aPath])

  if (!existsSync(m4aPath)) {
    throw new Error(`Expected generated file at ${m4aPath}`)
  }
}

async function uploadObjectAsync(objectPath, filePath) {
  const args = [
    'r2',
    'object',
    'put',
    `${BUCKET}/${objectPath}`,
    '--remote',
    '--file',
    filePath,
    '--content-type',
    'audio/mp4',
    '--cache-control',
    'public, max-age=31536000, immutable',
    '--force',
  ]
  const maxAttempts = Number(process.env.PRONUNCIATION_UPLOAD_ATTEMPTS ?? '4')
  const timeoutMs = Number(process.env.PRONUNCIATION_UPLOAD_TIMEOUT_MS ?? '120000')
  const rateLimitDelayMs = Number(
    process.env.PRONUNCIATION_UPLOAD_RATE_LIMIT_DELAY_MS ?? '180000',
  )

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await runWranglerAsync(args, { timeoutMs })
      return
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error
      }

      const message = error.message ?? ''
      const delayMs = /429|rate limited|too many requests/i.test(message)
        ? rateLimitDelayMs
        : 1000 * attempt
      console.warn(
        `upload retry ${attempt}/${maxAttempts - 1} for ${objectPath}: ${error.message.split('\n')[0]}`,
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

async function runPool(items, worker, concurrency = 8) {
  let cursor = 0
  let completed = 0

  async function next() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      await worker(items[index], index)
      completed += 1
      if (completed % 10 === 0 || completed === items.length) {
        console.log(`uploaded ${completed}/${items.length}`)
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => next()),
  )
}

function executeSqlFile(filePath) {
  runWrangler(['d1', 'execute', DATABASE, D1_LOCATION_FLAG, '--file', filePath], {
    stdio: 'inherit',
  })
}

const vocabulary = fetchTopVocabulary()
const tempDir = mkdtempSync(join(tmpdir(), 'english-orbit-pronunciations-'))
const importedRows = []
const uploadTasks = []

for (const item of vocabulary) {
  const slug = slugify(item.normalized_word)

  for (const accent of ['us', 'uk']) {
    const config = accentConfigs[accent]
    const objectKey = `pronunciations/${accent}/${slug}.m4a`
    const audioUrl = `${PUBLIC_BASE_URL}/${objectKey}`
    const aiffPath = join(tempDir, 'aiff', accent, `${slug}.aiff`)
    const m4aPath = join(tempDir, objectKey)

    if (!DRY_RUN) {
      generateAudio({ text: item.word, voiceId: config.voiceId, aiffPath, m4aPath })

      if (!SKIP_UPLOAD) {
        uploadTasks.push({ objectKey, m4aPath })
      }
    }

    importedRows.push({
      id: `${item.id}-${accent}`,
      vocabulary_id: item.id,
      word: item.word,
      accent,
      phonetic: accent === 'us' ? item.phonetic_us : item.phonetic_uk,
      audio_url: audioUrl,
    })
  }
}

const manifest = {
  topN: TOP_N,
  startPriority: START_PRIORITY,
  endPriority: END_PRIORITY,
  provider: 'macos-say',
  publicBaseUrl: PUBLIC_BASE_URL,
  importedCount: importedRows.length,
  voices: accentConfigs,
  imported: importedRows.map((row) => ({
    vocabularyId: row.vocabulary_id,
    word: row.word,
    accent: row.accent,
    voiceId: accentConfigs[row.accent]?.voiceId ?? '',
    audioObjectKey: row.audio_url.replace(`${PUBLIC_BASE_URL}/`, ''),
    audioUrl: row.audio_url,
  })),
}

const manifestPath = join(tempDir, 'pronunciation-manifest.json')
const sqlPath = join(tempDir, 'pronunciation-upsert.sql')
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
writeFileSync(sqlPath, buildUpsertSql(importedRows))

if (!SKIP_UPLOAD && uploadTasks.length > 0) {
  await runPool(
    uploadTasks,
    async ({ objectKey, m4aPath }) => uploadObjectAsync(objectKey, m4aPath),
    Number(process.env.PRONUNCIATION_UPLOAD_CONCURRENCY ?? '3'),
  )
}

if (!SKIP_DB && importedRows.length > 0) {
  executeSqlFile(sqlPath)
}

console.log(
  JSON.stringify(
    {
      topN: TOP_N,
      startPriority: START_PRIORITY,
      endPriority: END_PRIORITY,
      importedRows: importedRows.length,
      tempDir,
      dryRun: DRY_RUN,
      skippedUpload: SKIP_UPLOAD,
      skippedDb: SKIP_DB,
      keepFiles: KEEP_FILES,
    },
    null,
    2,
  ),
)

if (DRY_RUN || KEEP_FILES) {
  console.log(`Generated working directory: ${tempDir}`)
}
