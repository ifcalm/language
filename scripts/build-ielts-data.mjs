// Generates the static IELTS vocabulary data under src/data/ielts/generated/.
//
// - Words, meanings, US spellings, IPA and audio come from the D1 snapshot
//   scripts/fixtures/ielts-d1.json (refresh with `npm run ielts:export`).
// - Modules, topics, sub-groups and word order still come from
//   docs/ielts-vocabulary.md until the topic tables move to D1; only the
//   entry ids are read from it, so its meanings no longer matter.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { IELTS_SOURCE_PATH, parseSenses, readIeltsSource } from './lib/ielts-vocabulary-source.mjs'

const SNAPSHOT_PATH = 'scripts/fixtures/ielts-d1.json'
const OUTPUT_DIR = 'src/data/ielts/generated'
const CHECK_ONLY = process.argv.includes('--check')
// Keep in sync with IELTS_OWN_AUDIO_BASE_URL in src/data/ielts/index.ts.
const AUDIO_BASE_URL = 'https://assets.english.ifcalm.org/ielts/pronunciations/v1'

if (!existsSync(SNAPSHOT_PATH)) {
  throw new Error(`Missing ${SNAPSHOT_PATH}; run npm run ielts:export first.`)
}

const snapshot = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8'))
const wordsById = new Map(snapshot.words.map((word) => [word.id, word]))
const pronunciationsByWord = new Map()

for (const row of snapshot.pronunciations) {
  const audioKey = row.pos ? `${row.wordId}-${row.pos.replace(/\./g, '')}` : row.wordId

  // The front end derives audio URLs from ids; refuse anything that breaks that.
  if (row.audioUrl && row.audioUrl !== `${AUDIO_BASE_URL}/${row.accent}/${audioKey}.m4a`) {
    throw new Error(`Unexpected audio_url for ${row.id}: ${row.audioUrl}`)
  }

  if (!pronunciationsByWord.has(row.wordId)) {
    pronunciationsByWord.set(row.wordId, [])
  }

  pronunciationsByWord.get(row.wordId).push(row)
}

function toEntry(sourceEntry, topicId) {
  const word = wordsById.get(sourceEntry.id)

  if (!word) {
    throw new Error(`"${sourceEntry.word}" (${sourceEntry.id}) is in ${IELTS_SOURCE_PATH} but not in D1`)
  }

  const senses = parseSenses(word.meaningZh)
  const result = { id: word.id, word: word.word, topicId, senses }

  if (sourceEntry.group !== undefined) {
    result.group = sourceEntry.group
  }

  if (word.spellingUs) {
    result.spellingUs = word.spellingUs
  }

  const rows = pronunciationsByWord.get(word.id) ?? []
  const find = (accent, pos) => rows.find((row) => row.accent === accent && row.pos === pos)
  const posRows = [...new Set(rows.filter((row) => row.pos).map((row) => row.pos))]

  if (posRows.length > 0) {
    // Order parts of speech as the meanings list them.
    const order = senses.flatMap((sense) => sense.pos.split(/(?<=\.)\//))
    posRows.sort((a, b) => order.indexOf(a) - order.indexOf(b))
    result.phoneticUk = find('uk', posRows[0]).phonetic
    result.phoneticUs = find('us', posRows[0]).phonetic
    result.posPhonetics = posRows.map((pos) => {
      const uk = find('uk', pos)
      const us = find('us', pos)
      return { pos, uk: uk.phonetic, us: us.phonetic, ...(uk.audioUrl && us.audioUrl ? { audio: true } : {}) }
    })
  } else {
    const uk = find('uk', null)
    const us = find('us', null)

    if (uk?.phonetic) {
      result.phoneticUk = uk.phonetic
    }

    if (us?.phonetic) {
      result.phoneticUs = us.phonetic
    }

    if (uk?.audioUrl && us?.audioUrl) {
      result.audio = true
    }
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
const placed = new Set()

for (const module of modules) {
  const entries = module.topics.flatMap((topic) =>
    topic.entries.map((entry) => {
      placed.add(entry.id)
      return toEntry(entry, topic.id)
    }),
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

const unplaced = snapshot.words.filter((word) => !placed.has(word.id))

if (unplaced.length > 0) {
  throw new Error(
    `D1 words without a topic in ${IELTS_SOURCE_PATH}: ${unplaced.map((word) => word.id).join(', ')}`,
  )
}

files.set('catalog.json', catalog)

let missingPhonetic = 0
let missingAudio = 0

for (const { entries } of [...files.values()].filter((file) => file.entries)) {
  missingPhonetic += entries.filter((entry) => !entry.phoneticUk && !entry.phoneticUs).length
  missingAudio += entries.filter(
    (entry) => !entry.audio && !entry.posPhonetics?.some((row) => row.audio),
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
