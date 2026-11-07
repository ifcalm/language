// Validates a batch of IELTS example sentences, then writes a D1 migration
// plus a readable list for review.
//
// Input JSON: [[wordId, sentenceEn, sentenceZh, target], ...]
// Usage: node scripts/generate-ielts-examples-migration.mjs <migration name> <review md path> <batch.json>...
// Add --check as the first argument to validate and report coverage only.
import { readFileSync, writeFileSync } from 'node:fs'
import { MAX_PER_ENTRY, exampleProblems } from './lib/ielts-examples.mjs'

const args = process.argv.slice(2)
const checkOnly = args[0] === '--check'
if (checkOnly) args.shift()
const [migrationName, reviewPath, ...batchPaths] = checkOnly ? [null, null, ...args] : args

if (batchPaths.length === 0) {
  throw new Error('Usage: generate-ielts-examples-migration.mjs [--check] <migration name> <review md path> <batch.json>...')
}

const snapshot = JSON.parse(readFileSync('scripts/fixtures/ielts-d1.json', 'utf8'))
const wordsById = new Map(snapshot.words.map((word) => [word.id, word]))
const sql = (value) => `'${value.replaceAll("'", "''")}'`

const problems = []
const seenSentences = new Set()
const countByWord = new Map()
const rows = []

for (const path of batchPaths) {
  for (const [wordId, en, zh, target] of JSON.parse(readFileSync(path, 'utf8'))) {
    const word = wordsById.get(wordId)

    if (!word) {
      problems.push(`unknown entry "${wordId}"`)
      continue
    }

    problems.push(...exampleProblems(en, zh, target))
    if (seenSentences.has(en)) problems.push(`duplicate: ${en}`)
    seenSentences.add(en)

    const n = (countByWord.get(wordId) ?? 0) + 1
    countByWord.set(wordId, n)
    if (n > MAX_PER_ENTRY) problems.push(`more than ${MAX_PER_ENTRY} sentences: ${wordId}`)

    rows.push({ id: `${wordId}-${n}`, wordId, word: word.word, meaning: word.meaningZh, en, zh, target })
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}

console.log(`OK: ${rows.length} sentences, ${countByWord.size} entries`)

if (checkOnly) process.exit(0)

const statements = rows.map(
  (row) =>
    `INSERT INTO ielts_examples (id, word_id, sentence_en, sentence_zh, target) VALUES (${sql(row.id)}, ${sql(row.wordId)}, ${sql(row.en)}, ${sql(row.zh)}, ${sql(row.target)});`,
)
writeFileSync(
  `migrations/${migrationName}.sql`,
  `-- IELTS example sentences: ${rows.length} rows (see ${reviewPath}).\n${statements.join('\n')}\n`,
)

const cell = (text) => text.replaceAll('|', '\\|')
writeFileSync(
  reviewPath,
  `| 词条 | 释义 | 例句 | 翻译 |\n|---|---|---|---|\n${rows
    .map((row) => `| ${cell(row.word)} | ${cell(row.meaning)} | ${cell(row.en.replace(row.target, `**${row.target}**`))} | ${cell(row.zh)} |`)
    .join('\n')}\n`,
)

console.log(`Wrote migrations/${migrationName}.sql, ${reviewPath}`)
