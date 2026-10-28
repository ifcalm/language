import catalogData from './generated/catalog.json'
import type { IeltsCatalog, IeltsEntry, IeltsModuleData, IeltsModuleId } from './types'

export type {
  IeltsCatalog,
  IeltsEntry,
  IeltsModuleData,
  IeltsModuleId,
  IeltsModuleSummary,
  IeltsSense,
  IeltsTopicGroup,
  IeltsTopicSummary,
} from './types'

// Keep in sync with AUDIO_BASE_URL in scripts/build-ielts-data.mjs.
export const IELTS_AUDIO_BASE_URL = 'https://assets.english.ifcalm.org/pronunciations'

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

export function getIeltsAudioUrl(entry: IeltsEntry, accent: 'uk' | 'us'): string | null {
  return entry.audioKey ? `${IELTS_AUDIO_BASE_URL}/${accent}/${entry.audioKey}.m4a` : null
}
