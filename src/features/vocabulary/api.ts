import type { CoreVocabularyEntry, VocabularyExample } from '../../data/vocabulary'
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
    visual: payload.visual ?? null,
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

// The fill-in practice only needs the word, its rank and its sentences, so it
// has its own compact endpoint instead of paging through the full list.
export type PracticeVocabularyEntry = Pick<
  CoreVocabularyEntry,
  'id' | 'word' | 'frequencyRank' | 'examples'
>

type PracticeSentenceTuple = [
  id: string,
  word: string,
  frequencyRank: number | null,
  examples: Array<[id: string, sentenceEn: string, sentenceZh: string]>,
]

export async function requestPracticeSentences(
  params: { offset: number; limit: number },
  signal: AbortSignal,
): Promise<{ total: number; items: PracticeVocabularyEntry[] }> {
  const searchParams = new URLSearchParams({
    limit: String(params.limit),
    offset: String(params.offset),
  })
  const response = await fetch(`/api/practice/sentences?${searchParams}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Practice API responded with ${response.status}`)
  }

  const payload = (await response.json()) as {
    total: number
    items: PracticeSentenceTuple[]
  }

  return {
    total: payload.total,
    items: payload.items.map(([id, word, frequencyRank, examples]) => ({
      id,
      word,
      frequencyRank: frequencyRank ?? undefined,
      examples: examples.map(
        ([exampleId, sentenceEn, sentenceZh]): VocabularyExample => ({
          // The API sends "-ex1" for "<vocabularyId>-ex1" to keep the payload small.
          id: exampleId.startsWith('-') ? `${id}${exampleId}` : exampleId,
          sentenceEn,
          sentenceZh,
        }),
      ),
    })),
  }
}
