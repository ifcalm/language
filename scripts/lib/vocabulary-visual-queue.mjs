import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const DEFAULT_VOCABULARY_VISUAL_QUEUE =
  'scripts/fixtures/vocabulary-visual-queue.json'

function normalizedText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

function assertUnique(values, label) {
  if (new Set(values).size !== values.length) {
    throw new Error(`${label} must be unique.`)
  }
}

export function loadVocabularyVisualQueue(
  queuePath = DEFAULT_VOCABULARY_VISUAL_QUEUE,
) {
  const resolvedPath = resolve(process.cwd(), queuePath)
  const queue = JSON.parse(readFileSync(resolvedPath, 'utf8'))

  if (queue.schemaVersion !== 1 || !Array.isArray(queue.items)) {
    throw new Error(`Unsupported vocabulary visual queue: ${resolvedPath}`)
  }

  if (queue.items.length === 0) {
    throw new Error(`Vocabulary visual queue is empty: ${resolvedPath}`)
  }

  const ids = []
  const words = []

  queue.items.forEach((item, index) => {
    const expectedPosition = index + 1

    if (item.position !== expectedPosition) {
      throw new Error(
        `Queue position ${item.position} should be ${expectedPosition}.`,
      )
    }

    if (!normalizedText(item.vocabularyId)) {
      throw new Error(`Queue item ${expectedPosition} is missing vocabularyId.`)
    }

    if (!normalizedText(item.word)) {
      throw new Error(`Queue item ${expectedPosition} is missing word.`)
    }

    if (!normalizedText(item.meaningZh)) {
      throw new Error(`Queue item ${expectedPosition} is missing meaningZh.`)
    }

    ids.push(item.vocabularyId)
    words.push(item.word.toLocaleLowerCase('en-US'))
  })

  assertUnique(ids, 'Queue vocabulary IDs')
  assertUnique(words, 'Queue words')

  if (queue.total !== queue.items.length) {
    throw new Error(
      `Queue total ${queue.total} does not match ${queue.items.length} items.`,
    )
  }

  return { path: resolvedPath, queue }
}

export function validateManifestAgainstQueue(manifest, queue) {
  if (!Array.isArray(manifest.items) || manifest.items.length === 0) {
    throw new Error('Vocabulary visual manifest must contain items.')
  }

  const queueById = new Map(
    queue.items.map((item) => [item.vocabularyId, item]),
  )
  const manifestIds = manifest.items.map((item) => item.vocabularyId)
  const manifestWords = manifest.items.map((item) =>
    normalizedText(item.word).toLocaleLowerCase('en-US'),
  )

  assertUnique(manifestIds, 'Manifest vocabulary IDs')
  assertUnique(manifestWords, 'Manifest words')

  const matchedItems = manifest.items.map((item) => {
    const queueItem = queueById.get(item.vocabularyId)

    if (!queueItem) {
      throw new Error(
        `Manifest word ${item.word} (${item.vocabularyId}) is not in the local queue.`,
      )
    }

    if (normalizedText(item.word) !== normalizedText(queueItem.word)) {
      throw new Error(
        `Manifest word ${item.word} does not match queue word ${queueItem.word}.`,
      )
    }

    if (normalizedText(item.meaningZh) !== normalizedText(queueItem.meaningZh)) {
      throw new Error(
        `Manifest meaning for ${item.word} does not match the local queue.`,
      )
    }

    return queueItem
  })

  const positions = matchedItems.map((item) => item.position)
  const contiguous = positions.every(
    (position, index) => position === positions[0] + index,
  )

  return {
    start: Math.min(...positions),
    end: Math.max(...positions),
    contiguous,
    positions,
    items: matchedItems,
  }
}

export function validateRemoteManifestRows(manifest, rows) {
  const rowsById = new Map(rows.map((row) => [row.id, row]))

  if (rowsById.size !== manifest.items.length) {
    throw new Error(
      `Remote D1 returned ${rowsById.size} of ${manifest.items.length} manifest words.`,
    )
  }

  for (const item of manifest.items) {
    const row = rowsById.get(item.vocabularyId)

    if (!row) {
      throw new Error(`Remote D1 is missing ${item.word} (${item.vocabularyId}).`)
    }

    if (normalizedText(row.word) !== normalizedText(item.word)) {
      throw new Error(`Remote D1 word mismatch for ${item.vocabularyId}.`)
    }

    if (normalizedText(row.meaning_zh) !== normalizedText(item.meaningZh)) {
      throw new Error(`Remote D1 meaning mismatch for ${item.word}.`)
    }
  }
}
