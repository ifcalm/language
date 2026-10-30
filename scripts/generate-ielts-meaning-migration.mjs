// Turns a reviewed batch of meaning changes into a D1 migration plus a
// readable change list, for the IELTS meaning review.
//
// Input JSON: [[wordId, newMeaningZh, reason], ...]
// Usage: node scripts/generate-ielts-meaning-migration.mjs <changes.json> <migration name> <review md path>
// Each UPDATE only applies while the row still has the meaning it was
// reviewed against, so a stale migration cannot overwrite a newer edit.
import { readFileSync, writeFileSync } from 'node:fs'
import { parseSenses } from './lib/ielts-vocabulary-source.mjs'

const [changesPath, migrationName, reviewPath] = process.argv.slice(2)

if (!changesPath || !migrationName || !reviewPath) {
  throw new Error('Usage: generate-ielts-meaning-migration.mjs <changes.json> <migration name> <review md path>')
}

const snapshot = JSON.parse(readFileSync('scripts/fixtures/ielts-d1.json', 'utf8'))
const wordsById = new Map(snapshot.words.map((word) => [word.id, word]))
const changes = JSON.parse(readFileSync(changesPath, 'utf8'))
const sql = (value) => `'${value.replaceAll("'", "''")}'`

const rows = changes.map(([id, meaning, reason]) => {
  const word = wordsById.get(id)

  if (!word) {
    throw new Error(`Unknown word id "${id}"`)
  }

  if (word.meaningZh === meaning) {
    throw new Error(`"${id}" already has this meaning`)
  }

  parseSenses(meaning)
  return { id, word: word.word, before: word.meaningZh, after: meaning, reason }
})

const statements = rows.map(
  (row) =>
    `UPDATE ielts_words SET meaning_zh = ${sql(row.after)}, updated_at = CURRENT_TIMESTAMP\nWHERE id = ${sql(row.id)} AND meaning_zh = ${sql(row.before)};`,
)

writeFileSync(
  `migrations/${migrationName}.sql`,
  `-- IELTS meaning review: ${rows.length} corrections (see ${reviewPath}).\n${statements.join('\n\n')}\n`,
)

const cell = (text) => text.replaceAll('|', '\\|')
writeFileSync(
  reviewPath,
  `| 词条 | 修改前 | 修改后 | 原因 |\n|---|---|---|---|\n${rows
    .map((row) => `| ${cell(row.word)} | ${cell(row.before)} | ${cell(row.after)} | ${cell(row.reason)} |`)
    .join('\n')}\n`,
)

console.log(`Wrote ${rows.length} updates -> migrations/${migrationName}.sql, ${reviewPath}`)
