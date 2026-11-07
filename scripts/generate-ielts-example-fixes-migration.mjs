// Turns reviewed fixes to IELTS example sentences into a guarded D1 migration
// and a comparison table, and writes the same sentences into the source files
// under docs/ielts-review/examples/.
//
// Input JSON: [[exampleId, sentenceEn, sentenceZh, target, reason], ...]
// Usage: node scripts/generate-ielts-example-fixes-migration.mjs <fixes.json> <migration name> <table md path>
// Add --check as the first argument to validate only.
//
// Every UPDATE only applies while D1 still holds the sentence it replaces, so
// generate from a fresh `npm run ielts:export`. The source files are rebuilt
// from the snapshot plus the fixes, so running again with a revised list is safe.
import { readFileSync, writeFileSync } from 'node:fs'
import { exampleProblems, writeExampleSources } from './lib/ielts-examples.mjs'

const args = process.argv.slice(2)
const checkOnly = args[0] === '--check'
if (checkOnly) args.shift()
const [fixesPath, migrationName, tablePath] = args

if (!fixesPath || (!checkOnly && !tablePath)) {
  throw new Error('Usage: generate-ielts-example-fixes-migration.mjs [--check] <fixes.json> <migration name> <table md path>')
}

const snapshot = JSON.parse(readFileSync('scripts/fixtures/ielts-d1.json', 'utf8'))
const examplesById = new Map(snapshot.examples.map((example) => [example.id, example]))
const wordsById = new Map(snapshot.words.map((word) => [word.id, word]))
const sql = (value) => `'${value.replaceAll("'", "''")}'`

const problems = []
const fixes = new Map()

for (const [id, en, zh, target, reason] of JSON.parse(readFileSync(fixesPath, 'utf8'))) {
  const old = examplesById.get(id)
  if (!old) {
    problems.push(`unknown example "${id}"`)
    continue
  }
  if (fixes.has(id)) problems.push(`listed twice: ${id}`)
  if (old.en === en && old.zh === zh && old.target === target) problems.push(`no change: ${id}`)
  if (!reason?.trim()) problems.push(`no reason: ${id}`)
  problems.push(...exampleProblems(en, zh, target))
  fixes.set(id, { old, en, zh, target, reason })
}

const sentenceOf = (id) => fixes.get(id) ?? examplesById.get(id)
const owners = new Map()
for (const { id } of snapshot.examples) {
  const { en } = sentenceOf(id)
  if (owners.has(en)) problems.push(`duplicate: ${en} (${owners.get(en)}, ${id})`)
  owners.set(en, id)
}

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exit(1)
}

console.log(`OK: ${fixes.size} fixes`)
if (checkOnly) process.exit(0)

const statements = [...fixes].map(([id, { old, en, zh, target }]) => {
  const set = [
    en !== old.en && `sentence_en = ${sql(en)}`,
    zh !== old.zh && `sentence_zh = ${sql(zh)}`,
    target !== old.target && `target = ${sql(target)}`,
  ].filter(Boolean)
  return (
    `UPDATE ielts_examples SET ${set.join(', ')}, updated_at = CURRENT_TIMESTAMP\n` +
    `WHERE id = ${sql(id)} AND sentence_en = ${sql(old.en)} AND sentence_zh = ${sql(old.zh)} AND target = ${sql(old.target)};`
  )
})
writeFileSync(
  `migrations/${migrationName}.sql`,
  `-- IELTS example review: ${fixes.size} fixes (see ${tablePath}).\n${statements.join('\n\n')}\n`,
)

const cell = (text) => text.replaceAll('|', '\\|')
const shown = ({ en, zh, target }) => `${cell(en.replace(target, `**${target}**`))}<br>${cell(zh)}`
writeFileSync(
  tablePath,
  `| 例句 | 释义 | 修改前 | 修改后 | 原因 |\n|---|---|---|---|---|\n${[...fixes]
    .map(([id, fix]) => {
      const word = wordsById.get(fix.old.wordId)
      return `| ${id} | ${cell(word.meaningZh)} | ${shown(fix.old)} | ${shown(fix)} | ${cell(fix.reason)} |`
    })
    .join('\n')}\n`,
)

writeExampleSources(sentenceOf)
console.log(`Wrote migrations/${migrationName}.sql, ${tablePath} and the example source files`)
