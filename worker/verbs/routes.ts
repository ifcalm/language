import {
  clampNumber,
  makeErrorResponse,
  makeJsonResponse,
} from '../shared/http'
import { mapVerbListRow, mapVerbPathRow, mapVerbRow } from './mappers'
import type { VerbListRow, VerbPathRow, VerbRow } from './types'

export async function handleVerbList(request: Request, env: Env) {
  const url = new URL(request.url)
  const limit = clampNumber(url.searchParams.get('limit'), 80, 1, 200)
  const offset = clampNumber(url.searchParams.get('offset'), 0, 0, 10_000)
  const query = url.searchParams.get('q')?.trim().toLowerCase() ?? ''
  const hasPaths = url.searchParams.get('hasPaths') === '1'

  const where: string[] = []
  const params: Array<string | number> = []

  if (query) {
    where.push('(v.normalized_verb LIKE ? OR v.verb LIKE ? OR v.meaning_zh LIKE ?)')
    const likeQuery = `%${query}%`
    params.push(likeQuery, likeQuery, likeQuery)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
  const havingSql = hasPaths ? 'HAVING COUNT(vp.id) > 0' : ''
  const totalRow = await env.DB.prepare(
    hasPaths
      ? `SELECT COUNT(*) AS total FROM (
          SELECT v.id
          FROM verbs v
          LEFT JOIN verb_paths vp ON vp.verb_id = v.id
          ${whereSql}
          GROUP BY v.id
          HAVING COUNT(vp.id) > 0
        )`
      : `SELECT COUNT(*) AS total FROM verbs v ${whereSql}`,
  )
    .bind(...params)
    .first<{ total: number }>()

  const { results } = await env.DB.prepare(
    `SELECT
      v.id,
      v.verb,
      v.normalized_verb,
      v.meaning_zh,
      v.is_phrase,
      v.created_at,
      v.updated_at,
      COUNT(vp.id) AS path_count,
      (
        SELECT vp2.core_sentence_en
        FROM verb_paths vp2
        WHERE vp2.verb_id = v.id
        ORDER BY vp2.created_at ASC, vp2.id ASC
        LIMIT 1
      ) AS core_sentence_en,
      (
        SELECT vp2.core_sentence_zh
        FROM verb_paths vp2
        WHERE vp2.verb_id = v.id
        ORDER BY vp2.created_at ASC, vp2.id ASC
        LIMIT 1
      ) AS core_sentence_zh
    FROM verbs v
    LEFT JOIN verb_paths vp ON vp.verb_id = v.id
    ${whereSql}
    GROUP BY v.id
    ${havingSql}
    ORDER BY
      CASE WHEN COUNT(vp.id) > 0 THEN 0 ELSE 1 END,
      CASE WHEN v.frequency_rank IS NULL THEN 1 ELSE 0 END,
      v.frequency_rank ASC,
      v.is_phrase ASC,
      v.normalized_verb ASC
    LIMIT ?
    OFFSET ?`,
  )
    .bind(...params, limit, offset)
    .all<VerbListRow>()

  return makeJsonResponse({
    items: results.map(mapVerbListRow),
    pagination: {
      total: totalRow?.total ?? 0,
      limit,
      offset,
    },
    filters: {
      query,
      hasPaths,
    },
  })
}

async function getVerbByLookup(env: Env, lookup: string) {
  const normalizedLookup = lookup.trim().toLowerCase()

  if (!normalizedLookup) {
    return null
  }

  return env.DB.prepare(
    `SELECT
      id,
      verb,
      normalized_verb,
      meaning_zh,
      is_phrase,
      created_at,
      updated_at
    FROM verbs
    WHERE id = ? OR normalized_verb = ? OR lower(verb) = ?
    ORDER BY
      CASE
        WHEN id = ? THEN 0
        WHEN normalized_verb = ? THEN 1
        ELSE 2
      END
    LIMIT 1`,
  )
    .bind(lookup, normalizedLookup, normalizedLookup, lookup, normalizedLookup)
    .first<VerbRow>()
}

export async function handleVerbDetail(request: Request, env: Env) {
  const lookup = decodeURIComponent(
    new URL(request.url).pathname.replace('/api/verbs/', ''),
  )
  const verb = await getVerbByLookup(env, lookup)

  if (!verb) {
    return makeErrorResponse('Verb not found', 404)
  }

  const { results } = await env.DB.prepare(
    `SELECT
      id,
      verb_id,
      verb,
      title,
      meaning_zh,
      core_sentence_en,
      core_sentence_zh,
      full_sentence_en,
      full_sentence_zh,
      scene,
      growth_json,
      created_at,
      updated_at
    FROM verb_paths
    WHERE verb_id = ?
    ORDER BY created_at ASC, id ASC`,
  )
    .bind(verb.id)
    .all<VerbPathRow>()

  // Neighbours in the same order the list uses, so prev/next on the detail
  // page walks the corpus exactly like scrolling the list would.
  const neighbour = await env.DB.prepare(
    `WITH counts AS (
      SELECT
        v.id,
        v.is_phrase,
        v.normalized_verb,
        v.frequency_rank AS freq,
        COUNT(vp.id) AS pc
      FROM verbs v
      LEFT JOIN verb_paths vp ON vp.verb_id = v.id
      GROUP BY v.id
    ),
    ordered AS (
      SELECT
        id,
        ROW_NUMBER() OVER w AS rn,
        LAG(id) OVER w AS prev_id,
        LEAD(id) OVER w AS next_id
      FROM counts
      WINDOW w AS (
        ORDER BY
          CASE WHEN pc > 0 THEN 0 ELSE 1 END,
          CASE WHEN freq IS NULL THEN 1 ELSE 0 END,
          freq ASC,
          is_phrase ASC,
          normalized_verb ASC
      )
    )
    SELECT prev_id, next_id, rn FROM ordered WHERE id = ?`,
  )
    .bind(verb.id)
    .first<{ prev_id: string | null; next_id: string | null; rn: number }>()

  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM verbs`,
  ).first<{ total: number }>()

  return makeJsonResponse({
    verb: mapVerbRow(verb),
    paths: results.map(mapVerbPathRow),
    prevId: neighbour?.prev_id ?? null,
    nextId: neighbour?.next_id ?? null,
    position: neighbour?.rn ?? null,
    total: totalRow?.total ?? null,
  })
}
