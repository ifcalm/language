import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'
import sharp from 'sharp'

export const PIPELINE_SCHEMA_VERSION = 1

export const DEFAULT_STYLE_PROMPT =
  'Use the declared styleFamily for each item and choose subjects from people, communities, animals, plants, landscapes, weather, tools, vehicles, buildings and everyday objects according to the scene. Keep one coherent style inside each image while varying styles across the batch. Shared constraints: mature learner-facing art direction, landscape 3:2 composition, a clear focal action or relationship, no in-image teaching text, and no live-action or realistic-human impression. When people appear, every readable foreground or midground face must have clearly rendered natural eyes, a nose, a mouth and a scene-appropriate expression. Never use blank oval faces, featureless masks, mannequin heads or shadows that erase the facial features. Vary age, skin tone, facial structure, body type, hairstyle, clothing, ability and occupation naturally. No realistic skin pores, photographic faces, stock-photo staging, logos, watermarks, readable interfaces, chibi proportions or glossy toy rendering.'

export const RISK_TAGS = [
  'exact_quantity',
  'reference',
  'comparison',
  'sequence',
  'cause_effect',
  'spatial_boundary',
  'before_after',
  'people_face',
  'abstract_meaning',
]

const HIGH_RISK_WEIGHTS = new Map([
  ['exact_quantity', 9],
  ['reference', 8],
  ['comparison', 7],
  ['sequence', 7],
  ['cause_effect', 6],
  ['spatial_boundary', 6],
  ['before_after', 6],
  ['people_face', 5],
  ['abstract_meaning', 4],
])

function normalizedText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function hasExactTargetWord(sentence, word) {
  const pattern = new RegExp(
    `(^|[^A-Za-z])${escapeRegExp(word)}(?=$|[^A-Za-z])`,
    'i',
  )

  return pattern.test(sentence)
}

export function completedVocabularyIds(manifestDir) {
  if (!existsSync(manifestDir)) return new Set()

  return new Set(
    readdirSync(manifestDir)
      .filter((name) => /^vocabulary-visuals-.*\.json$/.test(name))
      .flatMap((name) => {
        const manifest = JSON.parse(readFileSync(join(manifestDir, name), 'utf8'))
        return Array.isArray(manifest.items)
          ? manifest.items.map((item) => item.vocabularyId)
          : []
      }),
  )
}

export function selectUnfinishedItems(
  queue,
  { start = 1, limit = 50, completedIds = new Set() } = {},
) {
  if (!Number.isInteger(start) || start < 1 || start > queue.items.length) {
    throw new Error(`Invalid queue start position: ${start}.`)
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error(`Invalid pipeline limit: ${limit}.`)
  }

  const selected = []
  const skippedCompleted = []

  for (const item of queue.items.slice(start - 1)) {
    if (completedIds.has(item.vocabularyId)) {
      skippedCompleted.push(item)
      continue
    }

    selected.push(item)
    if (selected.length === limit) break
  }

  if (selected.length === 0) {
    throw new Error(`No unfinished vocabulary remains at or after position ${start}.`)
  }

  return { selected, skippedCompleted }
}

export function buildBatchKey(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cannot build a batch key without vocabulary items.')
  }

  return `rank-${items[0].position}-${items.at(-1).position}`
}

export function buildPlannerSchema(items) {
  return {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            vocabularyId: {
              type: 'string',
              enum: items.map((item) => item.vocabularyId),
            },
            styleFamily: { type: 'string' },
            sentenceEn: { type: 'string' },
            sentenceZh: { type: 'string' },
            scene: { type: 'string' },
            altText: { type: 'string' },
            riskTags: {
              type: 'array',
              items: { type: 'string', enum: RISK_TAGS },
            },
          },
          required: [
            'vocabularyId',
            'styleFamily',
            'sentenceEn',
            'sentenceZh',
            'scene',
            'altText',
            'riskTags',
          ],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
    additionalProperties: false,
  }
}

export function validatePlannedItems(queueItems, plannedItems) {
  if (!Array.isArray(plannedItems) || plannedItems.length !== queueItems.length) {
    throw new Error(
      `Planner returned ${plannedItems?.length ?? 0} of ${queueItems.length} items.`,
    )
  }

  const queueById = new Map(queueItems.map((item) => [item.vocabularyId, item]))
  const seen = new Set()

  for (const planned of plannedItems) {
    const queueItem = queueById.get(planned.vocabularyId)

    if (!queueItem) {
      throw new Error(`Planner returned an unexpected vocabulary ID: ${planned.vocabularyId}.`)
    }

    if (seen.has(planned.vocabularyId)) {
      throw new Error(`Planner duplicated ${queueItem.word}.`)
    }
    seen.add(planned.vocabularyId)

    const minimumLengths = {
      styleFamily: 3,
      sentenceEn: 8,
      sentenceZh: 4,
      scene: 40,
      altText: 8,
    }

    for (const [field, minimumLength] of Object.entries(minimumLengths)) {
      if (normalizedText(planned[field]).length < minimumLength) {
        throw new Error(`Planner left ${field} empty for ${queueItem.word}.`)
      }
    }

    if (!hasExactTargetWord(planned.sentenceEn, queueItem.word)) {
      throw new Error(
        `The English sentence for ${queueItem.word} must contain the exact target word.`,
      )
    }

    if (
      !Array.isArray(planned.riskTags) ||
      planned.riskTags.length > 5 ||
      planned.riskTags.some((tag) => !RISK_TAGS.includes(tag))
    ) {
      throw new Error(`Planner returned invalid risk tags for ${queueItem.word}.`)
    }
  }

  return queueItems.map((item) => {
    const planned = plannedItems.find(
      (candidate) => candidate.vocabularyId === item.vocabularyId,
    )
    return { ...planned, riskTags: [...new Set(planned.riskTags)] }
  })
}

export function buildManifest(
  queueItems,
  plannedItems,
  {
    batchId,
    bucket = 'english-orbit',
    assetBaseUrl = 'https://assets.english.ifcalm.org',
    objectPrefix = 'vocabulary/visuals',
    stylePrompt = DEFAULT_STYLE_PROMPT,
  },
) {
  const orderedPlans = validatePlannedItems(queueItems, plannedItems)

  return {
    batchId,
    bucket,
    assetBaseUrl,
    objectPrefix,
    stylePrompt,
    items: queueItems.map((item, index) => ({
      vocabularyId: item.vocabularyId,
      word: item.word,
      meaningZh: item.meaningZh,
      exampleId: `${item.vocabularyId}-visual-ex`,
      styleFamily: orderedPlans[index].styleFamily,
      sentenceEn: orderedPlans[index].sentenceEn,
      sentenceZh: orderedPlans[index].sentenceZh,
      scene: orderedPlans[index].scene,
      altText: orderedPlans[index].altText,
      riskTags: orderedPlans[index].riskTags,
    })),
  }
}

export function buildImagePrompt(manifest, item, retryNote = '') {
  return `Use case: illustration-story
Asset type: vocabulary memory scene for an adult English-learning app
Primary request: Create one image that makes the word "${item.word}" and this sentence visually memorable: "${item.sentenceEn}"
Scene/backdrop: ${item.scene}
Style/medium: ${item.styleFamily}; unmistakably illustrated, polished and mature
Composition/framing: landscape 3:2, one clear focal action or relationship, readable at card size
Lighting/mood: constructive, emotionally clear, natural to the scene
Constraints: ${manifest.stylePrompt}
Avoid: any readable text, letters, numbers, captions, labels, logos, watermarks, realistic-human or live-action appearance, blank or missing facial features, visual clutter${
    retryNote ? `\nRetry correction: ${retryNote}` : ''
  }`
}

function stableNumber(seed, value) {
  const hash = createHash('sha256').update(`${seed}:${value}`).digest()
  return hash.readUInt32BE(0)
}

export function chooseQaSample(items, { ratio = 0.1, minimum = 5, seed = '' } = {}) {
  if (!Array.isArray(items) || items.length === 0) return []

  const count = Math.min(
    items.length,
    Math.max(minimum, Math.ceil(items.length * ratio)),
  )
  const highRiskCount = Math.min(3, count)
  const byRisk = [...items].sort((left, right) => {
    const score = (item) =>
      (item.riskTags ?? []).reduce(
        (total, tag) => total + (HIGH_RISK_WEIGHTS.get(tag) ?? 0),
        0,
      )
    return score(right) - score(left) || left.word.localeCompare(right.word)
  })
  const selected = byRisk.slice(0, highRiskCount)
  const selectedIds = new Set(selected.map((item) => item.vocabularyId))
  const remaining = items
    .filter((item) => !selectedIds.has(item.vocabularyId))
    .sort(
      (left, right) =>
        stableNumber(seed, left.vocabularyId) -
        stableNumber(seed, right.vocabularyId),
    )

  return [...selected, ...remaining.slice(0, count - selected.length)]
}

export async function mapConcurrent(items, concurrency, worker) {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error(`Concurrency must be a positive integer, received ${concurrency}.`)
  }

  const results = new Array(items.length)
  let cursor = 0

  async function runWorker() {
    while (cursor < items.length) {
      const index = cursor
      cursor += 1
      results[index] = await worker(items[index], index)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, runWorker),
  )
  return results
}

export function writeJsonAtomic(filePath, value) {
  mkdirSync(dirname(filePath), { recursive: true })
  const temporaryPath = `${filePath}.tmp`
  writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`)
  renameSync(temporaryPath, filePath)
}

export function readJsonIfExists(filePath) {
  return existsSync(filePath)
    ? JSON.parse(readFileSync(filePath, 'utf8'))
    : null
}

export async function validateGeneratedImages(manifest, sourceDir, expectedSize) {
  const supportedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp'])
  const files = readdirSync(sourceDir).filter((name) =>
    supportedExtensions.has(extname(name).toLowerCase()),
  )
  const expectedWords = new Set(manifest.items.map((item) => item.word))
  const unexpected = files.filter(
    (name) => !expectedWords.has(basename(name, extname(name))),
  )
  const missing = []
  const hashes = new Map()
  const metadata = []

  for (const item of manifest.items) {
    const filename = files.find(
      (name) => basename(name, extname(name)) === item.word,
    )

    if (!filename) {
      missing.push(item.word)
      continue
    }

    const filePath = join(sourceDir, filename)
    const buffer = readFileSync(filePath)
    const imageMetadata = await sharp(buffer).metadata()
    const contentHash = createHash('sha256').update(buffer).digest('hex')
    const [expectedWidth, expectedHeight] = expectedSize
      .split('x')
      .map(Number)

    if (
      imageMetadata.width !== expectedWidth ||
      imageMetadata.height !== expectedHeight
    ) {
      throw new Error(
        `${item.word} is ${imageMetadata.width}x${imageMetadata.height}; expected ${expectedSize}.`,
      )
    }

    if (hashes.has(contentHash)) {
      throw new Error(
        `${item.word} duplicates the generated image for ${hashes.get(contentHash)}.`,
      )
    }
    hashes.set(contentHash, item.word)
    metadata.push({
      word: item.word,
      filename,
      bytes: buffer.byteLength,
      width: imageMetadata.width,
      height: imageMetadata.height,
      format: imageMetadata.format,
      contentHash: contentHash.slice(0, 12),
    })
  }

  if (missing.length || unexpected.length) {
    throw new Error(
      `Generated image inventory mismatch. Missing: ${missing.join(', ') || 'none'}. Unexpected: ${unexpected.join(', ') || 'none'}.`,
    )
  }

  return metadata
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export async function createContactSheet(manifest, sourceDir, outputPath) {
  const columns = 5
  const tileWidth = 360
  const imageHeight = 240
  const labelHeight = 30
  const tileHeight = imageHeight + labelHeight
  const rows = Math.ceil(manifest.items.length / columns)
  const composites = []

  for (const [index, item] of manifest.items.entries()) {
    const sourcePath = resolve(sourceDir, `${item.word}.png`)
    const image = await sharp(sourcePath)
      .resize(tileWidth, imageHeight, { fit: 'cover', position: 'attention' })
      .png()
      .toBuffer()
    const label = Buffer.from(
      `<svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffffff"/><text x="12" y="21" font-family="Arial, sans-serif" font-size="16" fill="#1f2937">${escapeXml(item.word)}</text></svg>`,
    )
    const tile = await sharp({
      create: {
        width: tileWidth,
        height: tileHeight,
        channels: 3,
        background: '#ffffff',
      },
    })
      .composite([
        { input: image, top: 0, left: 0 },
        { input: label, top: imageHeight, left: 0 },
      ])
      .jpeg({ quality: 88 })
      .toBuffer()

    composites.push({
      input: tile,
      left: (index % columns) * tileWidth,
      top: Math.floor(index / columns) * tileHeight,
    })
  }

  mkdirSync(dirname(outputPath), { recursive: true })
  await sharp({
    create: {
      width: tileWidth * columns,
      height: tileHeight * rows,
      channels: 3,
      background: '#ffffff',
    },
  })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toFile(outputPath)

  return outputPath
}
