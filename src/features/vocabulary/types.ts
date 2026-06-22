import type {
  CoreVocabularyEntry,
  VocabularyExample,
  VocabularyPronunciation,
} from '../../data/vocabulary'

export interface VocabularyApiItem {
  id: string
  word: string
  meaning: string
  meaningZh: string
  definitionEn: string
  priority: number
  frequencyRank: number | null
  phoneticUs: string
  phoneticUk: string
  example?: string
  examples?: VocabularyExample[]
  pronunciations?: VocabularyPronunciation[]
}

export interface VocabularyApiResponse {
  items: VocabularyApiItem[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
  filters?: {
    band: string
    query: string
    maxRank?: number
  }
}

export interface VocabularyDetailCore extends VocabularyApiItem {
  normalizedWord: string
}

export interface VocabularyDetailResponse {
  core: VocabularyDetailCore
  pronunciations: VocabularyPronunciation[]
  examples: VocabularyExample[]
  prevId?: string | null
  nextId?: string | null
  position?: number | null
  total?: number | null
}

export interface VocabularyDetail {
  core: CoreVocabularyEntry & {
    normalizedWord: string
    meaningZh: string
    definitionEn: string
  }
  pronunciations: VocabularyPronunciation[]
  examples: VocabularyExample[]
  prevId: string | null
  nextId: string | null
  position: number | null
  total: number | null
}

