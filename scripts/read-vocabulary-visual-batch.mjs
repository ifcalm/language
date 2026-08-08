import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

function positiveInteger(name, fallback) {
  const value = Number(getArgValue(name, String(fallback)))

  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer.`)
  }

  return value
}

const queuePath = getArgValue('--queue', DEFAULT_VOCABULARY_VISUAL_QUEUE)
const manifestDir = resolve(
  process.cwd(),
  getArgValue('--manifest-dir', 'scripts/fixtures'),
)
const outputPath = getArgValue('--output', '')
const includeCompleted = rawArgs.includes('--include-completed')
const start = positiveInteger('--start', 1)
const limit = positiveInteger('--limit', 20)
const { queue } = loadVocabularyVisualQueue(queuePath)

if (start > queue.total) {
  throw new Error(`--start ${start} exceeds the queue total of ${queue.total}.`)
}

const completedIds = includeCompleted
  ? new Set()
  : new Set(
      readdirSync(manifestDir)
        .filter((name) => /^vocabulary-visuals-.*\.json$/.test(name))
        .flatMap((name) => {
          const manifest = JSON.parse(readFileSync(resolve(manifestDir, name)))
          return Array.isArray(manifest.items)
            ? manifest.items.map((item) => item.vocabularyId)
            : []
        }),
    )
const items = []
const skippedCompleted = []

for (const item of queue.items.slice(start - 1)) {
  if (completedIds.has(item.vocabularyId)) {
    skippedCompleted.push({
      position: item.position,
      vocabularyId: item.vocabularyId,
      word: item.word,
    })
    continue
  }

  items.push(item)

  if (items.length === limit) {
    break
  }
}

if (items.length === 0) {
  throw new Error(`No unfinished vocabulary remains at or after position ${start}.`)
}

const batch = {
  schemaVersion: 1,
  queueGeneratedAt: queue.generatedAt,
  start,
  end: items.at(-1).position,
  count: items.length,
  skippedCompleted,
  items,
}
const output = `${JSON.stringify(batch, null, 2)}\n`

if (outputPath) {
  const resolvedOutputPath = resolve(process.cwd(), outputPath)
  writeFileSync(resolvedOutputPath, output)
  console.log(`Wrote positions ${start}-${batch.end} to ${resolvedOutputPath}`)
} else {
  process.stdout.write(output)
}
