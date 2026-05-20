type VocabularyBand = 'top-100' | 'top-500' | 'top-1000' | 'top-3000'

interface CoreVocabularyRow {
  id: string
  word: string
  meaning_zh: string
  definition_en: string
  primary_part_of_speech: string
  level: string
  frequency_rank: number | null
  frequency_band: VocabularyBand | null
  learning_priority: number
  note: string
}

interface VocabularyPronunciationRow {
  vocabulary_id: string
  accent: string
  locale: string
  phonetic: string
  audio_url: string
  audio_object_key: string
  quality_status: string
}

const vocabularyBandLimits: Record<VocabularyBand, number> = {
  'top-100': 100,
  'top-500': 500,
  'top-1000': 1000,
  'top-3000': 3000,
}

const clampNumber = (value: string | null, fallback: number, min: number, max: number) => {
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

const mapPronunciationRow = (row: VocabularyPronunciationRow) => ({
  accent: row.accent,
  locale: row.locale,
  phonetic: row.phonetic,
  audioUrl: row.audio_url,
  audioObjectKey: row.audio_object_key,
  qualityStatus: row.quality_status,
})

async function getPronunciationsByVocabularyIds(env: Env, vocabularyIds: string[]) {
  if (vocabularyIds.length === 0) {
    return new Map<string, ReturnType<typeof mapPronunciationRow>[]>()
  }

  const placeholders = vocabularyIds.map(() => '?').join(', ')
  const { results } = await env.DB.prepare(
    `SELECT
      vocabulary_id,
      accent,
      locale,
      phonetic,
      audio_url,
      audio_object_key,
      quality_status
    FROM vocabulary_pronunciations
    WHERE publish_status = 'active'
      AND vocabulary_id IN (${placeholders})
    ORDER BY vocabulary_id ASC, sort_order ASC`,
  )
    .bind(...vocabularyIds)
    .all<VocabularyPronunciationRow>()

  const pronunciationsById = new Map<
    string,
    ReturnType<typeof mapPronunciationRow>[]
  >()

  for (const row of results) {
    const current = pronunciationsById.get(row.vocabulary_id) ?? []
    current.push(mapPronunciationRow(row))
    pronunciationsById.set(row.vocabulary_id, current)
  }

  return pronunciationsById
}

async function handleVocabularyList(request: Request, env: Env) {
  const url = new URL(request.url)
  const band = getVocabularyBand(url.searchParams.get('band'))
  const limit = clampNumber(url.searchParams.get('limit'), 240, 1, 500)
  const offset = clampNumber(url.searchParams.get('offset'), 0, 0, 10_000)
  const query = url.searchParams.get('q')?.trim().toLowerCase() ?? ''
  const level = url.searchParams.get('level')?.trim() ?? ''
  const partOfSpeech = url.searchParams.get('partOfSpeech')?.trim() ?? ''

  const where = ['publish_status = ?']
  const params: Array<string | number> = ['active']

  where.push('learning_priority <= ?')
  params.push(vocabularyBandLimits[band])

  if (query) {
    where.push(
      '(normalized_word LIKE ? OR meaning_zh LIKE ? OR definition_en LIKE ?)',
    )
    const likeQuery = `%${query}%`
    params.push(likeQuery, likeQuery, likeQuery)
  }

  if (level) {
    where.push('level = ?')
    params.push(level)
  }

  if (partOfSpeech) {
    where.push('primary_part_of_speech = ?')
    params.push(partOfSpeech)
  }

  const whereSql = where.join(' AND ')
  const totalRow = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM core_vocabulary WHERE ${whereSql}`,
  )
    .bind(...params)
    .first<{ total: number }>()

  const { results } = await env.DB.prepare(
    `SELECT
      id,
      word,
      meaning_zh,
      definition_en,
      primary_part_of_speech,
      level,
      frequency_rank,
      frequency_band,
      learning_priority,
      note
    FROM core_vocabulary
    WHERE ${whereSql}
    ORDER BY learning_priority ASC
    LIMIT ?
    OFFSET ?`,
  )
    .bind(...params, limit, offset)
    .all<CoreVocabularyRow>()

  const pronunciationsById = await getPronunciationsByVocabularyIds(
    env,
    results.map((item) => item.id),
  )

  return Response.json({
    items: results.map((item) => ({
      id: item.id,
      word: item.word,
      meaning: item.meaning_zh || item.definition_en,
      meaningZh: item.meaning_zh,
      definitionEn: item.definition_en,
      partOfSpeech: item.primary_part_of_speech,
      level: item.level,
      priority: item.learning_priority,
      frequencyRank: item.frequency_rank,
      frequencyBand: item.frequency_band,
      note: item.note,
      pronunciations: pronunciationsById.get(item.id) ?? [],
    })),
    pagination: {
      total: totalRow?.total ?? 0,
      limit,
      offset,
    },
    filters: {
      band,
      query,
      level: level || null,
      partOfSpeech: partOfSpeech || null,
    },
  })
}

async function handleVocabularyPronunciations(request: Request, env: Env) {
  const url = new URL(request.url)
  const vocabularyId = url.searchParams.get('vocabularyId')?.trim() ?? ''
  const word = url.searchParams.get('word')?.trim().toLowerCase() ?? ''

  if (!vocabularyId && !word) {
    return Response.json(
      { error: 'Missing vocabularyId or word query parameter' },
      { status: 400 },
    )
  }

  const where = vocabularyId ? 'vocabulary_id = ?' : 'normalized_word = ?'
  const value = vocabularyId || word
  const { results } = await env.DB.prepare(
    `SELECT
      vocabulary_id,
      accent,
      locale,
      phonetic,
      audio_url,
      audio_object_key,
      quality_status
    FROM vocabulary_pronunciations
    WHERE publish_status = 'active'
      AND ${where}
    ORDER BY sort_order ASC`,
  )
    .bind(value)
    .all<VocabularyPronunciationRow>()

  return Response.json({
    items: results.map(mapPronunciationRow),
    filters: {
      vocabularyId: vocabularyId || null,
      word: word || null,
    },
  })
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return Response.json({
        ok: true,
        service: 'english-orbit',
      })
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

    if (url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'Not Found' }, { status: 404 })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
