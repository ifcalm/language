import { spawnSync } from 'node:child_process'

const NODE = process.execPath
const WRANGLER = 'node_modules/wrangler/bin/wrangler.js'
const DATABASE = process.env.D1_DATABASE ?? 'english-orbit-db'
const TOP_N = Number(process.env.VOCABULARY_CONTENT_TOP_N ?? '100')
const REQUIRED_PRONUNCIATION_ROWS = Number(
  process.env.VOCABULARY_CONTENT_REQUIRED_PRONUNCIATION_ROWS ?? '2',
)
const JSON_OUTPUT = process.argv.includes('--json')
const WRANGLER_ATTEMPTS = Number(
  process.env.VOCABULARY_CONTENT_CHECK_ATTEMPTS ?? '4',
)
const USE_LOCAL = process.argv.includes('--local')
const USE_REMOTE = process.argv.includes('--remote')
const D1_LOCATION_FLAG = USE_REMOTE ? '--remote' : '--local'
const D1_LOCATION_LABEL = USE_REMOTE ? 'remote' : 'local'

if (USE_LOCAL && USE_REMOTE) {
  throw new Error('Use either --local or --remote, not both.')
}

if (!Number.isInteger(TOP_N) || TOP_N < 1 || TOP_N > 3000) {
  throw new Error('VOCABULARY_CONTENT_TOP_N must be an integer from 1 to 3000.')
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`
}

function hasTextSql(column) {
  return `COALESCE(TRIM(${column}), '') <> ''`
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

async function assertSchema() {
  const requiredTables = ['vocab', 'vocab_pronunciations', 'vocab_examples']

  const tableRows = await query(`SELECT name
FROM sqlite_master
WHERE type = 'table'
  AND name IN (${requiredTables.map(sqlString).join(', ')});`)
  const existingTables = new Set(tableRows.map((row) => row.name))
  const missingTables = requiredTables.filter((table) => !existingTables.has(table))

  if (missingTables.length > 0) {
    throw new Error(`Missing required tables: ${missingTables.join(', ')}`)
  }

  const vocabColumnRows = await query('PRAGMA table_info(vocab);')
  const vocabColumns = new Set(vocabColumnRows.map((row) => row.name))
  const requiredVocabColumns = [
    'id',
    'word',
    'normalized_word',
    'meaning_zh',
    'definition_en',
    'frequency_rank',
    'phonetic_us',
    'phonetic_uk',
  ]
  const missingVocabColumns = requiredVocabColumns.filter(
    (column) => !vocabColumns.has(column),
  )

  if (missingVocabColumns.length > 0) {
    throw new Error(
      `Missing vocab columns: ${missingVocabColumns.join(', ')}. Ensure the target D1 database matches the current production baseline.`,
    )
  }
}

await assertSchema()

const rows = await query(`WITH top_words AS (
  SELECT
    id,
    word,
    meaning_zh,
    definition_en,
    frequency_rank,
    phonetic_us,
    phonetic_uk
  FROM vocab
  WHERE frequency_rank <= ${TOP_N}
  ORDER BY frequency_rank ASC
),
pronunciation_counts AS (
  SELECT
    vocabulary_id,
    COUNT(*) AS pronunciation_count,
    SUM(CASE WHEN ${hasTextSql('phonetic')} THEN 1 ELSE 0 END) AS pronunciation_phonetic_count,
    SUM(CASE WHEN ${hasTextSql('audio_url')} THEN 1 ELSE 0 END) AS pronunciation_audio_count
  FROM vocab_pronunciations
  WHERE vocabulary_id IN (SELECT id FROM top_words)
  GROUP BY vocabulary_id
),
example_counts AS (
  SELECT vocabulary_id, COUNT(*) AS example_count
  FROM vocab_examples
  WHERE ${hasTextSql('sentence_en')}
    AND vocabulary_id IN (SELECT id FROM top_words)
  GROUP BY vocabulary_id
)
SELECT
  top_words.*,
  COALESCE(pronunciation_counts.pronunciation_count, 0) AS pronunciation_count,
  COALESCE(pronunciation_counts.pronunciation_phonetic_count, 0) AS pronunciation_phonetic_count,
  COALESCE(pronunciation_counts.pronunciation_audio_count, 0) AS pronunciation_audio_count,
  COALESCE(example_counts.example_count, 0) AS example_count
FROM top_words
LEFT JOIN pronunciation_counts
  ON pronunciation_counts.vocabulary_id = top_words.id
LEFT JOIN example_counts
  ON example_counts.vocabulary_id = top_words.id
ORDER BY top_words.frequency_rank ASC;`)

const requiredCoreChecks = [
  ['meaning_zh', (row) => Boolean(row.meaning_zh?.trim())],
  ['definition_en', (row) => Boolean(row.definition_en?.trim())],
  ['frequency_rank', (row) => row.frequency_rank !== null && row.frequency_rank !== undefined],
  ['phonetic_us', (row) => Boolean(row.phonetic_us?.trim())],
  ['phonetic_uk', (row) => Boolean(row.phonetic_uk?.trim())],
]

const missing = []
const metrics = {
  checkedWords: rows.length,
  core: Object.fromEntries(requiredCoreChecks.map(([field]) => [field, 0])),
  pronunciations: 0,
  pronunciationPhonetics: 0,
  pronunciationAudio: 0,
  examples: 0,
}

for (const row of rows) {
  const missingFields = []

  for (const [field, check] of requiredCoreChecks) {
    if (check(row)) {
      metrics.core[field] += 1
    } else {
      missingFields.push(field)
    }
  }

  if (Number(row.pronunciation_count ?? 0) >= REQUIRED_PRONUNCIATION_ROWS) {
    metrics.pronunciations += 1
  } else {
    missingFields.push('pronunciation_rows')
  }

  if (Number(row.pronunciation_phonetic_count ?? 0) >= REQUIRED_PRONUNCIATION_ROWS) {
    metrics.pronunciationPhonetics += 1
  } else {
    missingFields.push('pronunciation_phonetic')
  }

  if (Number(row.pronunciation_audio_count ?? 0) >= REQUIRED_PRONUNCIATION_ROWS) {
    metrics.pronunciationAudio += 1
  } else {
    missingFields.push('pronunciation_audio')
  }

  if (Number(row.example_count ?? 0) > 0) {
    metrics.examples += 1
  } else {
    missingFields.push('example')
  }

  if (missingFields.length > 0) {
    missing.push({
      id: row.id,
      word: row.word,
      frequencyRank: row.frequency_rank,
      missingFields,
    })
  }
}

const summary = {
  location: D1_LOCATION_LABEL,
  topN: TOP_N,
  requiredPronunciationRows: REQUIRED_PRONUNCIATION_ROWS,
  complete: rows.length === TOP_N && missing.length === 0,
  missingRows: missing.length,
  metrics,
  missing,
}

if (JSON_OUTPUT) {
  console.log(JSON.stringify(summary, null, 2))
} else {
  console.log(`Vocabulary content coverage (${D1_LOCATION_LABEL} D1): ${rows.length}/${TOP_N} words checked.`)
  console.log('Required vocab field coverage:')
  for (const [field, count] of Object.entries(metrics.core)) {
    console.log(`- ${field}: ${count}/${TOP_N}`)
  }

  console.log(`Required pronunciation rows: ${metrics.pronunciations}/${TOP_N}`)
  console.log(`Required pronunciation phonetics: ${metrics.pronunciationPhonetics}/${TOP_N}`)
  console.log(`Required pronunciation audio: ${metrics.pronunciationAudio}/${TOP_N}`)
  console.log(`Required examples: ${metrics.examples}/${TOP_N}`)

  if (missing.length > 0) {
    console.log('Missing required content:')
    for (const item of missing.slice(0, 50)) {
      console.log(
        `- #${item.frequencyRank} ${item.word}: ${item.missingFields.join(', ')}`,
      )
    }

    if (missing.length > 50) {
      console.log(`... ${missing.length - 50} more incomplete words omitted.`)
    }
  }
}

if (!summary.complete) {
  process.exitCode = 1
}
