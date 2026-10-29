// Generates the static IELTS vocabulary data under src/data/ielts/ from
// docs/ielts-vocabulary.md (the single source of truth), the IPA fixture from
// scripts/build-ielts-phonetics.mjs plus its hand-written overrides, and the
// audio fixture from scripts/fetch-ielts-pronunciations.mjs.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import {
  IELTS_SOURCE_PATH,
  normalizeWord,
  readIeltsSource,
} from './lib/ielts-vocabulary-source.mjs'

const PRONUNCIATIONS_PATH = 'scripts/fixtures/ielts-pronunciations.json'
const PHONETICS_PATH = 'scripts/fixtures/ielts-phonetics.json'
const PHONETIC_OVERRIDES_PATH = 'scripts/fixtures/ielts-phonetics-overrides.json'
// Keys of IELTS audio confirmed on R2 (written by scripts/upload-ielts-audio.mjs).
const AUDIO_FIXTURE_PATH = 'scripts/fixtures/ielts-audio.json'
const OUTPUT_DIR = 'src/data/ielts/generated'
const CHECK_ONLY = process.argv.includes('--check')
// Keep in sync with IELTS_AUDIO_BASE_URL in src/data/ielts/index.ts.
const AUDIO_BASE_URL = 'https://assets.english.ifcalm.org/pronunciations'

function readJson(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {}
}

const pronunciations = readJson(PRONUNCIATIONS_PATH)
const phonetics = readJson(PHONETICS_PATH)
const phoneticOverrides = readJson(PHONETIC_OVERRIDES_PATH)
const ieltsAudioKeys = existsSync(AUDIO_FIXTURE_PATH)
  ? new Set(readJson(AUDIO_FIXTURE_PATH).keys)
  : null

// Mirrors the file naming in scripts/generate-ielts-audio.mjs: increase-n, increase-v.
function posAudioKey(id, pos) {
  return `${id}-${pos.replace(/\./g, '')}`
}

function hasIeltsAudio(key) {
  return ieltsAudioKeys.has(`uk/${key}`) && ieltsAudioKeys.has(`us/${key}`)
}

// Entry-level IPA plus, for words whose stress changes with part of speech,
// one { pos, uk, us } row per part of speech the entry actually uses.
function resolvePhonetics(entry) {
  const key = normalizeWord(entry.word)
  const override = phoneticOverrides[key] ?? {}

  if (override.byPos) {
    const usedPos = entry.senses.flatMap((sense) => sense.pos.split(/(?<=\.)\//))
    const rows = [...new Set(usedPos)]
      .filter((pos) => override.byPos[pos])
      .map((pos) => ({ pos, uk: override.byPos[pos].uk, us: override.byPos[pos].us }))

    if (rows.length === 0) {
      throw new Error(`byPos override for "${entry.word}" matches none of its parts of speech`)
    }

    return { uk: rows[0].uk, us: rows[0].us, posPhonetics: rows.length > 1 ? rows : undefined }
  }

  return {
    uk: override.uk ?? phonetics[key]?.uk ?? null,
    us: override.us ?? phonetics[key]?.us ?? null,
  }
}

function toEntry(entry, topicId) {
  const pronunciation = pronunciations[normalizeWord(entry.word)] ?? {}
  const result = { id: entry.id, word: entry.word, topicId, senses: entry.senses }

  if (entry.group !== undefined) {
    result.group = entry.group
  }

  const resolved = resolvePhonetics(entry)

  if (resolved.uk) {
    result.phoneticUk = resolved.uk
  }

  if (resolved.us) {
    result.phoneticUs = resolved.us
  }

  if (resolved.posPhonetics) {
    result.posPhonetics = resolved.posPhonetics
  }

  // IELTS audio (own R2 folder, named by entry id) replaces the reused COCA
  // audio once uploaded.
  if (ieltsAudioKeys) {
    if (result.posPhonetics) {
      result.posPhonetics = result.posPhonetics.map((row) =>
        hasIeltsAudio(posAudioKey(entry.id, row.pos)) ? { ...row, audio: true } : row,
      )
    } else if (hasIeltsAudio(entry.id)) {
      result.audio = true
    }

    return result
  }

  // Audio follows {base}/{uk|us}/{key}.m4a; store only the key to keep chunks small.
  const audioKey = pronunciation.audioUk?.match(/\/uk\/([^/]+)\.m4a$/)?.[1]

  if (
    audioKey &&
    pronunciation.audioUk === `${AUDIO_BASE_URL}/uk/${audioKey}.m4a` &&
    pronunciation.audioUs === `${AUDIO_BASE_URL}/us/${audioKey}.m4a`
  ) {
    result.audioKey = audioKey
  } else if (pronunciation.audioUk || pronunciation.audioUs) {
    throw new Error(`Unexpected audio URL layout for "${entry.word}"`)
  }

  return result
}

const modules = readIeltsSource()
const files = new Map()
const catalog = {
  source: IELTS_SOURCE_PATH,
  entryCount: 0,
  modules: [],
}

for (const module of modules) {
  const entries = module.topics.flatMap((topic) =>
    topic.entries.map((entry) => toEntry(entry, topic.id)),
  )

  catalog.entryCount += entries.length
  catalog.modules.push({
    id: module.id,
    name: module.name,
    nameEn: module.nameEn,
    description: module.description,
    entryCount: entries.length,
    topics: module.topics.map((topic) => ({
      id: topic.id,
      order: topic.order,
      title: topic.title,
      entryCount: topic.entries.length,
      ...(topic.groups.length > 0 ? { groups: topic.groups } : {}),
    })),
  })
  files.set(`${module.id}.json`, { moduleId: module.id, entries })
}

files.set('catalog.json', catalog)

let missingPhonetic = 0
let missingAudio = 0

for (const { entries } of [...files.values()].filter((file) => file.entries)) {
  missingPhonetic += entries.filter((entry) => !entry.phoneticUk && !entry.phoneticUs).length
  missingAudio += entries.filter(
    (entry) => !entry.audioKey && !entry.audio && !entry.posPhonetics?.some((row) => row.audio),
  ).length
}

if (CHECK_ONLY) {
  const stale = [...files].filter(([name, data]) => {
    const path = `${OUTPUT_DIR}/${name}`
    return !existsSync(path) || readFileSync(path, 'utf8') !== `${JSON.stringify(data)}\n`
  })

  if (stale.length > 0) {
    console.error(`Stale IELTS data: ${stale.map(([name]) => name).join(', ')}. Run npm run ielts:build.`)
    process.exit(1)
  }

  console.log('IELTS data is up to date.')
} else {
  rmSync(OUTPUT_DIR, { recursive: true, force: true })
  mkdirSync(OUTPUT_DIR, { recursive: true })

  for (const [name, data] of files) {
    writeFileSync(`${OUTPUT_DIR}/${name}`, `${JSON.stringify(data)}\n`)
  }

  for (const module of catalog.modules) {
    console.log(`${module.name}: ${module.topics.length} topics, ${module.entryCount} entries`)
  }

  console.log(
    `Total ${catalog.entryCount} entries; without phonetic ${missingPhonetic}, without audio ${missingAudio}.`,
  )
}
