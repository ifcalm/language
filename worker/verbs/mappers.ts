import type { VerbListRow, VerbPathRow, VerbRow } from './types'

export const mapVerbRow = (row: VerbRow) => ({
  id: row.id,
  verb: row.verb,
  normalizedVerb: row.normalized_verb,
  meaningZh: row.meaning_zh,
  isPhrase: row.is_phrase === 1,
})

export const mapVerbListRow = (row: VerbListRow) => ({
  ...mapVerbRow(row),
  pathCount: row.path_count,
  coreSentenceEn: row.core_sentence_en ?? '',
  coreSentenceZh: row.core_sentence_zh ?? '',
})

export const mapVerbPathRow = (row: VerbPathRow) => {
  let growth: unknown

  try {
    growth = JSON.parse(row.growth_json)
  } catch {
    growth = null
  }

  return {
    id: row.id,
    verbId: row.verb_id,
    verb: row.verb,
    title: row.title,
    meaningZh: row.meaning_zh,
    coreSentenceEn: row.core_sentence_en,
    coreSentenceZh: row.core_sentence_zh,
    fullSentenceEn: row.full_sentence_en,
    fullSentenceZh: row.full_sentence_zh,
    scene: row.scene,
    growth,
  }
}
