// Pulls IPA and audio URLs for IELTS entries that already exist in the D1 `vocab`
// table, so the static IELTS data can reuse them without querying D1 at runtime.
// Read-only: only SELECT statements are sent.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { normalizeWord, readIeltsSource } from './lib/ielts-vocabulary-source.mjs'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? '2497517a9aa6fae07a043ac4a24bfdd2'
const DATABASE_ID = process.env.D1_DATABASE_ID ?? '1c205b89-6aa8-48b7-a1c0-e039234b05dc'
const OUTPUT_PATH = 'scripts/fixtures/ielts-pronunciations.json'
const BATCH_SIZE = 500

function readApiToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) {
    return process.env.CLOUDFLARE_API_TOKEN
  }

  if (existsSync('.env.local')) {
    const match = readFileSync('.env.local', 'utf8').match(/^CLOUDFLARE_API_TOKEN=(.+)$/m)

    if (match) {
      return match[1].trim().replace(/^["']|["']$/g, '')
    }
  }

  throw new Error('CLOUDFLARE_API_TOKEN is missing (env or .env.local).')
}

// British spellings used in the IELTS list may be stored in American spelling in vocab.
function spellingVariants(word) {
  const variants = new Set([word])
  const rules = [
    [/is(e|ed|es|ing|ation|ations)$/, 'iz$1'],
    [/ys(e|ed|es|ing)$/, 'yz$1'],
    [/our(s|ed|ing|ful|less|ite|able)?$/, 'or$1'],
    [/(ce|ti|bi|fi|li|me|nt)re$/, '$1er'],
    [/ogue$/, 'og'],
    [/ence$/, 'ense'],
    [/ll(ed|ing|er)$/, 'l$1'],
    [/lment$/, 'llment'],
    [/ae/, 'e'],
    [/oe/, 'e'],
  ]

  for (const [pattern, replacement] of rules) {
    if (pattern.test(word)) {
      variants.add(word.replace(pattern, replacement))
    }
  }

  return [...variants]
}

function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`
}

async function queryD1(token, sql) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
    },
  )
  const payload = await response.json()

  if (!response.ok || !payload.success) {
    throw new Error(`D1 query failed: ${JSON.stringify(payload.errors ?? payload)}`)
  }

  return payload.result.flatMap((statement) => statement.results)
}

const token = readApiToken()
const words = [
  ...new Set(
    readIeltsSource()
      .flatMap((module) => module.topics)
      .flatMap((topic) => topic.entries)
      .map((entry) => normalizeWord(entry.word)),
  ),
]
const lookups = [...new Set(words.flatMap(spellingVariants))]
const statements = []

for (let index = 0; index < lookups.length; index += BATCH_SIZE) {
  const list = lookups.slice(index, index + BATCH_SIZE).map(sqlString).join(',')
  statements.push(`SELECT v.normalized_word, v.phonetic_uk, v.phonetic_us,
    MAX(CASE WHEN p.id LIKE '%-uk' THEN p.audio_url END) AS audio_uk,
    MAX(CASE WHEN p.id LIKE '%-us' THEN p.audio_url END) AS audio_us
  FROM vocab v LEFT JOIN vocab_pronunciations p ON p.vocabulary_id = v.id
  WHERE v.normalized_word IN (${list})
  GROUP BY v.id`)
}

const rowsByWord = new Map(
  (await queryD1(token, statements.join(';\n'))).map((row) => [row.normalized_word, row]),
)
const pronunciations = {}

for (const word of [...words].sort()) {
  const row = spellingVariants(word)
    .map((variant) => rowsByWord.get(variant))
    .find(Boolean)

  if (!row) {
    continue
  }

  pronunciations[word] = {
    ...(row.normalized_word === word ? {} : { matchedVocabWord: row.normalized_word }),
    phoneticUk: row.phonetic_uk || null,
    phoneticUs: row.phonetic_us || null,
    audioUk: row.audio_uk || null,
    audioUs: row.audio_us || null,
  }
}

const matched = Object.keys(pronunciations).length
console.log(`Matched ${matched} of ${words.length} IELTS entries in vocab -> ${OUTPUT_PATH}`)
writeFileSync(OUTPUT_PATH, `${JSON.stringify(pronunciations, null, 2)}\n`)
