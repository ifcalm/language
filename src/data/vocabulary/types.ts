import type { Skill } from '../resources'

export type VocabularyLevel = 'A1' | 'A2' | 'B1' | 'B2'

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'

export type VocabularyScenario =
  | 'daily'
  | 'study'
  | 'work'
  | 'communication'
  | 'thinking'
  | 'emotion'
  | 'time'
  | 'problem-solving'

export interface CoreVocabularyEntry {
  id: string
  word: string
  meaning: string
  partOfSpeech: PartOfSpeech
  level: VocabularyLevel
  priority: number
  example: string
  collocations: string[]
  scenarios: VocabularyScenario[]
  skills: Array<Extract<Skill, 'listening' | 'speaking' | 'reading' | 'writing'>>
  note: string
}
