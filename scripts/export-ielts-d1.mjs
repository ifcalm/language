// Exports the IELTS tables from D1 (read-only) into a committed snapshot,
// scripts/fixtures/ielts-d1.json, which build-ielts-data.mjs turns into the
// static front-end data. D1 is the source of truth for words, meanings, IPA
// and audio; the snapshot keeps builds and `npm run ielts:check` offline.
//
// Usage: npm run ielts:export (then npm run ielts:build)
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? '2497517a9aa6fae07a043ac4a24bfdd2'
const DATABASE_ID = process.env.D1_DATABASE_ID ?? '1c205b89-6aa8-48b7-a1c0-e039234b05dc'
const OUTPUT_PATH = 'scripts/fixtures/ielts-d1.json'

function readApiToken() {
  if (process.env.CLOUDFLARE_API_TOKEN) {
    return process.env.CLOUDFLARE_API_TOKEN
  }

  const match = existsSync('.env.local')
    ? readFileSync('.env.local', 'utf8').match(/^CLOUDFLARE_API_TOKEN=(.+)$/m)
    : null

  if (!match) {
    throw new Error('CLOUDFLARE_API_TOKEN is missing (env or .env.local).')
  }

  return match[1].trim().replace(/^["']|["']$/g, '')
}

async function queryD1(sql) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${readApiToken()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql }),
      signal: AbortSignal.timeout(60_000),
    },
  )
  const payload = await response.json()

  if (!response.ok || !payload.success) {
    throw new Error(`D1 query failed: ${JSON.stringify(payload.errors ?? payload)}`)
  }

  return payload.result.map((statement) => statement.results)
}

const [words, pronunciations] = await queryD1(`
  SELECT id, word, spelling_us, meaning_zh FROM ielts_words ORDER BY id;
  SELECT id, word_id, accent, pos, phonetic, audio_url FROM ielts_pronunciations ORDER BY id;
`)

const snapshot = {
  words: words.map((row) => ({
    id: row.id,
    word: row.word,
    spellingUs: row.spelling_us,
    meaningZh: row.meaning_zh,
  })),
  pronunciations: pronunciations.map((row) => ({
    id: row.id,
    wordId: row.word_id,
    accent: row.accent,
    pos: row.pos,
    phonetic: row.phonetic,
    audioUrl: row.audio_url,
  })),
}

// One record per line keeps the file compact and its git diffs readable.
const section = (name, rows) => `  "${name}": [\n${rows.map((row) => `    ${JSON.stringify(row)}`).join(',\n')}\n  ]`
writeFileSync(
  OUTPUT_PATH,
  `{\n${section('words', snapshot.words)},\n${section('pronunciations', snapshot.pronunciations)}\n}\n`,
)
console.log(
  `Exported ${snapshot.words.length} words, ${snapshot.pronunciations.length} pronunciations -> ${OUTPUT_PATH}`,
)
