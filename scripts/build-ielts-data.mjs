// Generates the static IELTS vocabulary data under src/data/ielts/ from
// docs/ielts-vocabulary.md (the single source of truth) plus the pronunciation
// fixture produced by scripts/fetch-ielts-pronunciations.mjs.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import {
  IELTS_SOURCE_PATH,
  normalizeWord,
  readIeltsSource,
} from './lib/ielts-vocabulary-source.mjs'

const PRONUNCIATIONS_PATH = 'scripts/fixtures/ielts-pronunciations.json'
const OUTPUT_DIR = 'src/data/ielts/generated'
const CHECK_ONLY = process.argv.includes('--check')
// Keep in sync with IELTS_AUDIO_BASE_URL in src/data/ielts/index.ts.
const AUDIO_BASE_URL = 'https://assets.english.ifcalm.org/pronunciations'

const pronunciations = existsSync(PRONUNCIATIONS_PATH)
  ? JSON.parse(readFileSync(PRONUNCIATIONS_PATH, 'utf8'))
  : {}

function toEntry(entry, topicId) {
  const pronunciation = pronunciations[normalizeWord(entry.word)] ?? {}
  const result = { id: entry.id, word: entry.word, topicId, senses: entry.senses }

  for (const key of ['phoneticUk', 'phoneticUs']) {
    if (pronunciation[key]) {
      result[key] = pronunciation[key]
    }
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
    })),
  })
  files.set(`${module.id}.json`, { moduleId: module.id, entries })
}

files.set('catalog.json', catalog)

let missingPhonetic = 0
let missingAudio = 0

for (const { entries } of [...files.values()].filter((file) => file.entries)) {
  missingPhonetic += entries.filter((entry) => !entry.phoneticUk && !entry.phoneticUs).length
  missingAudio += entries.filter((entry) => !entry.audioKey).length
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
