import {
  mapExampleRow,
  mapPronunciationRow,
  mapVocabRow,
  mapVisualRow,
} from './mappers'
import type {
  VocabExampleRow,
  VocabPronunciationRow,
  VocabRow,
  VocabVisualRow,
} from './types'

export const VOCAB_COLUMNS = `id,
      word,
      normalized_word,
      meaning_zh,
      definition_en,
      frequency_rank,
      phonetic_us,
      phonetic_uk,
      created_at,
      updated_at`

export const VOCAB_ORDER = `ORDER BY COALESCE(frequency_rank, 999999) ASC, word ASC`

export function groupByVocabularyId<
  Row extends { vocabulary_id: string },
  Mapped,
>(rows: Row[], map: (row: Row) => Mapped) {
  const grouped = new Map<string, Mapped[]>()

  for (const row of rows) {
    const current = grouped.get(row.vocabulary_id) ?? []
    current.push(map(row))
    grouped.set(row.vocabulary_id, current)
  }

  return grouped
}

export async function getVocabByLookup(env: Env, lookup: string) {
  const normalizedLookup = lookup.trim().toLowerCase()

  if (!normalizedLookup) {
    return null
  }

  return env.DB.prepare(
    `SELECT ${VOCAB_COLUMNS}
    FROM vocab
    WHERE id = ? OR normalized_word = ? OR lower(word) = ?
    ORDER BY
      CASE
        WHEN id = ? THEN 0
        WHEN normalized_word = ? THEN 1
        ELSE 2
      END,
      COALESCE(frequency_rank, 999999) ASC
    LIMIT 1`,
  )
    .bind(
      lookup,
      normalizedLookup,
      normalizedLookup,
      lookup,
      normalizedLookup,
    )
    .first<VocabRow>()
}

// Everything the detail page needs in a single D1 round trip. The neighbour
// query walks the same order the list uses, so prev/next on the detail page
// steps through the corpus exactly like scrolling the list would.
export async function getVocabularyDetail(env: Env, core: VocabRow) {
  const [pronunciations, examples, visual, neighbour, total] =
    await env.DB.batch([
      env.DB.prepare(
        `SELECT id, vocabulary_id, word, phonetic, audio_url, created_at, updated_at
        FROM vocab_pronunciations
        WHERE vocabulary_id = ?
        ORDER BY id ASC`,
      ).bind(core.id),
      env.DB.prepare(
        `SELECT id, vocabulary_id, word, sentence_en, sentence_zh, created_at, updated_at
        FROM vocab_examples
        WHERE vocabulary_id = ?
        ORDER BY id ASC`,
      ).bind(core.id),
      env.DB.prepare(
        `SELECT
          id,
          vocabulary_id,
          word,
          example_id,
          image_url,
          alt_text,
          created_at,
          updated_at
        FROM vocab_visuals
        WHERE vocabulary_id = ?
        LIMIT 1`,
      ).bind(core.id),
      env.DB.prepare(
        `WITH ordered AS (
          SELECT
            id,
            ROW_NUMBER() OVER w AS rn,
            LAG(id) OVER w AS prev_id,
            LEAD(id) OVER w AS next_id
          FROM vocab
          WINDOW w AS (
            ORDER BY COALESCE(frequency_rank, 999999) ASC, word ASC
          )
        )
        SELECT prev_id, next_id, rn FROM ordered WHERE id = ?`,
      ).bind(core.id),
      env.DB.prepare(`SELECT COUNT(*) AS total FROM vocab`),
    ])

  const visualRow = (visual.results[0] ?? null) as VocabVisualRow | null
  const neighbourRow = (neighbour.results[0] ?? null) as {
    prev_id: string | null
    next_id: string | null
    rn: number
  } | null
  const totalRow = (total.results[0] ?? null) as { total: number } | null

  return {
    core: mapVocabRow(core),
    pronunciations: (pronunciations.results as VocabPronunciationRow[]).map(
      mapPronunciationRow,
    ),
    examples: (examples.results as VocabExampleRow[]).map(mapExampleRow),
    visual: visualRow ? mapVisualRow(visualRow) : null,
    prevId: neighbourRow?.prev_id ?? null,
    nextId: neighbourRow?.next_id ?? null,
    position: neighbourRow?.rn ?? null,
    total: totalRow?.total ?? null,
  }
}
