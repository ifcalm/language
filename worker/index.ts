type VocabularyBand = 'top-100' | 'top-500' | 'top-1000' | 'top-3000'
type VocabularyLevel = 'A1' | 'A2' | 'B1' | 'B2'
type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'determiner'
  | 'modal'
  | 'interjection'
  | 'number'
type PublishStatus = 'active' | 'archived'
type PronunciationQualityStatus =
  | 'draft'
  | 'generated'
  | 'reviewed'
  | 'needs-review'
  | 'rejected'
type ExampleSourceType = 'manual' | 'generated' | 'imported'
type ExampleDifficulty = 'easy' | 'medium' | 'hard'
type CollocationType =
  | 'phrase'
  | 'pattern'
  | 'fixed-expression'
  | 'phrasal-verb'
  | 'idiom'

interface CoreVocabularyRow {
  id: string
  word: string
  normalized_word: string
  entry_type: string
  lemma: string | null
  meaning_zh: string
  definition_en: string
  primary_part_of_speech: PartOfSpeech
  level: VocabularyLevel
  frequency_rank: number | null
  frequency_band: VocabularyBand | null
  learning_priority: number
  publish_status: PublishStatus
  note: string
  reviewed_at: string | null
  phonetic_us: string
  phonetic_uk: string
}

interface VocabularyPronunciationRow {
  id: string
  vocabulary_id: string
  word: string
  normalized_word: string
  accent: string
  locale: string
  phonetic: string
  audio_url: string
  audio_provider: string
  audio_object_key: string
  voice_id: string
  audio_format: string
  license: string
  attribution: string
  quality_status: PronunciationQualityStatus
  publish_status: PublishStatus
  sort_order: number
  reviewed_at: string | null
}

interface VocabularySenseRow {
  id: string
  vocabulary_id: string
  word: string
  normalized_word: string
  part_of_speech: PartOfSpeech
  meaning_zh: string
  definition_en: string
  usage_note: string
  sense_order: number
  level: VocabularyLevel | null
  publish_status: PublishStatus
  reviewed_at: string | null
}

interface VocabularyExampleRow {
  id: string
  vocabulary_id: string
  word: string
  normalized_word: string
  sense_id: string | null
  sentence_en: string
  sentence_zh: string
  source_type: ExampleSourceType
  source_ref: string
  difficulty: ExampleDifficulty | null
  example_order: number
  publish_status: PublishStatus
  reviewed_at: string | null
}

interface VocabularyCollocationRow {
  id: string
  vocabulary_id: string
  word: string
  normalized_word: string
  sense_id: string | null
  phrase: string
  normalized_phrase: string
  meaning_zh: string
  example_en: string
  example_zh: string
  collocation_type: CollocationType
  sort_order: number
  publish_status: PublishStatus
  reviewed_at: string | null
}

interface VocabularyScenarioRow {
  id: string
  name_zh: string
  name_en: string
  description: string
  sort_order: number
}

interface VocabularyScenarioLinkRow {
  scenario_id: string
  relevance: number
}

interface AdminVocabularySavePayload {
  editor?: string
  core?: Partial<{
    meaningZh: string
    definitionEn: string
    partOfSpeech: PartOfSpeech
    level: VocabularyLevel
    phoneticUs: string
    phoneticUk: string
    note: string
    publishStatus: PublishStatus
    reviewed: boolean
  }>
  pronunciations?: Array<
    Partial<{
      id: string
      accent: string
      locale: string
      phonetic: string
      qualityStatus: PronunciationQualityStatus
      publishStatus: PublishStatus
      reviewed: boolean
      reviewedAt: string | null
    }>
  >
  senses?: Array<
    Partial<{
      id: string
      partOfSpeech: PartOfSpeech
      meaningZh: string
      definitionEn: string
      usageNote: string
      senseOrder: number
      level: VocabularyLevel | '' | null
      publishStatus: PublishStatus
      reviewed: boolean
      reviewedAt: string | null
    }>
  >
  examples?: Array<
    Partial<{
      id: string
      senseId: string | '' | null
      sentenceEn: string
      sentenceZh: string
      sourceType: ExampleSourceType
      sourceRef: string
      difficulty: ExampleDifficulty | '' | null
      exampleOrder: number
      publishStatus: PublishStatus
      reviewed: boolean
      reviewedAt: string | null
    }>
  >
  collocations?: Array<
    Partial<{
      id: string
      senseId: string | '' | null
      phrase: string
      meaningZh: string
      exampleEn: string
      exampleZh: string
      collocationType: CollocationType
      sortOrder: number
      publishStatus: PublishStatus
      reviewed: boolean
      reviewedAt: string | null
    }>
  >
  scenarioIds?: string[]
}

const vocabularyBandLimits: Record<VocabularyBand, number> = {
  'top-100': 100,
  'top-500': 500,
  'top-1000': 1000,
  'top-3000': 3000,
}

const partOfSpeechValues: PartOfSpeech[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'phrase',
  'pronoun',
  'preposition',
  'conjunction',
  'determiner',
  'modal',
  'interjection',
  'number',
]
const vocabularyLevelValues: VocabularyLevel[] = ['A1', 'A2', 'B1', 'B2']
const publishStatusValues: PublishStatus[] = ['active', 'archived']
const pronunciationQualityValues: PronunciationQualityStatus[] = [
  'draft',
  'generated',
  'reviewed',
  'needs-review',
  'rejected',
]
const exampleSourceTypeValues: ExampleSourceType[] = [
  'manual',
  'generated',
  'imported',
]
const exampleDifficultyValues: ExampleDifficulty[] = ['easy', 'medium', 'hard']
const collocationTypeValues: CollocationType[] = [
  'phrase',
  'pattern',
  'fixed-expression',
  'phrasal-verb',
  'idiom',
]
const pronunciationLookupBatchSize = 90

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

const nowIso = () => new Date().toISOString()

const normalizeWord = (value: string) => value.trim().toLowerCase()

const normalizeText = (value: unknown, fallback = '') => {
  if (typeof value !== 'string') {
    return fallback
  }

  return value.trim()
}

const normalizeNullableText = (value: unknown) => {
  const text = normalizeText(value)
  return text || null
}

const normalizeInteger = (value: unknown, fallback: number) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.floor(parsed)
}

const pickValue = <Value extends string>(
  value: unknown,
  allowedValues: Value[],
  fallback: Value,
) => {
  if (typeof value !== 'string') {
    return fallback
  }

  return allowedValues.includes(value as Value) ? (value as Value) : fallback
}

const pickNullableValue = <Value extends string>(
  value: unknown,
  allowedValues: Value[],
) => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (typeof value !== 'string') {
    return null
  }

  return allowedValues.includes(value as Value) ? (value as Value) : null
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

const mapPronunciationRow = (row: VocabularyPronunciationRow) => ({
  id: row.id,
  accent: row.accent,
  locale: row.locale,
  phonetic: row.phonetic,
  audioUrl: row.audio_url,
  audioProvider: row.audio_provider,
  audioObjectKey: row.audio_object_key,
  voiceId: row.voice_id,
  audioFormat: row.audio_format,
  license: row.license,
  attribution: row.attribution,
  qualityStatus: row.quality_status,
  publishStatus: row.publish_status,
  sortOrder: row.sort_order,
  reviewedAt: row.reviewed_at,
})

const mapCoreRow = (row: CoreVocabularyRow) => ({
  id: row.id,
  word: row.word,
  normalizedWord: row.normalized_word,
  entryType: row.entry_type,
  lemma: row.lemma,
  meaning: row.meaning_zh || row.definition_en,
  meaningZh: row.meaning_zh,
  definitionEn: row.definition_en,
  partOfSpeech: row.primary_part_of_speech,
  level: row.level,
  priority: row.learning_priority,
  frequencyRank: row.frequency_rank,
  frequencyBand: row.frequency_band,
  note: row.note,
  phoneticUs: row.phonetic_us,
  phoneticUk: row.phonetic_uk,
  publishStatus: row.publish_status,
  reviewedAt: row.reviewed_at,
})

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

  for (
    let index = 0;
    index < vocabularyIds.length;
    index += pronunciationLookupBatchSize
  ) {
    const batchIds = vocabularyIds.slice(
      index,
      index + pronunciationLookupBatchSize,
    )
    const placeholders = batchIds.map(() => '?').join(', ')
    const { results } = await env.DB.prepare(
      `SELECT
        id,
        vocabulary_id,
        word,
        normalized_word,
        accent,
        locale,
        phonetic,
        audio_url,
        audio_provider,
        audio_object_key,
        voice_id,
        audio_format,
        license,
        attribution,
        quality_status,
        publish_status,
        sort_order,
        reviewed_at
      FROM vocabulary_pronunciations
      WHERE publish_status = 'active'
        AND vocabulary_id IN (${placeholders})
      ORDER BY vocabulary_id ASC, sort_order ASC`,
    )
      .bind(...batchIds)
      .all<VocabularyPronunciationRow>()

    for (const row of results) {
      const current = pronunciationsById.get(row.vocabulary_id) ?? []
      current.push(mapPronunciationRow(row))
      pronunciationsById.set(row.vocabulary_id, current)
    }
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
      normalized_word,
      entry_type,
      lemma,
      meaning_zh,
      definition_en,
      primary_part_of_speech,
      level,
      frequency_rank,
      frequency_band,
      learning_priority,
      publish_status,
      note,
      reviewed_at,
      phonetic_us,
      phonetic_uk
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

  return makeJsonResponse({
    items: results.map((item) => ({
      ...mapCoreRow(item),
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
    return makeErrorResponse('Missing vocabularyId or word query parameter')
  }

  const where = vocabularyId ? 'vocabulary_id = ?' : 'normalized_word = ?'
  const value = vocabularyId || word
  const { results } = await env.DB.prepare(
    `SELECT
      id,
      vocabulary_id,
      word,
      normalized_word,
      accent,
      locale,
      phonetic,
      audio_url,
      audio_provider,
      audio_object_key,
      voice_id,
      audio_format,
      license,
      attribution,
      quality_status,
      publish_status,
      sort_order,
      reviewed_at
    FROM vocabulary_pronunciations
    WHERE publish_status = 'active'
      AND ${where}
    ORDER BY sort_order ASC`,
  )
    .bind(value)
    .all<VocabularyPronunciationRow>()

  return makeJsonResponse({
    items: results.map(mapPronunciationRow),
    filters: {
      vocabularyId: vocabularyId || null,
      word: word || null,
    },
  })
}

async function getCoreVocabulary(env: Env, vocabularyId: string) {
  return env.DB.prepare(
    `SELECT
      id,
      word,
      normalized_word,
      entry_type,
      lemma,
      meaning_zh,
      definition_en,
      primary_part_of_speech,
      level,
      frequency_rank,
      frequency_band,
      learning_priority,
      publish_status,
      note,
      reviewed_at,
      phonetic_us,
      phonetic_uk
    FROM core_vocabulary
    WHERE id = ?`,
  )
    .bind(vocabularyId)
    .first<CoreVocabularyRow>()
}

async function getVocabularyBundle(env: Env, vocabularyId: string) {
  const core = await getCoreVocabulary(env, vocabularyId)

  if (!core) {
    return null
  }

  const [pronunciations, senses, examples, collocations, scenarios, scenarioLinks] =
    await Promise.all([
      env.DB.prepare(
        `SELECT
          id,
          vocabulary_id,
          word,
          normalized_word,
          accent,
          locale,
          phonetic,
          audio_url,
          audio_provider,
          audio_object_key,
          voice_id,
          audio_format,
          license,
          attribution,
          quality_status,
          publish_status,
          sort_order,
          reviewed_at
        FROM vocabulary_pronunciations
        WHERE vocabulary_id = ?
        ORDER BY sort_order ASC, accent ASC`,
      )
        .bind(vocabularyId)
        .all<VocabularyPronunciationRow>(),
      env.DB.prepare(
        `SELECT
          id,
          vocabulary_id,
          word,
          normalized_word,
          part_of_speech,
          meaning_zh,
          definition_en,
          usage_note,
          sense_order,
          level,
          publish_status,
          reviewed_at
        FROM vocabulary_senses
        WHERE vocabulary_id = ?
        ORDER BY sense_order ASC, id ASC`,
      )
        .bind(vocabularyId)
        .all<VocabularySenseRow>(),
      env.DB.prepare(
        `SELECT
          id,
          vocabulary_id,
          word,
          normalized_word,
          sense_id,
          sentence_en,
          sentence_zh,
          source_type,
          source_ref,
          difficulty,
          example_order,
          publish_status,
          reviewed_at
        FROM vocabulary_examples
        WHERE vocabulary_id = ?
        ORDER BY example_order ASC, id ASC`,
      )
        .bind(vocabularyId)
        .all<VocabularyExampleRow>(),
      env.DB.prepare(
        `SELECT
          id,
          vocabulary_id,
          word,
          normalized_word,
          sense_id,
          phrase,
          normalized_phrase,
          meaning_zh,
          example_en,
          example_zh,
          collocation_type,
          sort_order,
          publish_status,
          reviewed_at
        FROM vocabulary_collocations
        WHERE vocabulary_id = ?
        ORDER BY sort_order ASC, id ASC`,
      )
        .bind(vocabularyId)
        .all<VocabularyCollocationRow>(),
      env.DB.prepare(
        `SELECT id, name_zh, name_en, description, sort_order
        FROM vocabulary_scenarios
        WHERE publish_status = 'active'
        ORDER BY sort_order ASC, id ASC`,
      ).all<VocabularyScenarioRow>(),
      env.DB.prepare(
        `SELECT scenario_id, relevance
        FROM vocabulary_scenario_links
        WHERE vocabulary_id = ?
        ORDER BY relevance DESC, scenario_id ASC`,
      )
        .bind(vocabularyId)
        .all<VocabularyScenarioLinkRow>(),
    ])

  return {
    core: mapCoreRow(core),
    pronunciations: pronunciations.results.map(mapPronunciationRow),
    senses: senses.results.map((row) => ({
      id: row.id,
      partOfSpeech: row.part_of_speech,
      meaningZh: row.meaning_zh,
      definitionEn: row.definition_en,
      usageNote: row.usage_note,
      senseOrder: row.sense_order,
      level: row.level,
      publishStatus: row.publish_status,
      reviewedAt: row.reviewed_at,
    })),
    examples: examples.results.map((row) => ({
      id: row.id,
      senseId: row.sense_id,
      sentenceEn: row.sentence_en,
      sentenceZh: row.sentence_zh,
      sourceType: row.source_type,
      sourceRef: row.source_ref,
      difficulty: row.difficulty,
      exampleOrder: row.example_order,
      publishStatus: row.publish_status,
      reviewedAt: row.reviewed_at,
    })),
    collocations: collocations.results.map((row) => ({
      id: row.id,
      senseId: row.sense_id,
      phrase: row.phrase,
      meaningZh: row.meaning_zh,
      exampleEn: row.example_en,
      exampleZh: row.example_zh,
      collocationType: row.collocation_type,
      sortOrder: row.sort_order,
      publishStatus: row.publish_status,
      reviewedAt: row.reviewed_at,
    })),
    scenarios: scenarios.results.map((row) => ({
      id: row.id,
      nameZh: row.name_zh,
      nameEn: row.name_en,
      description: row.description,
      sortOrder: row.sort_order,
    })),
    scenarioLinks: scenarioLinks.results.map((row) => ({
      scenarioId: row.scenario_id,
      relevance: row.relevance,
    })),
  }
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
  core: CoreVocabularyRow,
  pronunciations: AdminVocabularySavePayload['pronunciations'],
  reviewedAt: string,
) {
  if (!Array.isArray(pronunciations)) {
    return
  }

  for (const [index, item] of pronunciations.entries()) {
    const accent = normalizeText(item.accent, 'other') || 'other'
    const id =
      normalizeText(item.id) ||
      `${core.id}-${accent}-${crypto.randomUUID().slice(0, 8)}`
    const phonetic = normalizeText(item.phonetic)
    const qualityStatus = pickValue(
      item.qualityStatus,
      pronunciationQualityValues,
      'draft',
    )
    const publishStatus = pickValue(item.publishStatus, publishStatusValues, 'active')
    const locale = normalizeText(item.locale)
    const sortOrder = accent === 'us' ? 1 : accent === 'uk' ? 2 : index + 10
    const rowReviewedAt = item.reviewed
      ? reviewedAt
      : normalizeNullableText(item.reviewedAt)

    if (!phonetic && publishStatus === 'archived') {
      continue
    }

    await env.DB.prepare(
      `INSERT INTO vocabulary_pronunciations (
        id,
        vocabulary_id,
        word,
        normalized_word,
        accent,
        locale,
        phonetic,
        audio_url,
        audio_source,
        sort_order,
        publish_status,
        updated_at,
        reviewed_at,
        quality_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, '', 'none', ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        locale = excluded.locale,
        phonetic = excluded.phonetic,
        publish_status = excluded.publish_status,
        updated_at = excluded.updated_at,
        reviewed_at = excluded.reviewed_at,
        quality_status = excluded.quality_status`,
    )
      .bind(
        id,
        core.id,
        core.word,
        core.normalized_word,
        accent,
        locale,
        phonetic,
        sortOrder,
        publishStatus,
        reviewedAt,
        rowReviewedAt,
        qualityStatus,
      )
      .run()
  }
}

async function saveSenses(
  env: Env,
  core: CoreVocabularyRow,
  senses: AdminVocabularySavePayload['senses'],
  reviewedAt: string,
) {
  if (!Array.isArray(senses)) {
    return
  }

  for (const [index, item] of senses.entries()) {
    const meaningZh = normalizeText(item.meaningZh)
    const definitionEn = normalizeText(item.definitionEn)
    const publishStatus = pickValue(item.publishStatus, publishStatusValues, 'active')

    if (!meaningZh && !definitionEn && publishStatus === 'active') {
      continue
    }

    const id = normalizeText(item.id) || `${core.id}-sense-${crypto.randomUUID().slice(0, 8)}`
    const partOfSpeech = pickValue(
      item.partOfSpeech,
      partOfSpeechValues,
      core.primary_part_of_speech,
    )
    const senseOrder = normalizeInteger(item.senseOrder, index + 1)
    const rowReviewedAt = item.reviewed
      ? reviewedAt
      : normalizeNullableText(item.reviewedAt)

    await env.DB.prepare(
      `INSERT INTO vocabulary_senses (
        id,
        vocabulary_id,
        word,
        normalized_word,
        part_of_speech,
        meaning_zh,
        definition_en,
        usage_note,
        sense_order,
        level,
        publish_status,
        updated_at,
        reviewed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        part_of_speech = excluded.part_of_speech,
        meaning_zh = excluded.meaning_zh,
        definition_en = excluded.definition_en,
        usage_note = excluded.usage_note,
        sense_order = excluded.sense_order,
        level = excluded.level,
        publish_status = excluded.publish_status,
        updated_at = excluded.updated_at,
        reviewed_at = excluded.reviewed_at`,
    )
      .bind(
        id,
        core.id,
        core.word,
        core.normalized_word,
        partOfSpeech,
        meaningZh,
        definitionEn,
        normalizeText(item.usageNote),
        senseOrder,
        pickNullableValue(item.level, vocabularyLevelValues),
        publishStatus,
        reviewedAt,
        rowReviewedAt,
      )
      .run()
  }
}

async function saveExamples(
  env: Env,
  core: CoreVocabularyRow,
  examples: AdminVocabularySavePayload['examples'],
  reviewedAt: string,
) {
  if (!Array.isArray(examples)) {
    return
  }

  for (const [index, item] of examples.entries()) {
    const sentenceEn = normalizeText(item.sentenceEn)
    const publishStatus = pickValue(item.publishStatus, publishStatusValues, 'active')

    if (!sentenceEn && publishStatus === 'active') {
      continue
    }

    const id =
      normalizeText(item.id) || `${core.id}-example-${crypto.randomUUID().slice(0, 8)}`
    const exampleOrder = normalizeInteger(item.exampleOrder, index + 1)
    const rowReviewedAt = item.reviewed
      ? reviewedAt
      : normalizeNullableText(item.reviewedAt)

    await env.DB.prepare(
      `INSERT INTO vocabulary_examples (
        id,
        vocabulary_id,
        word,
        normalized_word,
        sense_id,
        sentence_en,
        sentence_zh,
        source_type,
        source_ref,
        difficulty,
        example_order,
        publish_status,
        updated_at,
        reviewed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        sense_id = excluded.sense_id,
        sentence_en = excluded.sentence_en,
        sentence_zh = excluded.sentence_zh,
        source_type = excluded.source_type,
        source_ref = excluded.source_ref,
        difficulty = excluded.difficulty,
        example_order = excluded.example_order,
        publish_status = excluded.publish_status,
        updated_at = excluded.updated_at,
        reviewed_at = excluded.reviewed_at`,
    )
      .bind(
        id,
        core.id,
        core.word,
        core.normalized_word,
        normalizeNullableText(item.senseId),
        sentenceEn,
        normalizeText(item.sentenceZh),
        pickValue(item.sourceType, exampleSourceTypeValues, 'manual'),
        normalizeText(item.sourceRef),
        pickNullableValue(item.difficulty, exampleDifficultyValues),
        exampleOrder,
        publishStatus,
        reviewedAt,
        rowReviewedAt,
      )
      .run()
  }
}

async function saveCollocations(
  env: Env,
  core: CoreVocabularyRow,
  collocations: AdminVocabularySavePayload['collocations'],
  reviewedAt: string,
) {
  if (!Array.isArray(collocations)) {
    return
  }

  for (const [index, item] of collocations.entries()) {
    const phrase = normalizeText(item.phrase)
    const publishStatus = pickValue(item.publishStatus, publishStatusValues, 'active')

    if (!phrase && publishStatus === 'active') {
      continue
    }

    const id =
      normalizeText(item.id) ||
      `${core.id}-collocation-${crypto.randomUUID().slice(0, 8)}`
    const sortOrder = normalizeInteger(item.sortOrder, index + 1)
    const rowReviewedAt = item.reviewed
      ? reviewedAt
      : normalizeNullableText(item.reviewedAt)

    await env.DB.prepare(
      `INSERT INTO vocabulary_collocations (
        id,
        vocabulary_id,
        word,
        normalized_word,
        sense_id,
        phrase,
        normalized_phrase,
        meaning_zh,
        example_en,
        example_zh,
        collocation_type,
        sort_order,
        publish_status,
        updated_at,
        reviewed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        sense_id = excluded.sense_id,
        phrase = excluded.phrase,
        normalized_phrase = excluded.normalized_phrase,
        meaning_zh = excluded.meaning_zh,
        example_en = excluded.example_en,
        example_zh = excluded.example_zh,
        collocation_type = excluded.collocation_type,
        sort_order = excluded.sort_order,
        publish_status = excluded.publish_status,
        updated_at = excluded.updated_at,
        reviewed_at = excluded.reviewed_at`,
    )
      .bind(
        id,
        core.id,
        core.word,
        core.normalized_word,
        normalizeNullableText(item.senseId),
        phrase,
        normalizeWord(phrase),
        normalizeText(item.meaningZh),
        normalizeText(item.exampleEn),
        normalizeText(item.exampleZh),
        pickValue(item.collocationType, collocationTypeValues, 'phrase'),
        sortOrder,
        publishStatus,
        reviewedAt,
        rowReviewedAt,
      )
      .run()
  }
}

async function saveScenarioLinks(
  env: Env,
  core: CoreVocabularyRow,
  scenarioIds: string[] | undefined,
) {
  if (!Array.isArray(scenarioIds)) {
    return
  }

  const normalizedScenarioIds = [...new Set(scenarioIds.map((scenarioId) => normalizeText(scenarioId)))].filter(
    Boolean,
  )

  await env.DB.prepare(
    'DELETE FROM vocabulary_scenario_links WHERE vocabulary_id = ?',
  )
    .bind(core.id)
    .run()

  for (const scenarioId of normalizedScenarioIds) {
    await env.DB.prepare(
      `INSERT INTO vocabulary_scenario_links (
        vocabulary_id,
        word,
        normalized_word,
        scenario_id,
        relevance
      ) VALUES (?, ?, ?, ?, 80)
      ON CONFLICT(vocabulary_id, scenario_id) DO UPDATE SET
        relevance = excluded.relevance`,
    )
      .bind(core.id, core.word, core.normalized_word, scenarioId)
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
    ) VALUES (?, ?, 'vocabulary_bundle', ?, 'update', ?, ?, ?, ?)`,
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
  const core = await getCoreVocabulary(env, vocabularyId)

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
  const corePatch = payload.core ?? {}
  const reviewedAt = nowIso()
  const coreReviewedAt = corePatch.reviewed ? reviewedAt : core.reviewed_at
  const meaningZh = normalizeText(corePatch.meaningZh, core.meaning_zh)
  const definitionEn = normalizeText(corePatch.definitionEn, core.definition_en)
  const partOfSpeech = pickValue(
    corePatch.partOfSpeech,
    partOfSpeechValues,
    core.primary_part_of_speech,
  )
  const level = pickValue(corePatch.level, vocabularyLevelValues, core.level)
  const publishStatus = pickValue(
    corePatch.publishStatus,
    publishStatusValues,
    core.publish_status,
  )
  const phoneticUs = normalizeText(corePatch.phoneticUs, core.phonetic_us)
  const phoneticUk = normalizeText(corePatch.phoneticUk, core.phonetic_uk)

  await env.DB.prepare(
    `UPDATE core_vocabulary
    SET
      meaning_zh = ?,
      definition_en = ?,
      primary_part_of_speech = ?,
      level = ?,
      phonetic_us = ?,
      phonetic_uk = ?,
      note = ?,
      publish_status = ?,
      reviewed_at = ?,
      updated_at = ?
    WHERE id = ?`,
  )
    .bind(
      meaningZh,
      definitionEn,
      partOfSpeech,
      level,
      phoneticUs,
      phoneticUk,
      normalizeText(corePatch.note, core.note),
      publishStatus,
      coreReviewedAt,
      reviewedAt,
      vocabularyId,
    )
    .run()

  const updatedCore = {
    ...core,
    meaning_zh: meaningZh,
    definition_en: definitionEn,
    primary_part_of_speech: partOfSpeech,
    level,
    phonetic_us: phoneticUs,
    phonetic_uk: phoneticUk,
    note: normalizeText(corePatch.note, core.note),
    publish_status: publishStatus,
    reviewed_at: coreReviewedAt,
  }

  await savePronunciations(env, updatedCore, payload.pronunciations, reviewedAt)
  await saveSenses(env, updatedCore, payload.senses, reviewedAt)
  await saveExamples(env, updatedCore, payload.examples, reviewedAt)
  await saveCollocations(env, updatedCore, payload.collocations, reviewedAt)
  await saveScenarioLinks(env, updatedCore, payload.scenarioIds)

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

    if (url.pathname === '/api/vocabulary' && request.method === 'GET') {
      return handleVocabularyList(request, env)
    }

    if (
      url.pathname === '/api/vocabulary/pronunciations' &&
      request.method === 'GET'
    ) {
      return handleVocabularyPronunciations(request, env)
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
