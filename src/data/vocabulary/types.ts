import type { Skill } from '../resources'

export type VocabularyLevel = 'A1' | 'A2' | 'B1' | 'B2'

export type VocabularyFrequencyBand =
  | 'top-100'
  | 'top-500'
  | 'top-1000'
  | 'top-3000'

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'determiner'
  | 'modal'
  | 'interjection'
  | 'number'

export type VocabularyScenario =
  | 'daily'
  | 'study'
  | 'work'
  | 'communication'
  | 'thinking'
  | 'emotion'
  | 'time'
  | 'problem-solving'

export type VocabularySourceId =
  | 'manual-curation'
  | 'oxford-3000'
  | 'english-vocabulary-profile'
  | 'ngsl'
  | 'nawl'

export type CefrStatus = 'estimated' | 'reference-checked'
export type ExampleStatus = 'original' | 'source-derived'
export type GrammarStatus = 'self-reviewed' | 'needs-review'
export type ReviewStatus = 'draft' | 'sample-reviewed' | 'reviewed'

export interface VocabularySense {
  meaning: string
  partOfSpeech: PartOfSpeech
  example: string
  usageNote?: string
}

export interface VocabularyQuality {
  sources: VocabularySourceId[]
  cefrStatus: CefrStatus
  exampleStatus: ExampleStatus
  grammarStatus: GrammarStatus
  reviewStatus: ReviewStatus
  lastReviewed?: string
  note: string
}

export interface VocabularyPronunciation {
  accent: string
  locale: string
  phonetic: string
  audioUrl: string
  audioProvider: string
  audioObjectKey: string
  voiceId: string
  qualityStatus: string
}

export interface CoreVocabularyEntry {
  id: string
  word: string
  meaning: string
  partOfSpeech: PartOfSpeech
  level: VocabularyLevel
  priority: number
  frequencyRank?: number
  frequencyBand?: VocabularyFrequencyBand
  learningPriority?: number
  pronunciation?: string
  source?: VocabularySourceId
  sourceRank?: number
  example?: string
  pronunciations?: VocabularyPronunciation[]
  collocations?: string[]
  scenarios: VocabularyScenario[]
  skills: Array<Extract<Skill, 'listening' | 'speaking' | 'reading' | 'writing'>>
  note: string
  senses?: VocabularySense[]
  quality?: VocabularyQuality
}
