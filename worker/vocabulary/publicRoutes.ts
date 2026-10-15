import {
  clampNumber,
  makeErrorResponse,
  makeJsonResponse,
} from '../shared/http'
import { mapExampleRow, mapPronunciationRow, mapVocabRow } from './mappers'
import {
  getVocabByLookup,
  getVocabularyDetail,
  groupByVocabularyId,
  VOCAB_COLUMNS,
  VOCAB_ORDER,
} from './repository'
import type {
  VocabExampleRow,
  VocabPronunciationRow,
  VocabRow,
} from './types'

// The list endpoint asks D1 for the count, the page, its pronunciations and
// (optionally) its examples in one batch, so a request costs one round trip
// instead of one per 90 ids.
export async function handleVocabularyList(request: Request, env: Env) {
  const url = new URL(request.url)
  const limit = clampNumber(url.searchParams.get('limit'), 240, 1, 500)
  const offset = clampNumber(url.searchParams.get('offset'), 0, 0, 10_000)
  const query = url.searchParams.get('q')?.trim().toLowerCase() ?? ''
  const includeExamples = url.searchParams.get('include') === 'examples'

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
  const pageParams = [...params, limit, offset]
  const pageIdsSql = `SELECT id FROM vocab ${whereSql} ${VOCAB_ORDER} LIMIT ? OFFSET ?`

  const statements = [
    env.DB.prepare(`SELECT COUNT(*) AS total FROM vocab ${whereSql}`).bind(
      ...params,
    ),
    env.DB.prepare(
      `SELECT ${VOCAB_COLUMNS} FROM vocab ${whereSql} ${VOCAB_ORDER} LIMIT ? OFFSET ?`,
    ).bind(...pageParams),
    env.DB.prepare(
      `SELECT id, vocabulary_id, word, phonetic, audio_url, created_at, updated_at
      FROM vocab_pronunciations
      WHERE vocabulary_id IN (${pageIdsSql})
      ORDER BY vocabulary_id ASC, id ASC`,
    ).bind(...pageParams),
  ]

  if (includeExamples) {
    statements.push(
      env.DB.prepare(
        `SELECT id, vocabulary_id, word, sentence_en, sentence_zh, created_at, updated_at
        FROM vocab_examples
        WHERE vocabulary_id IN (${pageIdsSql})
        ORDER BY vocabulary_id ASC, id ASC`,
      ).bind(...pageParams),
    )
  }

  const [totalResult, pageResult, pronunciationResult, exampleResult] =
    await env.DB.batch(statements)

  const totalRow = (totalResult.results[0] ?? null) as { total: number } | null
  const pronunciationsById = groupByVocabularyId(
    pronunciationResult.results as VocabPronunciationRow[],
    mapPronunciationRow,
  )
  const examplesById = exampleResult
    ? groupByVocabularyId(
        exampleResult.results as VocabExampleRow[],
        mapExampleRow,
      )
    : null

  return makeJsonResponse({
    items: (pageResult.results as VocabRow[]).map((item) => {
      const examples = examplesById?.get(item.id)

      return {
        ...mapVocabRow(item),
        pronunciations: pronunciationsById.get(item.id) ?? [],
        ...(examplesById
          ? { examples: examples ?? [], example: examples?.[0]?.sentenceEn ?? '' }
          : {}),
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

// Compact payload for the fill-in practice page: it needs every word with all
// of its example sentences, and nothing else. Items are tuples
// [id, word, frequencyRank, [[exampleId, sentenceEn, sentenceZh], ...]] and an
// example id that starts with "<vocabularyId>-" is sent as just its suffix.
export async function handlePracticeSentences(request: Request, env: Env) {
  const url = new URL(request.url)
  const limit = clampNumber(url.searchParams.get('limit'), 500, 1, 6_000)
  const offset = clampNumber(url.searchParams.get('offset'), 0, 0, 10_000)
  const pageParams = [limit, offset]
  const pageIdsSql = `SELECT id FROM vocab ${VOCAB_ORDER} LIMIT ? OFFSET ?`

  const [totalResult, pageResult, exampleResult] = await env.DB.batch([
    env.DB.prepare(`SELECT COUNT(*) AS total FROM vocab`),
    env.DB.prepare(
      `SELECT id, word, frequency_rank FROM vocab ${VOCAB_ORDER} LIMIT ? OFFSET ?`,
    ).bind(...pageParams),
    env.DB.prepare(
      `SELECT id, vocabulary_id, sentence_en, sentence_zh
      FROM vocab_examples
      WHERE vocabulary_id IN (${pageIdsSql})
      ORDER BY vocabulary_id ASC, id ASC`,
    ).bind(...pageParams),
  ])

  const totalRow = (totalResult.results[0] ?? null) as { total: number } | null
  const examplesById = groupByVocabularyId(
    exampleResult.results as Array<
      Pick<VocabExampleRow, 'id' | 'vocabulary_id' | 'sentence_en' | 'sentence_zh'>
    >,
    (row) => [
      row.id.startsWith(`${row.vocabulary_id}-`)
        ? row.id.slice(row.vocabulary_id.length)
        : row.id,
      row.sentence_en,
      row.sentence_zh,
    ],
  )

  return makeJsonResponse({
    total: totalRow?.total ?? 0,
    items: (
      pageResult.results as Array<{
        id: string
        word: string
        frequency_rank: number | null
      }>
    ).map((row) => [
      row.id,
      row.word,
      row.frequency_rank,
      examplesById.get(row.id) ?? [],
    ]),
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

  return makeJsonResponse(await getVocabularyDetail(env, core))
}
