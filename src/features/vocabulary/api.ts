import type { CoreVocabularyEntry } from '../../data/vocabulary'
import type {
  VocabularyApiItem,
  VocabularyApiResponse,
  VocabularyDetail,
  VocabularyDetailResponse,
} from './types'

export const mapApiVocabularyItem = (
  item: VocabularyApiItem,
): CoreVocabularyEntry => ({
  id: item.id,
  word: item.word,
  meaning: item.meaning,
  priority: item.priority,
  frequencyRank: item.frequencyRank ?? undefined,
  phoneticUs: item.phoneticUs,
  phoneticUk: item.phoneticUk,
  example: item.example,
  examples: item.examples ?? [],
  skills: ['listening', 'speaking', 'reading', 'writing'],
  pronunciations: item.pronunciations ?? [],
})

const mapVocabularyDetail = (
  payload: VocabularyDetailResponse,
): VocabularyDetail => {
  const examples = payload.examples ?? []
  const pronunciations = payload.pronunciations ?? []

  return {
    core: {
      id: payload.core.id,
      word: payload.core.word,
      normalizedWord: payload.core.normalizedWord,
      meaning: payload.core.meaning,
      meaningZh: payload.core.meaningZh,
      definitionEn: payload.core.definitionEn,
      priority: payload.core.priority,
      frequencyRank: payload.core.frequencyRank ?? undefined,
      phoneticUs: payload.core.phoneticUs,
      phoneticUk: payload.core.phoneticUk,
      example: examples[0]?.sentenceEn,
      examples,
      pronunciations,
      skills: ['listening', 'speaking', 'reading', 'writing'],
    },
    pronunciations,
    examples,
    prevId: payload.prevId ?? null,
    nextId: payload.nextId ?? null,
    position: payload.position ?? null,
    total: payload.total ?? null,
  }
}

export async function requestVocabularyList(
  params: {
    query: string
    offset: number
    limit: number
  },
  signal: AbortSignal,
): Promise<VocabularyApiResponse> {
  const searchParams = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
  })

  const normalizedQuery = params.query.trim()

  if (normalizedQuery) {
    searchParams.set('q', normalizedQuery)
  }

  const response = await fetch(`/api/vocabulary?${searchParams.toString()}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Vocabulary API responded with ${response.status}`)
  }

  return (await response.json()) as VocabularyApiResponse
}

export async function requestVocabularyDetail(
  lookup: string,
  signal: AbortSignal,
): Promise<VocabularyDetail> {
  const response = await fetch(`/api/vocabulary/${encodeURIComponent(lookup)}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Vocabulary detail API responded with ${response.status}`)
  }

  return mapVocabularyDetail((await response.json()) as VocabularyDetailResponse)
}
