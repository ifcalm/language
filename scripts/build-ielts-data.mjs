// Generates the static IELTS vocabulary data under src/data/ielts/generated/
// and the readable docs/ielts-vocabulary.md.
//
// - Words, meanings, US spellings, IPA, audio and examples come from the D1 snapshot
//   scripts/fixtures/ielts-d1.json (refresh with `npm run ielts:export`).
// - Modules, topics, sub-groups and word order come from the arrangement
//   file src/data/ielts/topics.json, which holds word ids only.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { parseSenses } from './lib/ielts-vocabulary-source.mjs'
import {
  IELTS_MARKDOWN_PATH,
  IELTS_TOPICS_PATH,
  readIeltsTopics,
  renderIeltsMarkdown,
} from './lib/ielts-topics.mjs'

const SNAPSHOT_PATH = 'scripts/fixtures/ielts-d1.json'
const OUTPUT_DIR = 'src/data/ielts/generated'
const CHECK_ONLY = process.argv.includes('--check')
// Keep in sync with IELTS_AUDIO_BASE_URL in src/data/ielts/index.ts.
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

const examplesByWord = new Map()

for (const row of snapshot.examples) {
  // The target must be locatable: the page highlights it and fill-in blanks it.
  const pattern = new RegExp(`(?<![\\w-])${row.target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`, 'g')
  const matches = [...row.en.matchAll(pattern)]

  if (matches.length !== 1) {
    throw new Error(`Example ${row.id}: target "${row.target}" found ${matches.length} times`)
  }

  if (!wordsById.has(row.wordId)) {
    throw new Error(`Example ${row.id}: unknown word "${row.wordId}"`)
  }

  if (!examplesByWord.has(row.wordId)) {
    examplesByWord.set(row.wordId, [])
  }

  examplesByWord
    .get(row.wordId)
    .push({ en: row.en, zh: row.zh, start: matches[0].index, length: row.target.length })
}

function toEntry(sourceEntry, topicId) {
  const word = wordsById.get(sourceEntry.id)

  if (!word) {
    throw new Error(`"${sourceEntry.id}" is in ${IELTS_TOPICS_PATH} but not in D1`)
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

const modules = readIeltsTopics()
const files = new Map()
const catalog = {
  source: IELTS_TOPICS_PATH,
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

  // Example sentences are split by topic and only loaded on the entry page.
  for (const topic of module.topics) {
    files.set(
      `examples/${topic.id}.json`,
      Object.fromEntries(topic.entries.map((entry) => [entry.id, examplesByWord.get(entry.id) ?? []])),
    )
  }
}

const unplaced = snapshot.words.filter((word) => !placed.has(word.id))

if (unplaced.length > 0) {
  throw new Error(
    `D1 words without a topic in ${IELTS_TOPICS_PATH}: ${unplaced.map((word) => word.id).join(', ')}`,
  )
}

files.set('catalog.json', catalog)

const markdown = renderIeltsMarkdown(modules, wordsById)

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
  }).map(([name]) => name)

  if (!existsSync(IELTS_MARKDOWN_PATH) || readFileSync(IELTS_MARKDOWN_PATH, 'utf8') !== markdown) {
    stale.push(IELTS_MARKDOWN_PATH)
  }

  if (stale.length > 0) {
    console.error(`Stale IELTS data: ${stale.join(', ')}. Run npm run ielts:build.`)
    process.exit(1)
  }

  console.log('IELTS data is up to date.')
} else {
  rmSync(OUTPUT_DIR, { recursive: true, force: true })
  mkdirSync(`${OUTPUT_DIR}/examples`, { recursive: true })

  for (const [name, data] of files) {
    writeFileSync(`${OUTPUT_DIR}/${name}`, `${JSON.stringify(data)}\n`)
  }

  writeFileSync(IELTS_MARKDOWN_PATH, markdown)

  for (const module of catalog.modules) {
    console.log(`${module.name}: ${module.topics.length} topics, ${module.entryCount} entries`)
  }

  console.log(
    `Total ${catalog.entryCount} entries, ${snapshot.examples.length} examples; without phonetic ${missingPhonetic}, without audio ${missingAudio}.`,
  )
}
