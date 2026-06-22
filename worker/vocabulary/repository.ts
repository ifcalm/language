import {
  mapExampleRow,
  mapPronunciationRow,
  mapVocabRow,
} from './mappers'
import type {
  VocabExampleRow,
  VocabPronunciationRow,
  VocabRow,
} from './types'

const lookupBatchSize = 90

export async function getPronunciationsByVocabularyIds(
  env: Env,
  vocabularyIds: string[],
) {
  if (vocabularyIds.length === 0) {
    return new Map<string, ReturnType<typeof mapPronunciationRow>[]>()
  }

  const pronunciationsById = new Map<
    string,
    ReturnType<typeof mapPronunciationRow>[]
  >()

  for (let index = 0; index < vocabularyIds.length; index += lookupBatchSize) {
    const batchIds = vocabularyIds.slice(index, index + lookupBatchSize)
    const placeholders = batchIds.map(() => '?').join(', ')
    const { results } = await env.DB.prepare(
      `SELECT id, vocabulary_id, word, phonetic, audio_url, created_at, updated_at
      FROM vocab_pronunciations
      WHERE vocabulary_id IN (${placeholders})
      ORDER BY vocabulary_id ASC, id ASC`,
    )
      .bind(...batchIds)
      .all<VocabPronunciationRow>()

    for (const row of results) {
      const current = pronunciationsById.get(row.vocabulary_id) ?? []
      current.push(mapPronunciationRow(row))
      pronunciationsById.set(row.vocabulary_id, current)
    }
  }

  return pronunciationsById
}

export async function getExamplesByVocabularyIds(
  env: Env,
  vocabularyIds: string[],
) {
  if (vocabularyIds.length === 0) {
    return new Map<string, ReturnType<typeof mapExampleRow>[]>()
  }

  const examplesById = new Map<string, ReturnType<typeof mapExampleRow>[]>()

  for (let index = 0; index < vocabularyIds.length; index += lookupBatchSize) {
    const batchIds = vocabularyIds.slice(index, index + lookupBatchSize)
    const placeholders = batchIds.map(() => '?').join(', ')
    const { results } = await env.DB.prepare(
      `SELECT id, vocabulary_id, word, sentence_en, sentence_zh, created_at, updated_at
      FROM vocab_examples
      WHERE vocabulary_id IN (${placeholders})
      ORDER BY vocabulary_id ASC, id ASC`,
    )
      .bind(...batchIds)
      .all<VocabExampleRow>()

    for (const row of results) {
      const current = examplesById.get(row.vocabulary_id) ?? []
      current.push(mapExampleRow(row))
      examplesById.set(row.vocabulary_id, current)
    }
  }

  return examplesById
}

export async function getVocab(env: Env, vocabularyId: string) {
  return env.DB.prepare(
    `SELECT
      id,
      word,
      normalized_word,
      meaning_zh,
      definition_en,
      frequency_rank,
      phonetic_us,
      phonetic_uk,
      created_at,
      updated_at
    FROM vocab
    WHERE id = ?`,
  )
    .bind(vocabularyId)
    .first<VocabRow>()
}

export async function getVocabularyBundle(env: Env, vocabularyId: string) {
  const core = await getVocab(env, vocabularyId)

  if (!core) {
    return null
  }

  const [pronunciations, examples] = await Promise.all([
    env.DB.prepare(
      `SELECT id, vocabulary_id, word, phonetic, audio_url, created_at, updated_at
      FROM vocab_pronunciations
      WHERE vocabulary_id = ?
      ORDER BY id ASC`,
    )
      .bind(vocabularyId)
      .all<VocabPronunciationRow>(),
    env.DB.prepare(
      `SELECT id, vocabulary_id, word, sentence_en, sentence_zh, created_at, updated_at
      FROM vocab_examples
      WHERE vocabulary_id = ?
      ORDER BY id ASC`,
    )
      .bind(vocabularyId)
      .all<VocabExampleRow>(),
  ])

  return {
    core: mapVocabRow(core),
    pronunciations: pronunciations.results.map(mapPronunciationRow),
    examples: examples.results.map(mapExampleRow),
  }
}

export async function getVocabByLookup(env: Env, lookup: string) {
  const normalizedLookup = lookup.trim().toLowerCase()

  if (!normalizedLookup) {
    return null
  }

  return env.DB.prepare(
    `SELECT
      id,
      word,
      normalized_word,
      meaning_zh,
      definition_en,
      frequency_rank,
      phonetic_us,
      phonetic_uk,
      created_at,
      updated_at
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
