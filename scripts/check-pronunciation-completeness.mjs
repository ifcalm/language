import { spawnSync } from 'node:child_process'

const NODE = process.execPath
const WRANGLER = 'node_modules/wrangler/bin/wrangler.js'
const DATABASE = process.env.D1_DATABASE ?? 'english-orbit-db'
const TOP_N = Number(process.env.PRONUNCIATION_TOP_N ?? '100')
const REQUIRED_ACCENTS = (process.env.PRONUNCIATION_REQUIRED_ACCENTS ?? 'us,uk')
  .split(',')
  .map((accent) => accent.trim())
  .filter(Boolean)
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

if (REQUIRED_ACCENTS.length === 0) {
  throw new Error(
    'PRONUNCIATION_REQUIRED_ACCENTS must include at least one accent.',
  )
}

for (const accent of REQUIRED_ACCENTS) {
  if (!/^[a-z][a-z0-9_]*$/i.test(accent)) {
    throw new Error(
      `Invalid accent "${accent}". Use letters, numbers, or underscores only.`,
    )
  }
}

function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`
}

function accentCountExpression(accent) {
  return [
    `SUM(CASE WHEN accent = ${sqlString(accent)}`,
    ` THEN 1 ELSE 0 END) AS ${accent}_count`,
  ].join('')
}

function accentSelectExpression(accent) {
  return `COALESCE(pronunciation_counts.${accent}_count, 0) AS ${accent}_count`
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

const coverageRows = await query(`WITH top_words AS (
  SELECT id, word, learning_priority
  FROM core_vocabulary
  WHERE publish_status = 'active'
  ORDER BY learning_priority ASC
  LIMIT ${TOP_N}
),
pronunciation_counts AS (
  SELECT
    vocabulary_id,
    ${REQUIRED_ACCENTS.map(accentCountExpression).join(',\n    ')}
  FROM vocabulary_pronunciations
  WHERE publish_status = 'active'
    AND vocabulary_id IN (SELECT id FROM top_words)
  GROUP BY vocabulary_id
)
SELECT
  top_words.id,
  top_words.word,
  top_words.learning_priority,
  ${REQUIRED_ACCENTS.map(accentSelectExpression).join(',\n  ')}
FROM top_words
LEFT JOIN pronunciation_counts
  ON pronunciation_counts.vocabulary_id = top_words.id
ORDER BY top_words.learning_priority ASC;`)

const qualityRows = await query(`WITH top_words AS (
  SELECT id
  FROM core_vocabulary
  WHERE publish_status = 'active'
  ORDER BY learning_priority ASC
  LIMIT ${TOP_N}
)
SELECT
  accent,
  quality_status,
  COUNT(*) AS total
FROM vocabulary_pronunciations
WHERE publish_status = 'active'
  AND vocabulary_id IN (SELECT id FROM top_words)
GROUP BY accent, quality_status
ORDER BY accent, quality_status;`)

const missing = []

for (const row of coverageRows) {
  for (const accent of REQUIRED_ACCENTS) {
    if (Number(row[`${accent}_count`] ?? 0) < 1) {
      missing.push({
        id: row.id,
        word: row.word,
        learningPriority: row.learning_priority,
        accent,
      })
    }
  }
}

const summary = {
  location: D1_LOCATION_LABEL,
  topN: TOP_N,
  requiredAccents: REQUIRED_ACCENTS,
  checkedWords: coverageRows.length,
  expectedRows: TOP_N * REQUIRED_ACCENTS.length,
  missingRows: missing.length,
  complete: missing.length === 0 && coverageRows.length === TOP_N,
  quality: qualityRows,
  missing,
}

if (JSON_OUTPUT) {
  console.log(JSON.stringify(summary, null, 2))
} else {
  console.log(
    `Pronunciation coverage (${D1_LOCATION_LABEL} D1): ${summary.checkedWords}/${TOP_N} words, ${summary.expectedRows - summary.missingRows}/${summary.expectedRows} required rows present.`,
  )

  if (qualityRows.length > 0) {
    console.log('Quality status breakdown:')
    for (const row of qualityRows) {
      console.log(`- ${row.accent} ${row.quality_status}: ${row.total}`)
    }
  }

  if (missing.length > 0) {
    console.log('Missing pronunciation rows:')
    for (const item of missing.slice(0, 50)) {
      console.log(`- #${item.learningPriority} ${item.word} [${item.accent}]`)
    }

    if (missing.length > 50) {
      console.log(`... ${missing.length - 50} more missing rows omitted.`)
    }
  }
}

if (!summary.complete) {
  process.exitCode = 1
}
