import { spawn } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import {
  buildBatchKey,
  buildImagePrompt,
  buildManifestDraft,
  chooseQaSample,
  completedVocabularyIds,
  createContactSheet,
  findInflectedTargetWords,
  readJsonIfExists,
  selectUnfinishedItems,
  validateGeneratedImages,
  validateManifestMetadata,
  validatePlannedItems,
  writeJsonAtomic,
} from './lib/vocabulary-visual-pipeline.mjs'
import {
  DEFAULT_VOCABULARY_VISUAL_QUEUE,
  loadVocabularyVisualQueue,
  validateManifestAgainstQueue,
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
  '--start',
  '--limit',
  '--queue',
  '--batch',
  '--manifest',
  '--source-dir',
  '--prepared-dir',
  '--image-size',
  '--prepare',
  '--validate',
  '--check-images',
  '--publish',
])

for (const argument of flags) {
  if (!supportedArguments.has(argument)) {
    throw new Error(`Unknown pipeline argument: ${argument}.`)
  }
}

if (flags.has('--help')) {
  console.log(`Usage: npm run vocabulary:visuals:pipeline -- [step] [options]

Images are produced by the agent's built-in image generation, not by a model API.
This tool selects the batch, validates agent-authored content, checks the rendered
images and publishes them.

Steps (run in order):
  (no step)        Preview the next unfinished batch without writing anything
  --prepare        Write a manifest draft the agent fills with sentences and scenes
  --validate       Check the filled manifest against the queue and content rules
  --check-images   Verify rendered images, build a contact sheet, pick QA samples
  --publish        Re-run both checks, upload to R2/D1, then record the fixture

Options:
  --limit N        Words per batch for --prepare (default: 20, maximum: 50)
  --start N        Begin scanning at queue position N (default: 1)
  --batch KEY      Batch key such as rank-1959-1979 for steps after --prepare
  --manifest PATH  Manifest path override (default: tmp/vocabulary-visuals/KEY/manifest.json)
  --source-dir DIR Rendered image directory (default: output/vocabulary-visuals/KEY)
  --image-size WxH Expected rendered image size (default: 1536x1024)
  --help           Show this help`)
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
  limit: positiveInteger('--limit', 20),
  queuePath: getArgValue('--queue', DEFAULT_VOCABULARY_VISUAL_QUEUE),
  batch: getArgValue('--batch', ''),
  manifest: getArgValue('--manifest', ''),
  sourceDir: getArgValue('--source-dir', ''),
  preparedDir: getArgValue('--prepared-dir', ''),
  imageSize: getArgValue('--image-size', '1536x1024'),
  prepare: flags.has('--prepare'),
  validate: flags.has('--validate'),
  checkImages: flags.has('--check-images'),
  publish: flags.has('--publish'),
}

if (options.limit > 50) {
  throw new Error(
    '--limit cannot exceed 50. Agent-generated batches stay small so a bad scene is cheap to redo.',
  )
}

const manifestDir = resolve(root, 'scripts/fixtures')
const { path: resolvedQueuePath, queue } = loadVocabularyVisualQueue(
  options.queuePath,
)

function batchPaths(batchKey) {
  return {
    manifestPath: resolve(
      root,
      options.manifest || join('tmp/vocabulary-visuals', batchKey, 'manifest.json'),
    ),
    sourceDir: resolve(
      root,
      options.sourceDir || join('output/vocabulary-visuals', batchKey),
    ),
    preparedDir: resolve(
      root,
      options.preparedDir || join('tmp/vocabulary-visuals', batchKey),
    ),
  }
}

function selectBatch() {
  const completedIds = completedVocabularyIds(manifestDir)
  const { selected, skippedCompleted } = selectUnfinishedItems(queue, {
    start: options.start,
    limit: options.limit,
    completedIds,
  })

  return { selected, skippedCompleted, batchKey: buildBatchKey(selected) }
}

function loadBatch() {
  if (!options.batch && !options.manifest) {
    throw new Error(
      'This step needs --batch rank-X-Y (or --manifest PATH) so it knows which batch to read.',
    )
  }

  const paths = batchPaths(options.batch)
  const manifest = readJsonIfExists(paths.manifestPath)

  if (!manifest) {
    throw new Error(
      `No manifest at ${paths.manifestPath}. Run --prepare first, or pass --manifest.`,
    )
  }

  const batchKey = options.batch || manifest.batchKey

  if (!batchKey) {
    throw new Error(
      `${paths.manifestPath} has no batchKey. Pass --batch rank-X-Y explicitly.`,
    )
  }

  return { manifest, batchKey, ...batchPaths(batchKey), ...paths }
}

function validateBatch(manifest) {
  const queueRange = validateManifestAgainstQueue(manifest, queue)

  validateManifestMetadata(manifest)
  validatePlannedItems(queueRange.items, manifest.items)

  return queueRange
}

function writePrompts(manifest, preparedDir) {
  const promptsPath = join(preparedDir, 'prompts.md')
  const body = manifest.items
    .map(
      (item, index) =>
        `## ${index + 1}. ${item.word} — ${item.meaningZh}\n\n\`\`\`\n${buildImagePrompt(
          manifest,
          item,
        )}\n\`\`\`\n`,
    )
    .join('\n')

  mkdirSync(preparedDir, { recursive: true })
  writeFileSync(promptsPath, `# ${manifest.batchId} image prompts\n\n${body}`)

  return promptsPath
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
        '--queue',
        options.queuePath,
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

async function checkImages(manifest, batchKey, sourceDir, preparedDir) {
  const imageMetadata = await validateGeneratedImages(
    manifest,
    sourceDir,
    options.imageSize,
  )
  const contactSheetPath = join(preparedDir, `${batchKey}-contact-sheet.jpg`)

  mkdirSync(preparedDir, { recursive: true })
  await createContactSheet(manifest, sourceDir, contactSheetPath)

  const sample = chooseQaSample(manifest.items, {
    ratio: 0.1,
    minimum: 5,
    seed: manifest.batchId,
  })

  console.log(
    `Image checks passed for ${imageMetadata.length} images at ${options.imageSize}.`,
  )
  console.log(`Contact sheet: ${contactSheetPath}`)
  console.log(
    `Review the full sheet, then inspect these samples in detail: ${sample
      .map((item) => item.word)
      .join(', ')}.`,
  )

  return { contactSheetPath, sample }
}

if (options.prepare) {
  const { selected, skippedCompleted, batchKey } = selectBatch()
  const { manifestPath, sourceDir, preparedDir } = batchPaths(batchKey)
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const draft = buildManifestDraft(selected, {
    batchKey,
    batchId: `auto-${batchKey}-${date}`,
  })

  if (existsSync(manifestPath)) {
    throw new Error(
      `${manifestPath} already exists. Edit it directly, or remove it to start over.`,
    )
  }

  writeJsonAtomic(manifestPath, draft)
  mkdirSync(sourceDir, { recursive: true })

  console.log(`Batch: ${batchKey} (${selected.length} words)`)
  if (skippedCompleted.length) {
    console.log(`Skipped ${skippedCompleted.length} completed words in the scanned range.`)
  }
  console.log(`Queue: ${resolvedQueuePath}`)
  console.log(`Draft manifest: ${manifestPath}`)
  console.log(`Fill styleFamily, sentenceEn, sentenceZh, scene, altText and riskTags for every item.`)
  console.log(`Render each image as ${sourceDir}/<word>.png at ${options.imageSize}.`)
  console.log(`Next: npm run vocabulary:visuals:pipeline -- --batch ${batchKey} --validate`)
  console.log(`Prepared output stays in ${preparedDir}.`)
  process.exit(0)
}

if (options.validate || options.checkImages || options.publish) {
  const { manifest, batchKey, manifestPath, sourceDir, preparedDir } = loadBatch()
  const queueRange = validateBatch(manifest)
  const promptsPath = writePrompts(manifest, preparedDir)

  console.log(`Batch: ${batchKey} (${manifest.items.length} words)`)
  console.log(
    queueRange.contiguous
      ? `Content checks passed for queue positions ${queueRange.start}-${queueRange.end}.`
      : `Content checks passed for ${queueRange.positions.length} queue positions.`,
  )
  console.log(`Image prompts: ${promptsPath}`)

  const inflected = findInflectedTargetWords(manifest.items)

  if (inflected.length) {
    console.log(
      `Note: ${inflected.length} sentences use an inflected target word rather than the headword: ${inflected.join(', ')}.`,
    )
  }

  if (!options.checkImages && !options.publish) {
    console.log(`Render each image as ${sourceDir}/<word>.png at ${options.imageSize}.`)
    console.log(
      `Next: npm run vocabulary:visuals:pipeline -- --batch ${batchKey} --check-images`,
    )
    process.exit(0)
  }

  await checkImages(manifest, batchKey, sourceDir, preparedDir)

  if (!options.publish) {
    console.log('Nothing was published.')
    console.log(
      `Next: npm run vocabulary:visuals:pipeline -- --batch ${batchKey} --publish`,
    )
    process.exit(0)
  }

  if (!process.env.CLOUDFLARE_API_TOKEN) {
    throw new Error(
      'CLOUDFLARE_API_TOKEN is required for --publish. Nothing has been uploaded.',
    )
  }

  await runPublisher(manifestPath, sourceDir, preparedDir)

  const fixturePath = join(manifestDir, `vocabulary-visuals-${batchKey}.json`)
  const replacingFixture = existsSync(fixturePath)

  copyFileSync(manifestPath, fixturePath)
  console.log(
    `${replacingFixture ? 'Replaced' : 'Recorded'} ${basename(fixturePath)}; those words are now complete in the local ledger.`,
  )
  process.exit(0)
}

const { selected, skippedCompleted, batchKey } = selectBatch()

console.log(`Next batch: ${batchKey} (${selected.length} words)`)
console.log(
  `Queue positions ${selected[0].position}-${selected.at(-1).position} of ${queue.total}.`,
)
if (skippedCompleted.length) {
  console.log(`Skipped ${skippedCompleted.length} completed words in the scanned range.`)
}
console.log(selected.map((item) => `${item.position} ${item.word}`).join('\n'))
console.log(
  `\nPreview only: nothing was written. Start with: npm run vocabulary:visuals:pipeline -- --limit ${options.limit} --prepare`,
)
