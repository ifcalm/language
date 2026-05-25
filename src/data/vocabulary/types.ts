import type { Skill } from '../resources'

export type VocabularyFrequencyBand =
  | 'top-100'
  | 'top-500'
  | 'top-1000'
  | 'top-3000'

export interface VocabularyPronunciation {
  id: string
  phonetic: string
  audioUrl: string
}

export interface VocabularyExample {
  id: string
  sentenceEn: string
  sentenceZh: string
}

export interface CoreVocabularyEntry {
  id: string
  word: string
  meaning: string
  priority: number
  frequencyRank?: number
  phoneticUs: string
  phoneticUk: string
  example?: string
  examples?: VocabularyExample[]
  pronunciations?: VocabularyPronunciation[]
  skills: Array<Extract<Skill, 'listening' | 'speaking' | 'reading' | 'writing'>>
}
