import { spawn } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { basename, join, resolve } from 'node:path'
import OpenAI from 'openai'
import sharp from 'sharp'
import {
  PIPELINE_SCHEMA_VERSION,
  buildBatchKey,
  buildImagePrompt,
  buildManifest,
  buildPlannerSchema,
  chooseQaSample,
  completedVocabularyIds,
  createContactSheet,
  mapConcurrent,
  readJsonIfExists,
  selectUnfinishedItems,
  validateGeneratedImages,
  validatePlannedItems,
  writeJsonAtomic,
} from './lib/vocabulary-visual-pipeline.mjs'
import {
  DEFAULT_VOCABULARY_VISUAL_QUEUE,
  loadVocabularyVisualQueue,
} from './lib/vocabulary-visual-queue.mjs'

const root = process.cwd()
const localEnvPath = resolve(root, '.env.local')

if (existsSync(localEnvPath)) {
  process.loadEnvFile(localEnvPath)
}

const rawArgs = process.argv.slice(2)
const flags = new Set(rawArgs.filter((argument) => argument.startsWith('--')))
const supportedArguments = new Set([
  '--help',
  '--all',
  '--start',
  '--limit',
  '--planner-chunk-size',
  '--planner-concurrency',
  '--image-concurrency',
  '--qa-concurrency',
  '--planner-attempts',
  '--image-attempts',
  '--qa-attempts',
  '--queue',
  '--planner-model',
  '--image-model',
  '--qa-model',
  '--image-size',
  '--image-quality',
  '--state-root',
  '--plan',
  '--generate',
  '--publish',
  '--skip-ai-qa',
  '--retry-failed',
])

for (const argument of flags) {
  if (!supportedArguments.has(argument)) {
    throw new Error(`Unknown pipeline argument: ${argument}.`)
  }
}

if (flags.has('--help')) {
  console.log(`Usage: npm run vocabulary:visuals:pipeline -- [options]

  --limit N                Select N unfinished words (default: 50)
  --start N                Begin scanning at queue position N (default: 1)
  --all                    Publish every remaining 50-word batch sequentially
  --plan                   Plan and validate content without images
  --generate               Plan, generate, verify and sample-check
  --publish                Run the complete pipeline and publish to R2/D1
  --retry-failed           Regenerate only semantic or generation failures
  --skip-ai-qa             Explicitly skip sampled semantic image review
  --image-concurrency N    Concurrent image requests (default: 8)
  --help                   Show this help`)
  process.exit(0)
}

function getArgValue(name, fallback) {
  const index = rawArgs.indexOf(name)

  if (index === -1) return fallback

  const value = rawArgs[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value.`)
  }

  return value
}

function positiveInteger(name, fallback) {
  const value = Number(getArgValue(name, fallback))

  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} must be a positive integer.`)
  }

  return value
}

const options = {
  start: positiveInteger('--start', 1),
  limit: positiveInteger('--limit', 50),
  plannerChunkSize: positiveInteger('--planner-chunk-size', 10),
  plannerConcurrency: positiveInteger('--planner-concurrency', 2),
  imageConcurrency: positiveInteger('--image-concurrency', 8),
  qaConcurrency: positiveInteger('--qa-concurrency', 3),
  plannerAttempts: positiveInteger('--planner-attempts', 3),
  imageAttempts: positiveInteger('--image-attempts', 3),
  qaAttempts: positiveInteger('--qa-attempts', 2),
  queuePath: getArgValue('--queue', DEFAULT_VOCABULARY_VISUAL_QUEUE),
  plannerModel:
    getArgValue('--planner-model', process.env.VOCABULARY_VISUAL_PLANNER_MODEL) ??
    'gpt-5.6-luna',
  imageModel:
    getArgValue('--image-model', process.env.VOCABULARY_VISUAL_IMAGE_MODEL) ??
    'gpt-image-2',
  qaModel:
    getArgValue('--qa-model', process.env.VOCABULARY_VISUAL_QA_MODEL) ??
    'gpt-5.6-luna',
  imageSize:
    getArgValue('--image-size', process.env.VOCABULARY_VISUAL_IMAGE_SIZE) ??
    '1536x1024',
  imageQuality:
    getArgValue('--image-quality', process.env.VOCABULARY_VISUAL_IMAGE_QUALITY) ??
    'medium',
  stateRoot: resolve(
    root,
    getArgValue('--state-root', '.vocabulary-visual-pipeline'),
  ),
  all: flags.has('--all'),
  plan: flags.has('--plan'),
  generate: flags.has('--generate'),
  publish: flags.has('--publish'),
  skipAiQa: flags.has('--skip-ai-qa'),
  retryFailed: flags.has('--retry-failed'),
}

if (options.limit > 100) {
  throw new Error(
    '--limit cannot exceed 100. Use --all --publish to keep large runs recoverable in smaller batches.',
  )
}

const wantsGeneration = options.generate || options.publish
const wantsPlanning = options.plan || wantsGeneration

function requireOpenAIKey() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      'OPENAI_API_KEY is required for --plan, --generate, or --publish. Add it to .env.local or the current shell. The preview command works without it.',
    )
  }
}

function now() {
  return new Date().toISOString()
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))
}

function chunks(items, size) {
  const result = []

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size))
  }

  return result
}

function shortError(error) {
  return error instanceof Error ? error.message : String(error)
}

function plannerInstructions(previousError = '') {
  return `You plan illustrated vocabulary memory scenes for an adult English-learning app.

For every supplied queue item:
- Write one short, natural English sentence containing the exact target word as a standalone case-insensitive token. Do not change its spelling or inflection.
- Write a faithful, concise Chinese translation.
- Describe one concrete image scene that makes the word's meaning clear without requiring captions.
- Write concise Chinese alt text describing the visible scene.
- Choose one fitting illustrated style family. Vary style, palette, subject domain and composition across the chunk.
- Use people, animals, plants, landscapes, weather, tools, buildings, vehicles, machines or everyday objects according to meaning. People are optional.
- A constructive micro-story is welcome when natural, but never force a moral lesson.
- Do not ask the image to contain readable words, letters, numbers, labels, interfaces, logos or watermarks.
- Do not use live-action or photorealistic people. If people appear, visible foreground and midground faces need clear eyes, nose, mouth and expression.
- Make exact quantities, reference, sequence, comparison, boundaries and cause/effect visually explicit, and attach all applicable riskTags.
- Articles and function words may use paired or sequential micro-scenes when that best explains grammar.
- Keep the scene mature and visually attractive, never chibi or glossy toy-like.

Return each vocabularyId exactly once and no extra IDs.${
    previousError ? `\nCorrect this previous validation error: ${previousError}` : ''
  }`
}

function qaSchema() {
  return {
    type: 'object',
    properties: {
      pass: { type: 'boolean' },
      summary: { type: 'string' },
      issues: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['pass', 'summary', 'issues'],
    additionalProperties: false,
  }
}

function saveState(statePath, state) {
  state.updatedAt = now()
  writeJsonAtomic(statePath, state)
}

function createOrLoadState(statePath, batchKey, selected, queuePath) {
  const existing = readJsonIfExists(statePath)

  if (existing) {
    const existingIds = existing.items.map((item) => item.vocabularyId)
    const selectedIds = selected.map((item) => item.vocabularyId)

    if (
      existing.schemaVersion !== PIPELINE_SCHEMA_VERSION ||
      existing.batchKey !== batchKey ||
      JSON.stringify(existingIds) !== JSON.stringify(selectedIds)
    ) {
      throw new Error(
        `Pipeline state at ${statePath} belongs to a different queue selection. Remove or relocate that state directory before starting a new batch.`,
      )
    }

    existing.plansById ??= {}
    existing.generationsById ??= {}
    existing.qa ??= { status: 'pending', resultsById: {} }
    existing.publication ??= { status: 'pending' }
    return existing
  }

  const createdAt = now()
  const date = createdAt.slice(0, 10).replaceAll('-', '')

  return {
    schemaVersion: PIPELINE_SCHEMA_VERSION,
    batchKey,
    batchId: `auto-${batchKey}-${date}`,
    queuePath,
    createdAt,
    updatedAt: createdAt,
    items: selected,
    plansById: {},
    generationsById: {},
    qa: { status: 'pending', resultsById: {} },
    publication: { status: 'pending' },
  }
}

async function planChunk(client, queueItems) {
  let previousError = ''

  for (let attempt = 1; attempt <= options.plannerAttempts; attempt += 1) {
    try {
      const response = await client.responses.create({
        model: options.plannerModel,
        instructions: plannerInstructions(previousError),
        input: JSON.stringify({ items: queueItems }),
        text: {
          format: {
            type: 'json_schema',
            name: 'vocabulary_visual_plan',
            strict: true,
            schema: buildPlannerSchema(queueItems),
          },
        },
      })
      const parsed = JSON.parse(response.output_text)
      return validatePlannedItems(queueItems, parsed.items)
    } catch (error) {
      previousError = shortError(error)

      if (attempt < options.plannerAttempts) {
        await delay(1000 * 2 ** (attempt - 1))
      }
    }
  }

  throw new Error(
    `Planning failed for ${queueItems.map((item) => item.word).join(', ')}: ${previousError}`,
  )
}

async function runPlanning(client, statePath, state) {
  const unplanned = state.items.filter(
    (item) => !state.plansById[item.vocabularyId],
  )

  if (unplanned.length === 0) {
    console.log('Planning: all items already planned; resuming from saved state.')
    return
  }

  const work = chunks(unplanned, options.plannerChunkSize)
  console.log(
    `Planning ${unplanned.length} words in ${work.length} chunks with concurrency ${options.plannerConcurrency}.`,
  )

  await mapConcurrent(work, options.plannerConcurrency, async (chunk) => {
    const plans = await planChunk(client, chunk)

    for (const plan of plans) {
      state.plansById[plan.vocabularyId] = plan
    }
    saveState(statePath, state)
    console.log(`Planned: ${chunk.map((item) => item.word).join(', ')}`)
  })
}

async function isValidExistingImage(filePath) {
  if (!existsSync(filePath)) return false

  try {
    const metadata = await sharp(filePath).metadata()
    const [width, height] = options.imageSize.split('x').map(Number)
    return metadata.width === width && metadata.height === height
  } catch {
    return false
  }
}

async function generateOneImage(client, manifest, item, sourceDir, statePath, state) {
  const filePath = join(sourceDir, `${item.word}.png`)
  const saved = state.generationsById[item.vocabularyId]

  if (saved?.status === 'succeeded' && (await isValidExistingImage(filePath))) {
    return { word: item.word, status: 'reused' }
  }

  let lastError = ''
  const startingAttempts = saved?.attempts ?? 0

  for (let attempt = 1; attempt <= options.imageAttempts; attempt += 1) {
    const totalAttempt = startingAttempts + attempt
    state.generationsById[item.vocabularyId] = {
      status: 'generating',
      attempts: totalAttempt,
      imagePath: filePath,
      lastError,
    }
    saveState(statePath, state)

    try {
      const response = await client.images.generate({
        model: options.imageModel,
        prompt: buildImagePrompt(
          manifest,
          item,
          lastError ? `The prior attempt failed validation or generation: ${lastError}` : '',
        ),
        size: options.imageSize,
        quality: options.imageQuality,
        output_format: 'png',
        background: 'opaque',
      })
      const base64 = response.data?.[0]?.b64_json

      if (!base64) {
        throw new Error('The image API returned no base64 image data.')
      }

      writeFileSync(filePath, Buffer.from(base64, 'base64'))

      if (!(await isValidExistingImage(filePath))) {
        throw new Error(`Generated image does not match ${options.imageSize}.`)
      }

      state.generationsById[item.vocabularyId] = {
        status: 'succeeded',
        attempts: totalAttempt,
        imagePath: filePath,
        completedAt: now(),
        lastError: '',
      }
      saveState(statePath, state)
      console.log(`Generated: ${item.word}`)
      return { word: item.word, status: 'succeeded' }
    } catch (error) {
      lastError = shortError(error)
      state.generationsById[item.vocabularyId] = {
        status: 'failed',
        attempts: totalAttempt,
        imagePath: filePath,
        lastError,
      }
      saveState(statePath, state)

      if (attempt < options.imageAttempts) {
        await delay(1500 * 2 ** (attempt - 1))
      }
    }
  }

  return { word: item.word, status: 'failed', error: lastError }
}

async function runGeneration(client, manifest, sourceDir, statePath, state) {
  mkdirSync(sourceDir, { recursive: true })
  console.log(
    `Generating ${manifest.items.length} images with concurrency ${options.imageConcurrency}; completed files will be reused.`,
  )
  const results = await mapConcurrent(
    manifest.items,
    options.imageConcurrency,
    (item) => generateOneImage(client, manifest, item, sourceDir, statePath, state),
  )
  const failed = results.filter((result) => result.status === 'failed')

  if (failed.length) {
    throw new Error(
      `${failed.length} image requests failed after retries: ${failed
        .map((result) => `${result.word} (${result.error})`)
        .join('; ')}`,
    )
  }
}

function resetFailedItems(manifest, sourceDir, statePath, state) {
  const failedIds = new Set(
    Object.entries(state.generationsById)
      .filter(([, generation]) => generation.status === 'failed')
      .map(([vocabularyId]) => vocabularyId),
  )

  for (const [vocabularyId, result] of Object.entries(
    state.qa?.resultsById ?? {},
  )) {
    if (result.pass === false && !result.technicalFailure) {
      failedIds.add(vocabularyId)
    }
  }

  for (const vocabularyId of failedIds) {
    const item = manifest.items.find(
      (candidate) => candidate.vocabularyId === vocabularyId,
    )
    if (!item) continue

    const filePath = join(sourceDir, `${item.word}.png`)
    if (existsSync(filePath)) unlinkSync(filePath)
    delete state.generationsById[vocabularyId]
  }

  if (failedIds.size) {
    state.qa = { status: 'pending', resultsById: {} }
    state.publication = { status: 'pending' }
    saveState(statePath, state)
    console.log(`Reset ${failedIds.size} failed images for targeted regeneration.`)
  }
}

async function inspectOneImage(client, item, sourceDir) {
  const imagePath = join(sourceDir, `${item.word}.png`)
  const imageData = readFileSync(imagePath).toString('base64')
  let lastError = ''

  for (let attempt = 1; attempt <= options.qaAttempts; attempt += 1) {
    try {
      const response = await client.responses.create({
        model: options.qaModel,
        instructions:
          'You are a strict visual QA reviewer. Judge only what is visibly supported by the supplied image. A failed criterion makes pass false.',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: `Review this vocabulary memory image.
Target word: ${item.word}
English sentence: ${item.sentenceEn}
Chinese sentence: ${item.sentenceZh}
Intended scene: ${item.scene}
Risk tags: ${(item.riskTags ?? []).join(', ') || 'none'}

Pass only when: the image clearly supports the target word and sentence; exact quantities, reference, order, comparison, spatial relation or cause/effect are correct when tagged; there is no readable text, logo or watermark; it is clearly illustrated rather than live-action or photorealistic-human; and every readable foreground or midground human face has eyes, nose, mouth and an appropriate expression. Tiny or genuinely turned-away faces are allowed.`,
              },
              {
                type: 'input_image',
                image_url: `data:image/png;base64,${imageData}`,
                detail: 'high',
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'vocabulary_visual_qa',
            strict: true,
            schema: qaSchema(),
          },
        },
      })
      const result = JSON.parse(response.output_text)

      if (
        typeof result.pass !== 'boolean' ||
        typeof result.summary !== 'string' ||
        !result.summary.trim() ||
        !Array.isArray(result.issues) ||
        result.issues.some(
          (issue) => typeof issue !== 'string' || !issue.trim(),
        )
      ) {
        throw new Error('QA returned an invalid result.')
      }

      return { ...result, reviewedAt: now() }
    } catch (error) {
      lastError = shortError(error)
      if (attempt < options.qaAttempts) await delay(1000 * 2 ** (attempt - 1))
    }
  }

  return {
    pass: false,
    summary: 'Automated visual QA could not complete.',
    issues: [lastError],
    reviewedAt: now(),
    technicalFailure: true,
  }
}

async function runQualityChecks(
  client,
  manifest,
  sourceDir,
  preparedDir,
  statePath,
  state,
) {
  const imageMetadata = await validateGeneratedImages(
    manifest,
    sourceDir,
    options.imageSize,
  )
  const contactSheetPath = join(preparedDir, `${state.batchKey}-contact-sheet.jpg`)
  await createContactSheet(manifest, sourceDir, contactSheetPath)
  state.qa.deterministic = {
    status: 'passed',
    checkedAt: now(),
    imageMetadata,
    contactSheetPath,
  }
  saveState(statePath, state)
  console.log(`Deterministic QA passed. Contact sheet: ${contactSheetPath}`)

  if (options.skipAiQa) {
    state.qa.status = 'passed_without_ai_sample'
    state.qa.sampledIds = []
    saveState(statePath, state)
    console.log('AI sample QA skipped by explicit --skip-ai-qa.')
    return
  }

  if (state.qa.status === 'passed') {
    console.log('AI sample QA already passed; resuming from saved state.')
    return
  }

  const sample = chooseQaSample(manifest.items, {
    ratio: 0.1,
    minimum: 5,
    seed: state.batchId,
  })
  state.qa.status = 'reviewing'
  state.qa.sampledIds = sample.map((item) => item.vocabularyId)
  state.qa.resultsById = {}
  saveState(statePath, state)
  console.log(
    `Running semantic QA on ${sample.length} sampled images with concurrency ${options.qaConcurrency}.`,
  )

  await mapConcurrent(sample, options.qaConcurrency, async (item) => {
    const result = await inspectOneImage(client, item, sourceDir)
    state.qa.resultsById[item.vocabularyId] = result
    saveState(statePath, state)
    console.log(`QA ${result.pass ? 'passed' : 'failed'}: ${item.word}`)
  })

  const failures = sample.filter(
    (item) => state.qa.resultsById[item.vocabularyId]?.pass !== true,
  )
  state.qa.status = failures.length ? 'failed' : 'passed'
  state.qa.completedAt = now()
  saveState(statePath, state)

  if (failures.length) {
    throw new Error(
      `Sample QA failed for ${failures.map((item) => item.word).join(', ')}. Review ${contactSheetPath}, then rerun with --generate --retry-failed. Nothing was published.`,
    )
  }
}

function runPublisher(manifestPath, sourceDir, preparedDir) {
  const publisherPath = resolve(root, 'scripts/publish-vocabulary-visuals.mjs')

  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(
      process.execPath,
      [
        publisherPath,
        '--manifest',
        manifestPath,
        '--source-dir',
        sourceDir,
        '--prepared-dir',
        preparedDir,
        '--publish',
      ],
      { cwd: root, env: process.env, stdio: 'inherit' },
    )

    child.on('error', rejectRun)
    child.on('close', (code) => {
      if (code === 0) resolveRun()
      else rejectRun(new Error(`Vocabulary visual publisher exited with code ${code}.`))
    })
  })
}

function runChildPipeline(childArgs) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, [process.argv[1], ...childArgs], {
      cwd: root,
      env: process.env,
      stdio: 'inherit',
    })

    child.on('error', rejectRun)
    child.on('close', (code, signal) => {
      if (code === 0) {
        resolveRun()
        return
      }

      rejectRun(
        new Error(
          `Automated batch exited with code ${code ?? 'unknown'} and signal ${signal ?? 'none'}.`,
        ),
      )
    })
  })
}

async function runAllBatches() {
  if (!options.publish) {
    throw new Error('--all requires --publish so completed batches can advance the queue.')
  }

  requireOpenAIKey()
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    throw new Error(
      'CLOUDFLARE_API_TOKEN is required for --all --publish. Nothing has been generated or uploaded.',
    )
  }

  const { queue } = loadVocabularyVisualQueue(options.queuePath)
  const manifestDir = resolve(root, 'scripts/fixtures')
  const childArgs = rawArgs.filter((argument) => argument !== '--all')
  let completedBatchCount = 0

  while (true) {
    const before = completedVocabularyIds(manifestDir)
    const remaining = queue.items.filter(
      (item) => item.position >= options.start && !before.has(item.vocabularyId),
    )

    if (remaining.length === 0) {
      console.log(
        `All vocabulary visuals at or after position ${options.start} are complete. Published ${completedBatchCount} batches in this run.`,
      )
      return
    }

    console.log(
      `Starting automated batch ${completedBatchCount + 1}; ${remaining.length} unfinished words remain.`,
    )
    await runChildPipeline(childArgs)

    const after = completedVocabularyIds(manifestDir)
    if (after.size <= before.size) {
      throw new Error(
        'The child batch completed without advancing the checked-in manifest inventory. Stopping to avoid an infinite loop.',
      )
    }
    completedBatchCount += 1
  }
}

if (options.all) {
  await runAllBatches()
  process.exit(0)
}

const { path: resolvedQueuePath, queue } = loadVocabularyVisualQueue(
  options.queuePath,
)
const manifestDir = resolve(root, 'scripts/fixtures')
const completedIds = completedVocabularyIds(manifestDir)
const { selected, skippedCompleted } = selectUnfinishedItems(queue, {
  start: options.start,
  limit: options.limit,
  completedIds,
})
const batchKey = buildBatchKey(selected)
const stateDir = join(options.stateRoot, batchKey)
const statePath = join(stateDir, 'state.json')
const runtimeManifestPath = join(stateDir, 'manifest.json')
const sourceDir = resolve(root, 'output/vocabulary-visuals', `auto-${batchKey}`)
const preparedDir = resolve(root, 'tmp/vocabulary-visuals', `auto-${batchKey}`)
const state = createOrLoadState(
  statePath,
  batchKey,
  selected,
  resolvedQueuePath,
)
saveState(statePath, state)

console.log(`Batch: ${batchKey}`)
console.log(
  `Selected ${selected.length} unfinished words from queue positions ${selected[0].position}-${selected.at(-1).position}.`,
)
if (skippedCompleted.length) {
  console.log(`Skipped ${skippedCompleted.length} completed words in the scanned range.`)
}
console.log(`State: ${statePath}`)
console.log(
  `Progress: ${Object.keys(state.plansById).length}/${state.items.length} planned, ${
    Object.values(state.generationsById).filter(
      (generation) => generation.status === 'succeeded',
    ).length
  }/${state.items.length} images, QA ${state.qa.status}, publication ${state.publication.status}.`,
)

if (!wantsPlanning) {
  console.log(
    'Preview only: no OpenAI request, image generation, R2 upload, or D1 write was performed.',
  )
  console.log('Add --generate to plan, generate and sample-check this batch.')
  process.exit(0)
}

requireOpenAIKey()
if (options.publish && !process.env.CLOUDFLARE_API_TOKEN) {
  throw new Error(
    'CLOUDFLARE_API_TOKEN is required for --publish. Nothing has been generated or uploaded.',
  )
}
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

await runPlanning(client, statePath, state)
const plans = state.items.map((item) => state.plansById[item.vocabularyId])
const manifest = buildManifest(state.items, plans, { batchId: state.batchId })
writeJsonAtomic(runtimeManifestPath, manifest)
state.manifestPath = runtimeManifestPath
state.manifestStatus = 'ready'
saveState(statePath, state)
console.log(`Manifest ready: ${runtimeManifestPath}`)

if (!wantsGeneration) {
  console.log('Planning complete. No image request or production write was performed.')
  process.exit(0)
}

if (options.retryFailed) {
  resetFailedItems(manifest, sourceDir, statePath, state)
}

await runGeneration(client, manifest, sourceDir, statePath, state)
await runQualityChecks(
  client,
  manifest,
  sourceDir,
  preparedDir,
  statePath,
  state,
)

if (!options.publish) {
  console.log('Generation and QA complete. Nothing was published.')
  console.log(`Contact sheet: ${state.qa.deterministic.contactSheetPath}`)
  process.exit(0)
}

if (!['passed', 'passed_without_ai_sample'].includes(state.qa.status)) {
  throw new Error(`Cannot publish while QA status is ${state.qa.status}.`)
}

state.publication = { status: 'publishing', startedAt: now() }
saveState(statePath, state)

try {
  await runPublisher(runtimeManifestPath, sourceDir, preparedDir)
  const fixturePath = join(
    manifestDir,
    `vocabulary-visuals-auto-${batchKey}.json`,
  )
  copyFileSync(runtimeManifestPath, fixturePath)
  state.publication = {
    status: 'published',
    completedAt: now(),
    fixturePath,
  }
  saveState(statePath, state)
  console.log(`Published ${manifest.items.length} visuals and recorded ${basename(fixturePath)}.`)
} catch (error) {
  state.publication = {
    status: 'failed',
    failedAt: now(),
    lastError: shortError(error),
  }
  saveState(statePath, state)
  throw error
}
