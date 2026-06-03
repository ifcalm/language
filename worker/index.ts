import { handleAuthRequest } from './auth'

type VocabularyBand = 'top-100' | 'top-500' | 'top-1000' | 'top-3000'

interface VocabRow {
  id: string
  word: string
  normalized_word: string
  lemma: string | null
  meaning_zh: string
  definition_en: string
  frequency_rank: number | null
  phonetic_us: string
  phonetic_uk: string
  created_at: string
  updated_at: string
}

interface VocabPronunciationRow {
  id: string
  vocabulary_id: string
  word: string
  phonetic: string
  audio_url: string
  created_at: string
  updated_at: string
}

interface VocabExampleRow {
  id: string
  vocabulary_id: string
  word: string
  sentence_en: string
  sentence_zh: string
  created_at: string
  updated_at: string
}

interface VerbRow {
  id: string
  verb: string
  normalized_verb: string
  meaning_zh: string
  is_phrase: number
  created_at: string
  updated_at: string
}

interface VerbListRow extends VerbRow {
  path_count: number
}

interface VerbPathRow {
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
  steps_json: string
  created_at: string
  updated_at: string
}

interface AdminVocabularySavePayload {
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

const vocabularyBandLimits: Record<VocabularyBand, number> = {
  'top-100': 100,
  'top-500': 500,
  'top-1000': 1000,
  'top-3000': 3000,
}

const lookupBatchSize = 90

const clampNumber = (value: string | null, fallback: number, min: number, max: number) => {
  if (value === null || value.trim() === '') {
    return fallback
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.floor(parsed)))
}

const getVocabularyBand = (value: string | null): VocabularyBand => {
  if (
    value === 'top-100' ||
    value === 'top-500' ||
    value === 'top-1000' ||
    value === 'top-3000'
  ) {
    return value
  }

  return 'top-500'
}

const nowIso = () => new Date().toISOString()

const normalizeText = (value: unknown, fallback = '') => {
  if (typeof value !== 'string') {
    return fallback
  }

  return value.trim()
}

const makeJsonResponse = (payload: unknown, init?: ResponseInit) =>
  Response.json(payload, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init?.headers ?? {}),
    },
  })

const makeErrorResponse = (message: string, status = 400) =>
  makeJsonResponse({ error: message }, { status })

const mapPronunciationRow = (row: VocabPronunciationRow) => ({
  id: row.id,
  phonetic: row.phonetic,
  audioUrl: row.audio_url,
})

const mapExampleRow = (row: VocabExampleRow) => ({
  id: row.id,
  sentenceEn: row.sentence_en,
  sentenceZh: row.sentence_zh,
})

const mapVocabRow = (row: VocabRow) => ({
  id: row.id,
  word: row.word,
  normalizedWord: row.normalized_word,
  lemma: row.lemma,
  meaning: row.meaning_zh || row.definition_en,
  meaningZh: row.meaning_zh,
  definitionEn: row.definition_en,
  frequencyRank: row.frequency_rank,
  priority: row.frequency_rank ?? 0,
  phoneticUs: row.phonetic_us,
  phoneticUk: row.phonetic_uk,
})

const mapVerbRow = (row: VerbRow) => ({
  id: row.id,
  verb: row.verb,
  normalizedVerb: row.normalized_verb,
  meaningZh: row.meaning_zh,
  isPhrase: row.is_phrase === 1,
})

const mapVerbListRow = (row: VerbListRow) => ({
  ...mapVerbRow(row),
  pathCount: row.path_count,
})

const mapVerbPathRow = (row: VerbPathRow) => {
  let steps: unknown

  try {
    steps = JSON.parse(row.steps_json)
  } catch {
    steps = []
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
    steps,
  }
}

async function getPronunciationsByVocabularyIds(
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

async function getExamplesByVocabularyIds(env: Env, vocabularyIds: string[]) {
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


async function handleVerbList(request: Request, env: Env) {
  const url = new URL(request.url)
  const limit = clampNumber(url.searchParams.get('limit'), 80, 1, 200)
  const offset = clampNumber(url.searchParams.get('offset'), 0, 0, 10_000)
  const query = url.searchParams.get('q')?.trim().toLowerCase() ?? ''

  const where: string[] = []
  const params: Array<string | number> = []

  if (query) {
    where.push('(v.normalized_verb LIKE ? OR v.verb LIKE ? OR v.meaning_zh LIKE ?)')
    const likeQuery = `%${query}%`
    params.push(likeQuery, likeQuery, likeQuery)
  }

  const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM verbs v ${whereSql}`,
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
      COUNT(vp.id) AS path_count
    FROM verbs v
    LEFT JOIN verb_paths vp ON vp.verb_id = v.id
    ${whereSql}
    GROUP BY v.id
    ORDER BY
      CASE WHEN COUNT(vp.id) > 0 THEN 0 ELSE 1 END,
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

async function handleVerbDetail(request: Request, env: Env) {
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
      steps_json,
      created_at,
      updated_at
    FROM verb_paths
    WHERE verb_id = ?
    ORDER BY created_at ASC, id ASC`,
  )
    .bind(verb.id)
    .all<VerbPathRow>()

  return makeJsonResponse({
    verb: mapVerbRow(verb),
    paths: results.map(mapVerbPathRow),
  })
}

async function handleVocabularyList(request: Request, env: Env) {
  const url = new URL(request.url)
  const band = getVocabularyBand(url.searchParams.get('band'))
  const limit = clampNumber(url.searchParams.get('limit'), 240, 1, 500)
  const offset = clampNumber(url.searchParams.get('offset'), 0, 0, 10_000)
  const query = url.searchParams.get('q')?.trim().toLowerCase() ?? ''

  const where = ['frequency_rank <= ?']
  const params: Array<string | number> = [vocabularyBandLimits[band]]

  if (query) {
    where.push(
      '(normalized_word LIKE ? OR word LIKE ? OR meaning_zh LIKE ? OR definition_en LIKE ?)',
    )
    const likeQuery = `%${query}%`
    params.push(likeQuery, likeQuery, likeQuery, likeQuery)
  }

  const whereSql = where.join(' AND ')
  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM vocab WHERE ${whereSql}`,
  )
    .bind(...params)
    .first<{ total: number }>()

  const { results } = await env.DB.prepare(
    `SELECT
      id,
      word,
      normalized_word,
      lemma,
      meaning_zh,
      definition_en,
      frequency_rank,
      phonetic_us,
      phonetic_uk,
      created_at,
      updated_at
    FROM vocab
    WHERE ${whereSql}
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
      band,
      query,
    },
  })
}

async function handleVocabularyPronunciations(request: Request, env: Env) {
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

async function getVocab(env: Env, vocabularyId: string) {
  return env.DB.prepare(
    `SELECT
      id,
      word,
      normalized_word,
      lemma,
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

async function getVocabularyBundle(env: Env, vocabularyId: string) {
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

async function getVocabByLookup(env: Env, lookup: string) {
  const normalizedLookup = lookup.trim().toLowerCase()

  if (!normalizedLookup) {
    return null
  }

  return env.DB.prepare(
    `SELECT
      id,
      word,
      normalized_word,
      lemma,
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

async function handleVocabularyDetail(request: Request, env: Env) {
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

  return makeJsonResponse(detail)
}

async function handleAdminVocabularyDetail(request: Request, env: Env) {
  const vocabularyId = decodeURIComponent(
    new URL(request.url).pathname.replace('/api/admin/vocabulary/', ''),
  )
  const detail = await getVocabularyBundle(env, vocabularyId)

  if (!detail) {
    return makeErrorResponse('Vocabulary item not found', 404)
  }

  return makeJsonResponse(detail, {
    headers: {
      'X-English-Orbit-Admin-Protection': 'none',
    },
  })
}

async function savePronunciations(
  env: Env,
  core: VocabRow,
  pronunciations: AdminVocabularySavePayload['pronunciations'],
  updatedAt: string,
) {
  if (!Array.isArray(pronunciations)) {
    return
  }

  for (const [index, item] of pronunciations.entries()) {
    const phonetic = normalizeText(item.phonetic)
    const audioUrl = normalizeText(item.audioUrl)

    if (!phonetic && !audioUrl) {
      continue
    }

    const id =
      normalizeText(item.id) ||
      `${core.id}-pronunciation-${String(index + 1).padStart(2, '0')}`

    await env.DB.prepare(
      `INSERT INTO vocab_pronunciations (
        id,
        vocabulary_id,
        word,
        phonetic,
        audio_url,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        word = excluded.word,
        phonetic = excluded.phonetic,
        audio_url = excluded.audio_url,
        updated_at = excluded.updated_at`,
    )
      .bind(id, core.id, core.word, phonetic, audioUrl, updatedAt)
      .run()
  }
}

async function saveExamples(
  env: Env,
  core: VocabRow,
  examples: AdminVocabularySavePayload['examples'],
  updatedAt: string,
) {
  if (!Array.isArray(examples)) {
    return
  }

  for (const [index, item] of examples.entries()) {
    const sentenceEn = normalizeText(item.sentenceEn)

    if (!sentenceEn) {
      continue
    }

    const id =
      normalizeText(item.id) ||
      `${core.id}-example-${String(index + 1).padStart(2, '0')}`

    await env.DB.prepare(
      `INSERT INTO vocab_examples (
        id,
        vocabulary_id,
        word,
        sentence_en,
        sentence_zh,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        word = excluded.word,
        sentence_en = excluded.sentence_en,
        sentence_zh = excluded.sentence_zh,
        updated_at = excluded.updated_at`,
    )
      .bind(
        id,
        core.id,
        core.word,
        sentenceEn,
        normalizeText(item.sentenceZh),
        updatedAt,
      )
      .run()
  }
}

async function saveEditLog(
  env: Env,
  vocabularyId: string,
  editor: string,
  beforeBundle: unknown,
  afterBundle: unknown,
) {
  await env.DB.prepare(
    `INSERT INTO content_edit_logs (
      id,
      vocabulary_id,
      entity_type,
      entity_id,
      action,
      editor,
      before_json,
      after_json,
      created_at
    ) VALUES (?, ?, 'vocab_bundle', ?, 'update', ?, ?, ?, ?)`,
  )
    .bind(
      crypto.randomUUID(),
      vocabularyId,
      vocabularyId,
      editor,
      JSON.stringify(beforeBundle),
      JSON.stringify(afterBundle),
      nowIso(),
    )
    .run()
}

async function handleAdminVocabularySave(request: Request, env: Env) {
  const vocabularyId = decodeURIComponent(
    new URL(request.url).pathname.replace('/api/admin/vocabulary/', ''),
  )
  const core = await getVocab(env, vocabularyId)

  if (!core) {
    return makeErrorResponse('Vocabulary item not found', 404)
  }

  let payload: AdminVocabularySavePayload

  try {
    const rawPayload = await request.json()

    if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
      return makeErrorResponse('Invalid JSON payload')
    }

    payload = rawPayload as AdminVocabularySavePayload
  } catch {
    return makeErrorResponse('Invalid JSON payload')
  }

  const beforeBundle = await getVocabularyBundle(env, vocabularyId)
  const updatedAt = nowIso()
  const corePatch = payload.core ?? {}
  const meaningZh = normalizeText(corePatch.meaningZh, core.meaning_zh)
  const definitionEn = normalizeText(corePatch.definitionEn, core.definition_en)
  const phoneticUs = normalizeText(corePatch.phoneticUs, core.phonetic_us)
  const phoneticUk = normalizeText(corePatch.phoneticUk, core.phonetic_uk)

  await env.DB.prepare(
    `UPDATE vocab
    SET
      meaning_zh = ?,
      definition_en = ?,
      phonetic_us = ?,
      phonetic_uk = ?,
      updated_at = ?
    WHERE id = ?`,
  )
    .bind(
      meaningZh,
      definitionEn,
      phoneticUs,
      phoneticUk,
      updatedAt,
      vocabularyId,
    )
    .run()

  const updatedCore = {
    ...core,
    meaning_zh: meaningZh,
    definition_en: definitionEn,
    phonetic_us: phoneticUs,
    phonetic_uk: phoneticUk,
    updated_at: updatedAt,
  }

  await savePronunciations(env, updatedCore, payload.pronunciations, updatedAt)
  await saveExamples(env, updatedCore, payload.examples, updatedAt)

  const afterBundle = await getVocabularyBundle(env, vocabularyId)
  let editLogSaved = true

  try {
    await saveEditLog(
      env,
      vocabularyId,
      normalizeText(payload.editor, 'public-admin') || 'public-admin',
      beforeBundle,
      afterBundle,
    )
  } catch {
    editLogSaved = false
  }

  return makeJsonResponse(
    {
      ...afterBundle,
      meta: {
        editLogSaved,
      },
    },
    {
      headers: {
        'X-English-Orbit-Admin-Protection': 'none',
      },
    },
  )
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return makeJsonResponse({
        ok: true,
        service: 'english-orbit',
      })
    }

    if (url.pathname.startsWith('/api/auth/')) {
      return handleAuthRequest(request, env)
    }

    if (url.pathname === '/api/verbs' && request.method === 'GET') {
      return handleVerbList(request, env)
    }

    if (url.pathname.startsWith('/api/verbs/') && request.method === 'GET') {
      return handleVerbDetail(request, env)
    }

    if (url.pathname === '/api/vocabulary' && request.method === 'GET') {
      return handleVocabularyList(request, env)
    }

    if (
      url.pathname === '/api/vocabulary/pronunciations' &&
      request.method === 'GET'
    ) {
      return handleVocabularyPronunciations(request, env)
    }

    if (url.pathname.startsWith('/api/vocabulary/') && request.method === 'GET') {
      return handleVocabularyDetail(request, env)
    }

    if (url.pathname === '/api/admin/vocabulary' && request.method === 'GET') {
      return handleVocabularyList(request, env)
    }

    if (url.pathname.startsWith('/api/admin/vocabulary/')) {
      if (request.method === 'GET') {
        return handleAdminVocabularyDetail(request, env)
      }

      if (request.method === 'PUT') {
        return handleAdminVocabularySave(request, env)
      }
    }

    if (url.pathname.startsWith('/api/')) {
      return makeJsonResponse({ error: 'Not Found' }, { status: 404 })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
