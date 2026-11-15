import catalogData from './generated/catalog.json'
import type {
  IeltsCatalog,
  IeltsEntry,
  IeltsModuleData,
  IeltsModuleId,
  IeltsTopicExamples,
} from './types'

export type {
  IeltsCatalog,
  IeltsEntry,
  IeltsExample,
  IeltsModuleData,
  IeltsModuleId,
  IeltsModuleSummary,
  IeltsPosPhonetic,
  IeltsSense,
  IeltsTopicExamples,
  IeltsTopicGroup,
  IeltsTopicSummary,
} from './types'

// Keep in sync with AUDIO_BASE_URL in scripts/build-ielts-data.mjs.
export const IELTS_AUDIO_BASE_URL = 'https://assets.english.ifcalm.org/ielts/pronunciations/v1'

// The catalog is a few KB and ships with the page; module entries are split into
// separate hashed chunks and only downloaded when a module is opened.
export const ieltsCatalog = catalogData as IeltsCatalog

const moduleLoaders: Record<IeltsModuleId, () => Promise<{ default: unknown }>> = {
  listening: () => import('./generated/listening.json'),
  reading: () => import('./generated/reading.json'),
  writing: () => import('./generated/writing.json'),
  speaking: () => import('./generated/speaking.json'),
}

const moduleCache = new Map<IeltsModuleId, Promise<IeltsModuleData>>()

export function loadIeltsModule(moduleId: IeltsModuleId): Promise<IeltsModuleData> {
  let pending = moduleCache.get(moduleId)

  if (!pending) {
    pending = moduleLoaders[moduleId]().then((module) => module.default as IeltsModuleData)
    pending.catch(() => moduleCache.delete(moduleId))
    moduleCache.set(moduleId, pending)
  }

  return pending
}

const exampleLoaders = import.meta.glob<{ default: IeltsTopicExamples }>('./generated/examples/*.json')
const exampleCache = new Map<string, Promise<IeltsTopicExamples>>()

export function loadIeltsExamples(topicId: string): Promise<IeltsTopicExamples> {
  let pending = exampleCache.get(topicId)

  if (!pending) {
    const loader = exampleLoaders[`./generated/examples/${topicId}.json`]
    pending = loader
      ? loader().then((module) => module.default)
      : Promise.reject(new Error(`Unknown IELTS topic "${topicId}"`))
    pending.catch(() => exampleCache.delete(topicId))
    exampleCache.set(topicId, pending)
  }

  return pending
}

export function getIeltsAudioUrl(
  entry: IeltsEntry,
  accent: 'uk' | 'us',
  pos?: string,
): string | null {
  if (pos) {
    const row = entry.posPhonetics?.find((item) => item.pos === pos)
    return row?.audio
      ? `${IELTS_AUDIO_BASE_URL}/${accent}/${entry.id}-${pos.replace(/\./g, '')}.m4a`
      : null
  }

  return entry.audio ? `${IELTS_AUDIO_BASE_URL}/${accent}/${entry.id}.m4a` : null
}

// What a list row or a practice card shows and plays: the British reading.
// Words whose reading depends on part of speech have no entry-level audio, so
// the first part of speech stands in.
export function getIeltsPrimaryReading(entry: IeltsEntry) {
  const posRow = entry.posPhonetics?.find((row) => row.audio)

  return {
    phonetic: entry.phoneticUk ?? entry.posPhonetics?.[0]?.uk,
    url: getIeltsAudioUrl(entry, 'uk') ?? (posRow ? getIeltsAudioUrl(entry, 'uk', posRow.pos) : null),
  }
}
