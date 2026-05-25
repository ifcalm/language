import { spawnSync } from 'node:child_process'

const NODE = process.execPath
const WRANGLER = 'node_modules/wrangler/bin/wrangler.js'
const DATABASE = process.env.D1_DATABASE ?? 'english-orbit-db'
const TOP_N = Number(process.env.PRONUNCIATION_TOP_N ?? '100')
const REQUIRED_ROWS_PER_WORD = Number(
  process.env.PRONUNCIATION_REQUIRED_ROWS_PER_WORD ?? '2',
)
const JSON_OUTPUT = process.argv.includes('--json')
const WRANGLER_ATTEMPTS = Number(process.env.PRONUNCIATION_CHECK_ATTEMPTS ?? '4')
const USE_LOCAL = process.argv.includes('--local')
const USE_REMOTE = process.argv.includes('--remote')
const D1_LOCATION_FLAG = USE_REMOTE ? '--remote' : '--local'
const D1_LOCATION_LABEL = USE_REMOTE ? 'remote' : 'local'

if (USE_LOCAL && USE_REMOTE) {
  throw new Error('Use either --local or --remote, not both.')
}

if (!Number.isInteger(TOP_N) || TOP_N < 1 || TOP_N > 3000) {
  throw new Error('PRONUNCIATION_TOP_N must be an integer from 1 to 3000.')
}

if (
  !Number.isInteger(REQUIRED_ROWS_PER_WORD) ||
  REQUIRED_ROWS_PER_WORD < 1 ||
  REQUIRED_ROWS_PER_WORD > 10
) {
  throw new Error('PRONUNCIATION_REQUIRED_ROWS_PER_WORD must be from 1 to 10.')
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function runWrangler(args) {
  let lastError = null

  for (let attempt = 1; attempt <= WRANGLER_ATTEMPTS; attempt += 1) {
    const result = spawnSync(NODE, [WRANGLER, ...args], {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      stdio: 'pipe',
    })

    if (result.status === 0) {
      return `${result.stdout ?? ''}${result.stderr ?? ''}`
    }

    lastError = new Error(
      `wrangler ${args.join(' ')} failed\n${result.stdout ?? ''}${result.stderr ?? ''}`,
    )

    if (attempt < WRANGLER_ATTEMPTS) {
      await wait(1000 * attempt)
    }
  }

  throw lastError
}

function parseWranglerJson(output) {
  const trimmed = output.trim()
  if (trimmed.startsWith('[')) {
    return JSON.parse(trimmed)
  }

  const start = output.indexOf('[\n')
  if (start !== -1) {
    return JSON.parse(output.slice(start))
  }

  throw new Error(`Could not find JSON payload in Wrangler output:\n${output}`)
}

async function query(sql) {
  const output = await runWrangler([
    'd1',
    'execute',
    DATABASE,
    D1_LOCATION_FLAG,
    '--json',
    '--command',
    sql,
  ])
  const payload = parseWranglerJson(output)
  return payload[0]?.results ?? []
}

const rows = await query(`WITH top_words AS (
  SELECT id, word, frequency_rank
  FROM vocab
  WHERE frequency_rank <= ${TOP_N}
  ORDER BY frequency_rank ASC
),
pronunciation_counts AS (
  SELECT
    vocabulary_id,
    COUNT(*) AS pronunciation_count,
    SUM(CASE WHEN COALESCE(TRIM(phonetic), '') <> '' THEN 1 ELSE 0 END) AS phonetic_count,
    SUM(CASE WHEN COALESCE(TRIM(audio_url), '') <> '' THEN 1 ELSE 0 END) AS audio_count
  FROM vocab_pronunciations
  WHERE vocabulary_id IN (SELECT id FROM top_words)
  GROUP BY vocabulary_id
)
SELECT
  top_words.id,
  top_words.word,
  top_words.frequency_rank,
  COALESCE(pronunciation_counts.pronunciation_count, 0) AS pronunciation_count,
  COALESCE(pronunciation_counts.phonetic_count, 0) AS phonetic_count,
  COALESCE(pronunciation_counts.audio_count, 0) AS audio_count
FROM top_words
LEFT JOIN pronunciation_counts
  ON pronunciation_counts.vocabulary_id = top_words.id
ORDER BY top_words.frequency_rank ASC;`)

const missing = []

for (const row of rows) {
  const missingFields = []
  const pronunciationCount = Number(row.pronunciation_count ?? 0)
  const phoneticCount = Number(row.phonetic_count ?? 0)
  const audioCount = Number(row.audio_count ?? 0)

  if (pronunciationCount < REQUIRED_ROWS_PER_WORD) {
    missingFields.push('pronunciation_rows')
  }

  if (phoneticCount < REQUIRED_ROWS_PER_WORD) {
    missingFields.push('phonetic')
  }

  if (audioCount < REQUIRED_ROWS_PER_WORD) {
    missingFields.push('audio_url')
  }

  if (missingFields.length > 0) {
    missing.push({
      id: row.id,
      word: row.word,
      frequencyRank: row.frequency_rank,
      pronunciationCount,
      phoneticCount,
      audioCount,
      missingFields,
    })
  }
}

const summary = {
  location: D1_LOCATION_LABEL,
  topN: TOP_N,
  requiredRowsPerWord: REQUIRED_ROWS_PER_WORD,
  checkedWords: rows.length,
  complete: missing.length === 0 && rows.length === TOP_N,
  missingRows: missing.length,
  missing,
}

if (JSON_OUTPUT) {
  console.log(JSON.stringify(summary, null, 2))
} else {
  console.log(
    `Pronunciation coverage (${D1_LOCATION_LABEL} D1): ${summary.checkedWords}/${TOP_N} words checked, required rows per word: ${REQUIRED_ROWS_PER_WORD}.`,
  )

  if (missing.length > 0) {
    console.log('Missing pronunciation content:')
    for (const item of missing.slice(0, 50)) {
      console.log(
        `- #${item.frequencyRank} ${item.word}: ${item.missingFields.join(', ')}`,
      )
    }

    if (missing.length > 50) {
      console.log(`... ${missing.length - 50} more missing rows omitted.`)
    }
  }
}

if (!summary.complete) {
  process.exitCode = 1
}
