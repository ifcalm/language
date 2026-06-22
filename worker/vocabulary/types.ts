export interface VocabRow {
  id: string
  word: string
  normalized_word: string
  meaning_zh: string
  definition_en: string
  frequency_rank: number | null
  phonetic_us: string
  phonetic_uk: string
  created_at: string
  updated_at: string
}

export interface VocabPronunciationRow {
  id: string
  vocabulary_id: string
  word: string
  phonetic: string
  audio_url: string
  created_at: string
  updated_at: string
}

export interface VocabExampleRow {
  id: string
  vocabulary_id: string
  word: string
  sentence_en: string
  sentence_zh: string
  created_at: string
  updated_at: string
}

export interface AdminVocabularySavePayload {
  editor?: string
  core?: Partial<{
    meaningZh: string
    definitionEn: string
    phoneticUs: string
    phoneticUk: string
  }>
  pronunciations?: Array<
    Partial<{
      id: string
      phonetic: string
      audioUrl: string
    }>
  >
  examples?: Array<
    Partial<{
      id: string
      sentenceEn: string
      sentenceZh: string
    }>
  >
}
