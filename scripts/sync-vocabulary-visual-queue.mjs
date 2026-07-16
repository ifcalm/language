import { mkdirSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { queryRemoteD1 } from './lib/d1-query.mjs'
import {
  DEFAULT_VOCABULARY_VISUAL_QUEUE,
  loadVocabularyVisualQueue,
} from './lib/vocabulary-visual-queue.mjs'

const rawArgs = process.argv.slice(2)

function getArgValue(name, fallback) {
  const index = rawArgs.indexOf(name)

  if (index === -1) {
    return fallback
  }

  const value = rawArgs[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value.`)
  }

  return value
}

const outputPath = resolve(
  process.cwd(),
  getArgValue('--output', DEFAULT_VOCABULARY_VISUAL_QUEUE),
)
const rows = queryRemoteD1(`SELECT
  id,
  word,
  meaning_zh,
  frequency_rank
FROM vocab
ORDER BY COALESCE(frequency_rank, 999999) ASC, word ASC;`)

const items = rows.map((row, index) => ({
  position: index + 1,
  vocabularyId: String(row.id ?? '').trim(),
  word: String(row.word ?? '').trim(),
  meaningZh: String(row.meaning_zh ?? '').trim(),
  frequencyRank:
    row.frequency_rank === null || row.frequency_rank === undefined
      ? null
      : Number(row.frequency_rank),
}))
const queue = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: {
    database: process.env.D1_DATABASE ?? 'english-orbit-db',
    orderBy: 'COALESCE(frequency_rank, 999999) ASC, word ASC',
  },
  total: items.length,
  items,
}
const temporaryPath = `${outputPath}.tmp`

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(temporaryPath, `${JSON.stringify(queue, null, 2)}\n`)
loadVocabularyVisualQueue(temporaryPath)
renameSync(temporaryPath, outputPath)

console.log(`Synced ${items.length} vocabulary words with one remote D1 query.`)
console.log(`Queue: ${outputPath}`)
