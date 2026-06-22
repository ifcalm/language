import type {
  VocabExampleRow,
  VocabPronunciationRow,
  VocabRow,
} from './types'

export const mapPronunciationRow = (row: VocabPronunciationRow) => ({
  id: row.id,
  phonetic: row.phonetic,
  audioUrl: row.audio_url,
})

export const mapExampleRow = (row: VocabExampleRow) => ({
  id: row.id,
  sentenceEn: row.sentence_en,
  sentenceZh: row.sentence_zh,
})

export const mapVocabRow = (row: VocabRow) => ({
  id: row.id,
  word: row.word,
  normalizedWord: row.normalized_word,
  meaning: row.meaning_zh || row.definition_en,
  meaningZh: row.meaning_zh,
  definitionEn: row.definition_en,
  frequencyRank: row.frequency_rank,
  priority: row.frequency_rank ?? 0,
  phoneticUs: row.phonetic_us,
  phoneticUk: row.phonetic_uk,
})
