import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  chooseQaSample,
  hasExactTargetWord,
  mapConcurrent,
  readJsonIfExists,
  selectUnfinishedItems,
  validatePlannedItems,
  writeJsonAtomic,
} from './vocabulary-visual-pipeline.mjs'

const queueItems = [
  { vocabularyId: 'id-1', word: 'art', meaningZh: '艺术', position: 1 },
  { vocabularyId: 'id-2', word: 'who', meaningZh: '谁', position: 2 },
  { vocabularyId: 'id-3', word: 'before', meaningZh: '之前', position: 3 },
]

function plan(item, overrides = {}) {
  return {
    vocabularyId: item.vocabularyId,
    styleFamily: 'gouache storybook illustration',
    sentenceEn: `The scene explains ${item.word} clearly.`,
    sentenceZh: `这个场景清楚地解释了${item.meaningZh}。`,
    scene:
      'A clear foreground action unfolds beside a quiet garden with a distinct focal subject.',
    altText: '花园旁发生了一个清晰可辨的动作。',
    riskTags: [],
    ...overrides,
  }
}

test('selectUnfinishedItems skips completed IDs while preserving queue order', () => {
  const result = selectUnfinishedItems({ items: queueItems }, {
    start: 1,
    limit: 2,
    completedIds: new Set(['id-1']),
  })

  assert.deepEqual(
    result.selected.map((item) => item.vocabularyId),
    ['id-2', 'id-3'],
  )
  assert.deepEqual(
    result.skippedCompleted.map((item) => item.vocabularyId),
    ['id-1'],
  )
})

test('hasExactTargetWord checks standalone tokens case-insensitively', () => {
  assert.equal(hasExactTargetWord('Art can comfort a community.', 'art'), true)
  assert.equal(hasExactTargetWord('This party is lively.', 'art'), false)
  assert.equal(hasExactTargetWord('WHO is at the door?', 'who'), true)
  assert.equal(hasExactTargetWord('Whoever arrives may enter.', 'who'), false)
})

test('validatePlannedItems restores queue order and rejects a missing token', () => {
  const ordered = validatePlannedItems(queueItems.slice(0, 2), [
    plan(queueItems[1]),
    plan(queueItems[0]),
  ])

  assert.deepEqual(
    ordered.map((item) => item.vocabularyId),
    ['id-1', 'id-2'],
  )

  assert.throws(
    () =>
      validatePlannedItems([queueItems[0]], [
        plan(queueItems[0], { sentenceEn: 'The party begins at noon.' }),
      ]),
    /exact target word/,
  )
})

test('chooseQaSample is deterministic and prioritizes high-risk items', () => {
  const items = Array.from({ length: 20 }, (_, index) => ({
    vocabularyId: `id-${index}`,
    word: `word-${index}`,
    riskTags:
      index === 7
        ? ['exact_quantity']
        : index === 9
          ? ['reference']
          : index === 11
            ? ['sequence']
            : [],
  }))
  const first = chooseQaSample(items, { seed: 'same-seed' })
  const second = chooseQaSample(items, { seed: 'same-seed' })

  assert.deepEqual(first, second)
  assert.equal(first.length, 5)
  assert.deepEqual(
    new Set(first.slice(0, 3).map((item) => item.vocabularyId)),
    new Set(['id-7', 'id-9', 'id-11']),
  )
})

test('mapConcurrent preserves result order and honors its concurrency limit', async () => {
  let active = 0
  let maximum = 0
  const results = await mapConcurrent([1, 2, 3, 4, 5], 2, async (value) => {
    active += 1
    maximum = Math.max(maximum, active)
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 10))
    active -= 1
    return value * 2
  })

  assert.deepEqual(results, [2, 4, 6, 8, 10])
  assert.equal(maximum, 2)
})

test('atomic JSON state can be overwritten without leaving a temp file', () => {
  const directory = mkdtempSync(join(tmpdir(), 'vocab-visual-pipeline-'))
  const filePath = join(directory, 'state.json')

  try {
    writeJsonAtomic(filePath, { status: 'first' })
    writeJsonAtomic(filePath, { status: 'second' })

    assert.deepEqual(readJsonIfExists(filePath), { status: 'second' })
    assert.doesNotThrow(() => JSON.parse(readFileSync(filePath, 'utf8')))
    assert.equal(readJsonIfExists(`${filePath}.tmp`), null)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
