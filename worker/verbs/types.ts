export interface VerbRow {
  id: string
  verb: string
  normalized_verb: string
  meaning_zh: string
  is_phrase: number
  created_at: string
  updated_at: string
}

export interface VerbListRow extends VerbRow {
  path_count: number
  core_sentence_en: string | null
  core_sentence_zh: string | null
}

export interface VerbPathRow {
  id: string
  verb_id: string
  verb: string
  title: string
  meaning_zh: string
  core_sentence_en: string
  core_sentence_zh: string
  full_sentence_en: string
  full_sentence_zh: string
  scene: string
  growth_json: string
  created_at: string
  updated_at: string
}
