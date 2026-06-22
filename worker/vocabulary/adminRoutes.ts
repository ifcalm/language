import {
  makeErrorResponse,
  makeJsonResponse,
  normalizeText,
  nowIso,
} from '../shared/http'
import { getVocab, getVocabularyBundle } from './repository'
import type { AdminVocabularySavePayload, VocabRow } from './types'

export async function handleAdminVocabularyDetail(request: Request, env: Env) {
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

export async function handleAdminVocabularySave(request: Request, env: Env) {
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
