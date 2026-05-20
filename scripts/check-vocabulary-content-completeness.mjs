import { spawnSync } from 'node:child_process'

const NODE = process.execPath
const WRANGLER = 'node_modules/wrangler/bin/wrangler.js'
const DATABASE = process.env.D1_DATABASE ?? 'english-orbit-db'
const TOP_N = Number(process.env.VOCABULARY_CONTENT_TOP_N ?? '100')
const REQUIRED_ACCENTS = (process.env.VOCABULARY_CONTENT_REQUIRED_ACCENTS ?? 'us,uk')
  .split(',')
  .map((accent) => accent.trim())
  .filter(Boolean)
const JSON_OUTPUT = process.argv.includes('--json')
const WRANGLER_ATTEMPTS = Number(
  process.env.VOCABULARY_CONTENT_CHECK_ATTEMPTS ?? '4',
)
const D1_LOCATION_FLAG = process.argv.includes('--local') ? '--local' : '--remote'

if (!Number.isInteger(TOP_N) || TOP_N < 1 || TOP_N > 3000) {
  throw new Error('VOCABULARY_CONTENT_TOP_N must be an integer from 1 to 3000.')
}

if (REQUIRED_ACCENTS.length === 0) {
  throw new Error(
    'VOCABULARY_CONTENT_REQUIRED_ACCENTS must include at least one accent.',
  )
}

for (const accent of REQUIRED_ACCENTS) {
  if (!/^[a-z][a-z0-9_]*$/i.test(accent)) {
    throw new Error(
      `Invalid accent "${accent}". Use letters, numbers, or underscores only.`,
    )
  }
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
  const requiredTables = [
    'core_vocabulary',
    'vocabulary_pronunciations',
    'vocabulary_senses',
    'vocabulary_examples',
    'vocabulary_collocations',
    'vocabulary_scenario_links',
  ]

  const tableRows = await query(`SELECT name
FROM sqlite_master
WHERE type = 'table'
  AND name IN (${requiredTables.map(sqlString).join(', ')});`)
  const existingTables = new Set(tableRows.map((row) => row.name))
  const missingTables = requiredTables.filter((table) => !existingTables.has(table))

  if (missingTables.length > 0) {
    throw new Error(`Missing required tables: ${missingTables.join(', ')}`)
  }

  const coreColumnRows = await query('PRAGMA table_info(core_vocabulary);')
  const coreColumns = new Set(coreColumnRows.map((row) => row.name))
  const requiredCoreColumns = [
    'id',
    'word',
    'normalized_word',
    'meaning_zh',
    'definition_en',
    'primary_part_of_speech',
    'level',
    'frequency_rank',
    'frequency_band',
    'learning_priority',
    'phonetic_us',
    'phonetic_uk',
    'publish_status',
  ]
  const missingCoreColumns = requiredCoreColumns.filter(
    (column) => !coreColumns.has(column),
  )

  if (missingCoreColumns.length > 0) {
    throw new Error(
      `Missing core_vocabulary columns: ${missingCoreColumns.join(', ')}. Run D1 migrations first.`,
    )
  }
}

function pronunciationCountExpression(accent) {
  return [
    `(SELECT COUNT(*) FROM vocabulary_pronunciations`,
    ` WHERE vocabulary_pronunciations.vocabulary_id = top_words.id`,
    ` AND vocabulary_pronunciations.publish_status = 'active'`,
    ` AND vocabulary_pronunciations.accent = ${sqlString(accent)}`,
    ` AND ${hasTextSql('vocabulary_pronunciations.audio_url')})`,
    ` AS pronunciation_${accent}_count`,
  ].join('')
}

await assertSchema()

const rows = await query(`WITH top_words AS (
  SELECT
    id,
    word,
    meaning_zh,
    definition_en,
    primary_part_of_speech,
    level,
    frequency_rank,
    frequency_band,
    learning_priority,
    phonetic_us,
    phonetic_uk
  FROM core_vocabulary
  WHERE publish_status = 'active'
  ORDER BY learning_priority ASC
  LIMIT ${TOP_N}
)
SELECT
  top_words.*,
  ${REQUIRED_ACCENTS.map(pronunciationCountExpression).join(',\n  ')},
  (SELECT COUNT(*) FROM vocabulary_senses
   WHERE vocabulary_senses.vocabulary_id = top_words.id
     AND vocabulary_senses.publish_status = 'active'
     AND ${hasTextSql('vocabulary_senses.meaning_zh')}
     AND ${hasTextSql('vocabulary_senses.definition_en')}) AS sense_count,
  (SELECT COUNT(*) FROM vocabulary_examples
   WHERE vocabulary_examples.vocabulary_id = top_words.id
     AND vocabulary_examples.publish_status = 'active'
     AND ${hasTextSql('vocabulary_examples.sentence_en')}) AS example_count,
  (SELECT COUNT(*) FROM vocabulary_collocations
   WHERE vocabulary_collocations.vocabulary_id = top_words.id
     AND vocabulary_collocations.publish_status = 'active'
     AND ${hasTextSql('vocabulary_collocations.phrase')}) AS collocation_count,
  (SELECT COUNT(*) FROM vocabulary_scenario_links
   WHERE vocabulary_scenario_links.vocabulary_id = top_words.id) AS scenario_count
FROM top_words
ORDER BY top_words.learning_priority ASC;`)

const requiredCoreChecks = [
  ['meaning_zh', (row) => Boolean(row.meaning_zh?.trim())],
  ['definition_en', (row) => Boolean(row.definition_en?.trim())],
  ['primary_part_of_speech', (row) => Boolean(row.primary_part_of_speech?.trim())],
  ['level', (row) => Boolean(row.level?.trim())],
  ['frequency_rank', (row) => row.frequency_rank !== null && row.frequency_rank !== undefined],
  ['frequency_band', (row) => Boolean(row.frequency_band?.trim())],
  ['learning_priority', (row) => row.learning_priority !== null && row.learning_priority !== undefined],
  ['phonetic_us', (row) => Boolean(row.phonetic_us?.trim())],
  ['phonetic_uk', (row) => Boolean(row.phonetic_uk?.trim())],
]

const missing = []
const metrics = {
  checkedWords: rows.length,
  core: Object.fromEntries(requiredCoreChecks.map(([field]) => [field, 0])),
  pronunciations: Object.fromEntries(REQUIRED_ACCENTS.map((accent) => [accent, 0])),
  senses: 0,
  examples: 0,
  collocations: 0,
  scenarios: 0,
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

  for (const accent of REQUIRED_ACCENTS) {
    const count = Number(row[`pronunciation_${accent}_count`] ?? 0)
    if (count > 0) {
      metrics.pronunciations[accent] += 1
    } else {
      missingFields.push(`pronunciation_${accent}`)
    }
  }

  if (Number(row.sense_count ?? 0) > 0) {
    metrics.senses += 1
  } else {
    missingFields.push('sense')
  }

  if (Number(row.example_count ?? 0) > 0) {
    metrics.examples += 1
  } else {
    missingFields.push('example')
  }

  if (Number(row.collocation_count ?? 0) > 0) {
    metrics.collocations += 1
  }

  if (Number(row.scenario_count ?? 0) > 0) {
    metrics.scenarios += 1
  }

  if (missingFields.length > 0) {
    missing.push({
      id: row.id,
      word: row.word,
      learningPriority: row.learning_priority,
      missingFields,
    })
  }
}

const summary = {
  topN: TOP_N,
  requiredAccents: REQUIRED_ACCENTS,
  complete: rows.length === TOP_N && missing.length === 0,
  missingRows: missing.length,
  metrics,
  missing,
}

if (JSON_OUTPUT) {
  console.log(JSON.stringify(summary, null, 2))
} else {
  console.log(`Vocabulary content coverage: ${rows.length}/${TOP_N} words checked.`)
  console.log('Required core field coverage:')
  for (const [field, count] of Object.entries(metrics.core)) {
    console.log(`- ${field}: ${count}/${TOP_N}`)
  }

  console.log('Required pronunciation coverage:')
  for (const accent of REQUIRED_ACCENTS) {
    console.log(`- ${accent}: ${metrics.pronunciations[accent]}/${TOP_N}`)
  }

  console.log(`Required senses: ${metrics.senses}/${TOP_N}`)
  console.log(`Required examples: ${metrics.examples}/${TOP_N}`)
  console.log(`Conditional collocations present: ${metrics.collocations}/${TOP_N}`)
  console.log(`Conditional scenarios present: ${metrics.scenarios}/${TOP_N}`)

  if (missing.length > 0) {
    console.log('Missing required content:')
    for (const item of missing.slice(0, 50)) {
      console.log(
        `- #${item.learningPriority} ${item.word}: ${item.missingFields.join(', ')}`,
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
