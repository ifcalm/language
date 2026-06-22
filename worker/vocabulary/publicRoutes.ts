import {
  clampNumber,
  makeErrorResponse,
  makeJsonResponse,
} from '../shared/http'
import { mapPronunciationRow, mapVocabRow } from './mappers'
import {
  getExamplesByVocabularyIds,
  getPronunciationsByVocabularyIds,
  getVocabByLookup,
  getVocabularyBundle,
} from './repository'
import type { VocabPronunciationRow, VocabRow } from './types'

export async function handleVocabularyList(request: Request, env: Env) {
  const url = new URL(request.url)
  const limit = clampNumber(url.searchParams.get('limit'), 240, 1, 500)
  const offset = clampNumber(url.searchParams.get('offset'), 0, 0, 10_000)
  const query = url.searchParams.get('q')?.trim().toLowerCase() ?? ''

  const where: string[] = []
  const params: Array<string | number> = []

  if (query) {
    where.push(
      '(normalized_word LIKE ? OR word LIKE ? OR meaning_zh LIKE ? OR definition_en LIKE ?)',
    )
    const likeQuery = `%${query}%`
    params.push(likeQuery, likeQuery, likeQuery, likeQuery)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM vocab ${whereSql}`,
  )
    .bind(...params)
    .first<{ total: number }>()

  const { results } = await env.DB.prepare(
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
    ${whereSql}
    ORDER BY COALESCE(frequency_rank, 999999) ASC, word ASC
    LIMIT ?
    OFFSET ?`,
  )
    .bind(...params, limit, offset)
    .all<VocabRow>()

  const vocabularyIds = results.map((item) => item.id)
  const [pronunciationsById, examplesById] = await Promise.all([
    getPronunciationsByVocabularyIds(env, vocabularyIds),
    getExamplesByVocabularyIds(env, vocabularyIds),
  ])

  return makeJsonResponse({
    items: results.map((item) => {
      const examples = examplesById.get(item.id) ?? []

      return {
        ...mapVocabRow(item),
        pronunciations: pronunciationsById.get(item.id) ?? [],
        examples,
        example: examples[0]?.sentenceEn ?? '',
      }
    }),
    pagination: {
      total: totalRow?.total ?? 0,
      limit,
      offset,
    },
    filters: {
      query,
    },
  })
}

export async function handleVocabularyPronunciations(
  request: Request,
  env: Env,
) {
  const url = new URL(request.url)
  const vocabularyId = url.searchParams.get('vocabularyId')?.trim() ?? ''
  const word = url.searchParams.get('word')?.trim().toLowerCase() ?? ''

  if (!vocabularyId && !word) {
    return makeErrorResponse('Missing vocabularyId or word query parameter')
  }

  const where = vocabularyId ? 'vocabulary_id = ?' : 'lower(word) = ?'
  const value = vocabularyId || word
  const { results } = await env.DB.prepare(
    `SELECT id, vocabulary_id, word, phonetic, audio_url, created_at, updated_at
    FROM vocab_pronunciations
    WHERE ${where}
    ORDER BY id ASC`,
  )
    .bind(value)
    .all<VocabPronunciationRow>()

  return makeJsonResponse({
    items: results.map(mapPronunciationRow),
    filters: {
      vocabularyId: vocabularyId || null,
      word: word || null,
    },
  })
}

export async function handleVocabularyDetail(request: Request, env: Env) {
  const lookup = decodeURIComponent(
    new URL(request.url).pathname.replace('/api/vocabulary/', ''),
  )
  const core = await getVocabByLookup(env, lookup)

  if (!core) {
    return makeErrorResponse('Vocabulary item not found', 404)
  }

  const detail = await getVocabularyBundle(env, core.id)

  if (!detail) {
    return makeErrorResponse('Vocabulary item not found', 404)
  }

  // Neighbours in the same order the list uses, so prev/next on the detail
  // page walks the corpus exactly like scrolling the list would.
  const neighbour = await env.DB.prepare(
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
  )
    .bind(core.id)
    .first<{ prev_id: string | null; next_id: string | null; rn: number }>()

  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM vocab`,
  ).first<{ total: number }>()

  return makeJsonResponse({
    ...detail,
    prevId: neighbour?.prev_id ?? null,
    nextId: neighbour?.next_id ?? null,
    position: neighbour?.rn ?? null,
    total: totalRow?.total ?? null,
  })
}
