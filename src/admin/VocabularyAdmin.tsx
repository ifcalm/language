import { useEffect, useMemo, useRef, useState } from 'react'
import {
  partOfSpeechLabels,
  vocabularyFrequencyBandLabels,
  vocabularyLevelLabels,
  type PartOfSpeech,
  type VocabularyFrequencyBand,
  type VocabularyLevel,
} from '../data/vocabulary'

type AdminFrequencyFilter = VocabularyFrequencyBand | 'all'
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

interface AdminVocabularyListItem {
  id: string
  word: string
  meaningZh: string
  definitionEn: string
  partOfSpeech: PartOfSpeech
  level: VocabularyLevel
  priority: number
  frequencyRank: number | null
  frequencyBand: VocabularyFrequencyBand | null
  phoneticUs: string
  phoneticUk: string
  publishStatus: PublishStatus
  reviewedAt: string | null
}

interface AdminVocabularyCore extends AdminVocabularyListItem {
  normalizedWord: string
  entryType: string
  lemma: string | null
  note: string
}

interface AdminPronunciation {
  id: string
  accent: string
  locale: string
  phonetic: string
  audioUrl: string
  audioProvider: string
  audioObjectKey: string
  voiceId: string
  qualityStatus: PronunciationQualityStatus
  publishStatus: PublishStatus
  sortOrder: number
  reviewedAt: string | null
  reviewed?: boolean
}

interface AdminSense {
  id: string
  partOfSpeech: PartOfSpeech
  meaningZh: string
  definitionEn: string
  usageNote: string
  senseOrder: number
  level: VocabularyLevel | null
  publishStatus: PublishStatus
  reviewedAt: string | null
  reviewed?: boolean
}

interface AdminExample {
  id: string
  senseId: string | null
  sentenceEn: string
  sentenceZh: string
  sourceType: ExampleSourceType
  sourceRef: string
  difficulty: ExampleDifficulty | null
  exampleOrder: number
  publishStatus: PublishStatus
  reviewedAt: string | null
  reviewed?: boolean
}

interface AdminCollocation {
  id: string
  senseId: string | null
  phrase: string
  meaningZh: string
  exampleEn: string
  exampleZh: string
  collocationType: CollocationType
  sortOrder: number
  publishStatus: PublishStatus
  reviewedAt: string | null
  reviewed?: boolean
}

interface AdminScenario {
  id: string
  nameZh: string
  nameEn: string
  description: string
  sortOrder: number
}

interface AdminScenarioLink {
  scenarioId: string
  relevance: number
}

interface AdminVocabularyDetail {
  core: AdminVocabularyCore
  pronunciations: AdminPronunciation[]
  senses: AdminSense[]
  examples: AdminExample[]
  collocations: AdminCollocation[]
  scenarios: AdminScenario[]
  scenarioLinks: AdminScenarioLink[]
  scenarioIds: string[]
}

interface AdminVocabularySaveResponse extends Omit<AdminVocabularyDetail, 'scenarioIds'> {
  meta?: {
    editLogSaved?: boolean
  }
}

interface AdminVocabularyListResponse {
  items: AdminVocabularyListItem[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

const ADMIN_EDITOR_KEY = 'english-orbit-admin-editor'
const ADMIN_LIST_LIMIT = 80

const frequencyOptions: Array<{
  value: AdminFrequencyFilter
  label: string
}> = [
  { value: 'top-100', label: vocabularyFrequencyBandLabels['top-100'] },
  { value: 'top-500', label: vocabularyFrequencyBandLabels['top-500'] },
  { value: 'top-1000', label: vocabularyFrequencyBandLabels['top-1000'] },
  { value: 'all', label: '全部 3000' },
]

const qualityStatusLabels: Record<PronunciationQualityStatus, string> = {
  draft: '草稿',
  generated: '生成待审',
  reviewed: '已审核',
  'needs-review': '需复核',
  rejected: '已退回',
}

const publishStatusLabels: Record<PublishStatus, string> = {
  active: '展示',
  archived: '归档',
}

const sourceTypeLabels: Record<ExampleSourceType, string> = {
  manual: '人工整理',
  generated: '生成',
  imported: '导入',
}

const difficultyLabels: Record<ExampleDifficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '较难',
}

const collocationTypeLabels: Record<CollocationType, string> = {
  phrase: '短语',
  pattern: '句型/模式',
  'fixed-expression': '固定表达',
  'phrasal-verb': '短语动词',
  idiom: '习语',
}

function normalizeDetail(detail: Omit<AdminVocabularyDetail, 'scenarioIds'>) {
  return {
    ...detail,
    scenarioIds: detail.scenarioLinks.map((link) => link.scenarioId),
  }
}

function getSavedEditor() {
  if (typeof window === 'undefined') {
    return 'ifcalm'
  }

  return window.localStorage.getItem(ADMIN_EDITOR_KEY) || 'ifcalm'
}

function createEmptySense(core: AdminVocabularyCore, nextOrder: number): AdminSense {
  return {
    id: '',
    partOfSpeech: core.partOfSpeech,
    meaningZh: '',
    definitionEn: '',
    usageNote: '',
    senseOrder: nextOrder,
    level: core.level,
    publishStatus: 'active',
    reviewedAt: null,
  }
}

function createEmptyExample(nextOrder: number): AdminExample {
  return {
    id: '',
    senseId: null,
    sentenceEn: '',
    sentenceZh: '',
    sourceType: 'manual',
    sourceRef: 'admin-console',
    difficulty: 'easy',
    exampleOrder: nextOrder,
    publishStatus: 'active',
    reviewedAt: null,
  }
}

function createEmptyCollocation(nextOrder: number): AdminCollocation {
  return {
    id: '',
    senseId: null,
    phrase: '',
    meaningZh: '',
    exampleEn: '',
    exampleZh: '',
    collocationType: 'phrase',
    sortOrder: nextOrder,
    publishStatus: 'active',
    reviewedAt: null,
  }
}

function getReviewLabel(reviewedAt: string | null) {
  if (!reviewedAt) {
    return '未审核'
  }

  return `已审 ${reviewedAt.slice(0, 10)}`
}

function VocabularyAdmin() {
  const [editor, setEditor] = useState(getSavedEditor)
  const [query, setQuery] = useState('')
  const [frequency, setFrequency] = useState<AdminFrequencyFilter>('top-500')
  const [level, setLevel] = useState<VocabularyLevel | 'all'>('all')
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech | 'all'>('all')
  const [items, setItems] = useState<AdminVocabularyListItem[]>([])
  const [total, setTotal] = useState(0)
  const [selectedId, setSelectedId] = useState('')
  const selectedIdRef = useRef('')
  const [draft, setDraft] = useState<AdminVocabularyDetail | null>(null)
  const [isListLoading, setIsListLoading] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [markCoreReviewed, setMarkCoreReviewed] = useState(false)

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId),
    [items, selectedId],
  )

  useEffect(() => {
    window.localStorage.setItem(ADMIN_EDITOR_KEY, editor)
  }, [editor])

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchItems() {
      setIsListLoading(true)
      setError('')

      const params = new URLSearchParams({
        band: frequency === 'all' ? 'top-3000' : frequency,
        limit: String(ADMIN_LIST_LIMIT),
        offset: '0',
      })

      if (query.trim()) {
        params.set('q', query.trim())
      }

      if (level !== 'all') {
        params.set('level', level)
      }

      if (partOfSpeech !== 'all') {
        params.set('partOfSpeech', partOfSpeech)
      }

      try {
        const response = await fetch(`/api/admin/vocabulary?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`管理列表读取失败：${response.status}`)
        }

        const payload = (await response.json()) as AdminVocabularyListResponse
        setItems(payload.items)
        setTotal(payload.pagination.total)

        if (payload.items.length === 0) {
          setSelectedId('')
          setDraft(null)
          return
        }

        const currentSelectedId = selectedIdRef.current

        if (
          !currentSelectedId ||
          !payload.items.some((item) => item.id === currentSelectedId)
        ) {
          setSelectedId(payload.items[0].id)
        }
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }

        setItems([])
        setTotal(0)
        setError(fetchError instanceof Error ? fetchError.message : '管理列表读取失败')
      } finally {
        if (!controller.signal.aborted) {
          setIsListLoading(false)
        }
      }
    }

    fetchItems()

    return () => controller.abort()
  }, [frequency, level, partOfSpeech, query])

  useEffect(() => {
    if (!selectedId) {
      return
    }

    const controller = new AbortController()

    async function fetchDetail() {
      setIsDetailLoading(true)
      setError('')
      setMessage('')
      setMarkCoreReviewed(false)

      try {
        const response = await fetch(
          `/api/admin/vocabulary/${encodeURIComponent(selectedId)}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`词条详情读取失败：${response.status}`)
        }

        const payload = normalizeDetail(
          (await response.json()) as Omit<AdminVocabularyDetail, 'scenarioIds'>,
        )
        setDraft(payload)
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }

        setDraft(null)
        setError(fetchError instanceof Error ? fetchError.message : '词条详情读取失败')
      } finally {
        if (!controller.signal.aborted) {
          setIsDetailLoading(false)
        }
      }
    }

    fetchDetail()

    return () => controller.abort()
  }, [selectedId])

  function updateCore<Key extends keyof AdminVocabularyCore>(
    key: Key,
    value: AdminVocabularyCore[Key],
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            core: {
              ...current.core,
              [key]: value,
            },
          }
        : current,
    )
  }

  function updatePronunciation<Key extends keyof AdminPronunciation>(
    index: number,
    key: Key,
    value: AdminPronunciation[Key],
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            pronunciations: current.pronunciations.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [key]: value } : item,
            ),
          }
        : current,
    )
  }

  function updateSense<Key extends keyof AdminSense>(
    index: number,
    key: Key,
    value: AdminSense[Key],
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            senses: current.senses.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [key]: value } : item,
            ),
          }
        : current,
    )
  }

  function updateExample<Key extends keyof AdminExample>(
    index: number,
    key: Key,
    value: AdminExample[Key],
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            examples: current.examples.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [key]: value } : item,
            ),
          }
        : current,
    )
  }

  function updateCollocation<Key extends keyof AdminCollocation>(
    index: number,
    key: Key,
    value: AdminCollocation[Key],
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            collocations: current.collocations.map((item, itemIndex) =>
              itemIndex === index ? { ...item, [key]: value } : item,
            ),
          }
        : current,
    )
  }

  function toggleScenario(scenarioId: string) {
    setDraft((current) => {
      if (!current) {
        return current
      }

      const exists = current.scenarioIds.includes(scenarioId)
      return {
        ...current,
        scenarioIds: exists
          ? current.scenarioIds.filter((id) => id !== scenarioId)
          : [...current.scenarioIds, scenarioId],
      }
    })
  }

  function addSense() {
    setDraft((current) =>
      current
        ? {
            ...current,
            senses: [
              ...current.senses,
              createEmptySense(current.core, current.senses.length + 1),
            ],
          }
        : current,
    )
  }

  function addExample() {
    setDraft((current) =>
      current
        ? {
            ...current,
            examples: [
              ...current.examples,
              createEmptyExample(current.examples.length + 1),
            ],
          }
        : current,
    )
  }

  function addCollocation() {
    setDraft((current) =>
      current
        ? {
            ...current,
            collocations: [
              ...current.collocations,
              createEmptyCollocation(current.collocations.length + 1),
            ],
          }
        : current,
    )
  }

  async function saveDraft() {
    if (!draft) {
      return
    }

    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        `/api/admin/vocabulary/${encodeURIComponent(draft.core.id)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            editor,
            core: {
              meaningZh: draft.core.meaningZh,
              definitionEn: draft.core.definitionEn,
              partOfSpeech: draft.core.partOfSpeech,
              level: draft.core.level,
              phoneticUs: draft.core.phoneticUs,
              phoneticUk: draft.core.phoneticUk,
              note: draft.core.note,
              publishStatus: draft.core.publishStatus,
              reviewed: markCoreReviewed,
            },
            pronunciations: draft.pronunciations,
            senses: draft.senses,
            examples: draft.examples,
            collocations: draft.collocations,
            scenarioIds: draft.scenarioIds,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`保存失败：${response.status}`)
      }

      const rawPayload = (await response.json()) as AdminVocabularySaveResponse
      const payload = normalizeDetail(rawPayload)
      setDraft(payload)
      setMarkCoreReviewed(false)
      setMessage(
        rawPayload.meta?.editLogSaved === false
          ? `${payload.core.word} 已保存，但修改日志表暂不可用。请确认 D1 迁移已执行。`
          : `${payload.core.word} 已保存，修改日志已记录。`,
      )
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '保存失败')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="admin-console">
      <section className="panel admin-hero">
        <div>
          <span>Public Content Console</span>
          <h2>公共词库校对台</h2>
          <p>
            用来快速修正核心释义、英文短释、音标、义项、例句、搭配和场景。
            当前按你的要求不做 Cloudflare Access 保护，保存会直接写入 D1。
          </p>
        </div>
        <label>
          编辑人标记
          <input value={editor} onChange={(event) => setEditor(event.target.value)} />
        </label>
      </section>

      <section className="admin-layout">
        <aside className="panel admin-list-panel">
          <div className="section-heading">
            <h2>词条</h2>
            <span>{isListLoading ? '读取中…' : `${total} 个匹配`}</span>
          </div>
          <div className="admin-filters">
            <input
              placeholder="搜索单词、中文义、英文义"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              value={frequency}
              onChange={(event) =>
                setFrequency(event.target.value as AdminFrequencyFilter)
              }
            >
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={level}
              onChange={(event) =>
                setLevel(event.target.value as VocabularyLevel | 'all')
              }
            >
              <option value="all">全部级别</option>
              {Object.entries(vocabularyLevelLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={partOfSpeech}
              onChange={(event) =>
                setPartOfSpeech(event.target.value as PartOfSpeech | 'all')
              }
            >
              <option value="all">全部词性</option>
              {Object.entries(partOfSpeechLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-word-list">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === selectedId ? 'active' : ''}
                onClick={() => setSelectedId(item.id)}
              >
                <strong>{item.word}</strong>
                <span>#{item.priority} · {vocabularyLevelLabels[item.level]}</span>
                <small>{item.meaningZh || item.definitionEn}</small>
              </button>
            ))}
            {!isListLoading && items.length === 0 && (
              <p className="empty-state">没有匹配词条。</p>
            )}
          </div>
        </aside>

        <section className="admin-detail-panel">
          {(message || error) && (
            <div className={`panel admin-message ${error ? 'error' : ''}`}>
              {error || message}
            </div>
          )}

          {!draft && (
            <article className="panel admin-empty-detail">
              {isDetailLoading
                ? '正在读取词条详情…'
                : selectedItem
                  ? '请选择词条继续。'
                  : '先从左侧选择一个词条。'}
            </article>
          )}

          {draft && (
            <>
              <article className="panel admin-editor-card">
                <header className="admin-editor-header">
                  <div>
                    <span>#{draft.core.priority}</span>
                    <h2>{draft.core.word}</h2>
                    <p>
                      {draft.core.normalizedWord} · {partOfSpeechLabels[draft.core.partOfSpeech]} ·{' '}
                      {getReviewLabel(draft.core.reviewedAt)}
                    </p>
                  </div>
                  <div className="admin-actions">
                    <label className="admin-inline-check">
                      <input
                        type="checkbox"
                        checked={markCoreReviewed}
                        onChange={(event) => setMarkCoreReviewed(event.target.checked)}
                      />
                      本次标记核心已审
                    </label>
                    <button type="button" disabled={isSaving} onClick={saveDraft}>
                      {isSaving ? '保存中…' : '保存全部修改'}
                    </button>
                  </div>
                </header>

                <div className="admin-form-grid">
                  <label>
                    中文核心义
                    <input
                      value={draft.core.meaningZh}
                      onChange={(event) => updateCore('meaningZh', event.target.value)}
                    />
                  </label>
                  <label>
                    英文短释义
                    <input
                      value={draft.core.definitionEn}
                      onChange={(event) => updateCore('definitionEn', event.target.value)}
                    />
                  </label>
                  <label>
                    主要词性
                    <select
                      value={draft.core.partOfSpeech}
                      onChange={(event) =>
                        updateCore('partOfSpeech', event.target.value as PartOfSpeech)
                      }
                    >
                      {Object.entries(partOfSpeechLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    等级
                    <select
                      value={draft.core.level}
                      onChange={(event) =>
                        updateCore('level', event.target.value as VocabularyLevel)
                      }
                    >
                      {Object.entries(vocabularyLevelLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    美音 IPA
                    <input
                      value={draft.core.phoneticUs}
                      onChange={(event) => updateCore('phoneticUs', event.target.value)}
                    />
                  </label>
                  <label>
                    英音 IPA
                    <input
                      value={draft.core.phoneticUk}
                      onChange={(event) => updateCore('phoneticUk', event.target.value)}
                    />
                  </label>
                  <label>
                    展示状态
                    <select
                      value={draft.core.publishStatus}
                      onChange={(event) =>
                        updateCore('publishStatus', event.target.value as PublishStatus)
                      }
                    >
                      {Object.entries(publishStatusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    备注
                    <input
                      value={draft.core.note}
                      onChange={(event) => updateCore('note', event.target.value)}
                    />
                  </label>
                </div>
              </article>

              <article className="panel admin-editor-card">
                <div className="section-heading">
                  <h2>读音与音标</h2>
                  <span>播放、修正 IPA、标记质量</span>
                </div>
                <div className="admin-stack">
                  {draft.pronunciations.map((pronunciation, index) => (
                    <div className="admin-row-card" key={pronunciation.id || index}>
                      <div className="admin-row-head">
                        <strong>{pronunciation.accent.toUpperCase()}</strong>
                        <span>{getReviewLabel(pronunciation.reviewedAt)}</span>
                        {pronunciation.audioUrl && (
                          <audio controls src={pronunciation.audioUrl} />
                        )}
                      </div>
                      <div className="admin-form-grid compact">
                        <label>
                          音标
                          <input
                            value={pronunciation.phonetic}
                            onChange={(event) =>
                              updatePronunciation(index, 'phonetic', event.target.value)
                            }
                          />
                        </label>
                        <label>
                          质量状态
                          <select
                            value={pronunciation.qualityStatus}
                            onChange={(event) =>
                              updatePronunciation(
                                index,
                                'qualityStatus',
                                event.target.value as PronunciationQualityStatus,
                              )
                            }
                          >
                            {Object.entries(qualityStatusLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          发布状态
                          <select
                            value={pronunciation.publishStatus}
                            onChange={(event) =>
                              updatePronunciation(
                                index,
                                'publishStatus',
                                event.target.value as PublishStatus,
                              )
                            }
                          >
                            {Object.entries(publishStatusLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="admin-inline-check bottom">
                          <input
                            type="checkbox"
                            checked={Boolean(pronunciation.reviewed)}
                            onChange={(event) =>
                              updatePronunciation(index, 'reviewed', event.target.checked)
                            }
                          />
                          本次标记读音已审
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel admin-editor-card">
                <div className="section-heading">
                  <h2>常见义项</h2>
                  <button type="button" onClick={addSense}>新增义项</button>
                </div>
                <div className="admin-stack">
                  {draft.senses.map((sense, index) => (
                    <div className="admin-row-card" key={sense.id || `new-sense-${index}`}>
                      <div className="admin-form-grid">
                        <label>
                          中文义项
                          <input
                            value={sense.meaningZh}
                            onChange={(event) => updateSense(index, 'meaningZh', event.target.value)}
                          />
                        </label>
                        <label>
                          英文解释
                          <input
                            value={sense.definitionEn}
                            onChange={(event) =>
                              updateSense(index, 'definitionEn', event.target.value)
                            }
                          />
                        </label>
                        <label>
                          词性
                          <select
                            value={sense.partOfSpeech}
                            onChange={(event) =>
                              updateSense(index, 'partOfSpeech', event.target.value as PartOfSpeech)
                            }
                          >
                            {Object.entries(partOfSpeechLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          状态
                          <select
                            value={sense.publishStatus}
                            onChange={(event) =>
                              updateSense(index, 'publishStatus', event.target.value as PublishStatus)
                            }
                          >
                            {Object.entries(publishStatusLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="admin-wide">
                          使用说明
                          <input
                            value={sense.usageNote}
                            onChange={(event) => updateSense(index, 'usageNote', event.target.value)}
                          />
                        </label>
                        <label className="admin-inline-check bottom">
                          <input
                            type="checkbox"
                            checked={Boolean(sense.reviewed)}
                            onChange={(event) => updateSense(index, 'reviewed', event.target.checked)}
                          />
                          本次标记义项已审
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel admin-editor-card">
                <div className="section-heading">
                  <h2>例句</h2>
                  <button type="button" onClick={addExample}>新增例句</button>
                </div>
                <div className="admin-stack">
                  {draft.examples.map((example, index) => (
                    <div className="admin-row-card" key={example.id || `new-example-${index}`}>
                      <div className="admin-form-grid">
                        <label className="admin-wide">
                          英文例句
                          <input
                            value={example.sentenceEn}
                            onChange={(event) =>
                              updateExample(index, 'sentenceEn', event.target.value)
                            }
                          />
                        </label>
                        <label className="admin-wide">
                          中文解释
                          <input
                            value={example.sentenceZh}
                            onChange={(event) =>
                              updateExample(index, 'sentenceZh', event.target.value)
                            }
                          />
                        </label>
                        <label>
                          来源类型
                          <select
                            value={example.sourceType}
                            onChange={(event) =>
                              updateExample(index, 'sourceType', event.target.value as ExampleSourceType)
                            }
                          >
                            {Object.entries(sourceTypeLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          难度
                          <select
                            value={example.difficulty ?? ''}
                            onChange={(event) =>
                              updateExample(
                                index,
                                'difficulty',
                                (event.target.value || null) as ExampleDifficulty | null,
                              )
                            }
                          >
                            <option value="">不设置</option>
                            {Object.entries(difficultyLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          状态
                          <select
                            value={example.publishStatus}
                            onChange={(event) =>
                              updateExample(index, 'publishStatus', event.target.value as PublishStatus)
                            }
                          >
                            {Object.entries(publishStatusLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="admin-inline-check bottom">
                          <input
                            type="checkbox"
                            checked={Boolean(example.reviewed)}
                            onChange={(event) => updateExample(index, 'reviewed', event.target.checked)}
                          />
                          本次标记例句已审
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel admin-editor-card">
                <div className="section-heading">
                  <h2>常见搭配</h2>
                  <button type="button" onClick={addCollocation}>新增搭配</button>
                </div>
                <div className="admin-stack">
                  {draft.collocations.map((collocation, index) => (
                    <div
                      className="admin-row-card"
                      key={collocation.id || `new-collocation-${index}`}
                    >
                      <div className="admin-form-grid">
                        <label>
                          搭配/短语
                          <input
                            value={collocation.phrase}
                            onChange={(event) =>
                              updateCollocation(index, 'phrase', event.target.value)
                            }
                          />
                        </label>
                        <label>
                          中文含义
                          <input
                            value={collocation.meaningZh}
                            onChange={(event) =>
                              updateCollocation(index, 'meaningZh', event.target.value)
                            }
                          />
                        </label>
                        <label>
                          类型
                          <select
                            value={collocation.collocationType}
                            onChange={(event) =>
                              updateCollocation(
                                index,
                                'collocationType',
                                event.target.value as CollocationType,
                              )
                            }
                          >
                            {Object.entries(collocationTypeLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          状态
                          <select
                            value={collocation.publishStatus}
                            onChange={(event) =>
                              updateCollocation(
                                index,
                                'publishStatus',
                                event.target.value as PublishStatus,
                              )
                            }
                          >
                            {Object.entries(publishStatusLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="admin-wide">
                          搭配例句
                          <input
                            value={collocation.exampleEn}
                            onChange={(event) =>
                              updateCollocation(index, 'exampleEn', event.target.value)
                            }
                          />
                        </label>
                        <label className="admin-wide">
                          例句中文
                          <input
                            value={collocation.exampleZh}
                            onChange={(event) =>
                              updateCollocation(index, 'exampleZh', event.target.value)
                            }
                          />
                        </label>
                        <label className="admin-inline-check bottom">
                          <input
                            type="checkbox"
                            checked={Boolean(collocation.reviewed)}
                            onChange={(event) =>
                              updateCollocation(index, 'reviewed', event.target.checked)
                            }
                          />
                          本次标记搭配已审
                        </label>
                      </div>
                    </div>
                  ))}
                  {draft.collocations.length === 0 && (
                    <p className="empty-state">这个词目前还没有常见搭配。</p>
                  )}
                </div>
              </article>

              <article className="panel admin-editor-card">
                <div className="section-heading">
                  <h2>使用场景</h2>
                  <span>{draft.scenarioIds.length} 个已选</span>
                </div>
                <div className="admin-scenario-grid">
                  {draft.scenarios.map((scenario) => (
                    <label key={scenario.id}>
                      <input
                        type="checkbox"
                        checked={draft.scenarioIds.includes(scenario.id)}
                        onChange={() => toggleScenario(scenario.id)}
                      />
                      <span>
                        <strong>{scenario.nameZh}</strong>
                        <small>{scenario.nameEn}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </article>
            </>
          )}
        </section>
      </section>
    </section>
  )
}

export default VocabularyAdmin
