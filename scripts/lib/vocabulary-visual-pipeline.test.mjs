import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  buildManifestDraft,
  chooseQaSample,
  findInflectedTargetWords,
  hasExactTargetWord,
  mapConcurrent,
  readJsonIfExists,
  selectUnfinishedItems,
  targetWordMatch,
  validateManifestMetadata,
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

test('targetWordMatch accepts regular inflections but not derivations', () => {
  assert.equal(targetWordMatch('The caretaker informs the residents.', 'inform'), 'inflected')
  assert.equal(targetWordMatch('She denies touching the paint.', 'deny'), 'inflected')
  assert.equal(targetWordMatch('The crew launches the boat.', 'launch'), 'inflected')
  assert.equal(targetWordMatch('He shipped the parcel today.', 'ship'), 'inflected')
  assert.equal(targetWordMatch('Two teams compete to finish first.', 'competition'), 'none')
  assert.equal(targetWordMatch('The fisherman casts a net.', 'fishing'), 'none')
  assert.equal(targetWordMatch('A Jewish neighbor shares bread.', 'Jew'), 'none')
})

test('validatePlannedItems restores queue order and rejects an absent target word', () => {
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
    /regular inflection/,
  )
})

test('validatePlannedItems keeps custom risk tags but rejects malformed ones', () => {
  assert.doesNotThrow(() =>
    validatePlannedItems([queueItems[0]], [
      plan(queueItems[0], { riskTags: ['people_face', 'Chinese_culture', 'hands'] }),
    ]),
  )

  assert.throws(
    () =>
      validatePlannedItems([queueItems[0]], [
        plan(queueItems[0], { riskTags: ['people face'] }),
      ]),
    /snake_case risk tags/,
  )
})

test('findInflectedTargetWords reports only headwords that changed form', () => {
  assert.deepEqual(
    findInflectedTargetWords([
      { word: 'inform', sentenceEn: 'The caretaker informs the residents.' },
      { word: 'art', sentenceEn: 'Art can comfort a community.' },
    ]),
    ['inform'],
  )
})

test('a manifest draft carries batch metadata and empty content slots', () => {
  const draft = buildManifestDraft(queueItems, {
    batchKey: 'rank-1-3',
    batchId: 'auto-rank-1-3-20260815',
  })

  assert.equal(draft.generationMode, 'agent-built-in-imagegen')
  assert.equal(draft.items.length, 3)
  assert.equal(draft.items[0].exampleId, 'id-1-visual-ex')
  assert.equal(draft.items[0].sentenceEn, '')
  assert.doesNotThrow(() => validateManifestMetadata(draft))

  assert.throws(
    () => validateManifestMetadata({ ...draft, stylePrompt: '' }),
    /batch metadata/,
  )
  assert.throws(
    () =>
      validateManifestMetadata({
        ...draft,
        items: [{ ...draft.items[0], exampleId: 'wrong' }],
      }),
    /exampleId/,
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
