import { useEffect, useMemo, useRef, useState } from 'react'

interface AdminVocabularyListItem {
  id: string
  word: string
  meaning: string
  meaningZh: string
  definitionEn: string
  priority: number
  frequencyRank: number | null
  phoneticUs: string
  phoneticUk: string
}

interface AdminVocabularyCore extends AdminVocabularyListItem {
  normalizedWord: string
}

interface AdminPronunciation {
  id: string
  phonetic: string
  audioUrl: string
}

interface AdminExample {
  id: string
  sentenceEn: string
  sentenceZh: string
}

interface AdminVocabularyDetail {
  core: AdminVocabularyCore
  pronunciations: AdminPronunciation[]
  examples: AdminExample[]
}

interface AdminVocabularySaveResponse extends AdminVocabularyDetail {
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

function getSavedEditor() {
  if (typeof window === 'undefined') {
    return 'ifcalm'
  }

  return window.localStorage.getItem(ADMIN_EDITOR_KEY) || 'ifcalm'
}

function createEmptyPronunciation(): AdminPronunciation {
  return {
    id: '',
    phonetic: '',
    audioUrl: '',
  }
}

function createEmptyExample(): AdminExample {
  return {
    id: '',
    sentenceEn: '',
    sentenceZh: '',
  }
}

function getPronunciationLabel(pronunciation: AdminPronunciation, index: number) {
  const normalizedId = pronunciation.id.toLowerCase()

  if (normalizedId.endsWith('-us') || normalizedId.includes('-us-')) {
    return 'US'
  }

  if (normalizedId.endsWith('-uk') || normalizedId.includes('-uk-')) {
    return 'UK'
  }

  return `读音 ${index + 1}`
}

function VocabularyAdmin() {
  const [editor, setEditor] = useState(getSavedEditor)
  const [query, setQuery] = useState('')
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
        limit: String(ADMIN_LIST_LIMIT),
        offset: '0',
      })

      if (query.trim()) {
        params.set('q', query.trim())
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
  }, [query])

  useEffect(() => {
    if (!selectedId) {
      return
    }

    const controller = new AbortController()

    async function fetchDetail() {
      setIsDetailLoading(true)
      setError('')
      setMessage('')

      try {
        const response = await fetch(
          `/api/admin/vocabulary/${encodeURIComponent(selectedId)}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`词条详情读取失败：${response.status}`)
        }

        setDraft((await response.json()) as AdminVocabularyDetail)
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

  function addPronunciation() {
    setDraft((current) =>
      current
        ? {
            ...current,
            pronunciations: [
              ...current.pronunciations,
              createEmptyPronunciation(),
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
            examples: [...current.examples, createEmptyExample()],
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
              phoneticUs: draft.core.phoneticUs,
              phoneticUk: draft.core.phoneticUk,
            },
            pronunciations: draft.pronunciations,
            examples: draft.examples,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`保存失败：${response.status}`)
      }

      const payload = (await response.json()) as AdminVocabularySaveResponse
      setDraft(payload)
      setMessage(
        payload.meta?.editLogSaved === false
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
          <h2>公共词库编辑台</h2>
          <p>
            当前只维护词库主表、读音和例句。来源、审核、场景、义项、搭配等流程字段
            已从业务表中移除，保存会直接写入 D1。
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
                <span>#{item.priority}</span>
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
                    <p>{draft.core.normalizedWord}</p>
                  </div>
                  <div className="admin-actions">
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
                      onChange={(event) =>
                        updateCore('definitionEn', event.target.value)
                      }
                    />
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
                </div>
              </article>

              <article className="panel admin-editor-card">
                <div className="section-heading">
                  <h2>读音</h2>
                  <button type="button" onClick={addPronunciation}>新增读音</button>
                </div>
                <div className="admin-stack">
                  {draft.pronunciations.map((pronunciation, index) => (
                    <div className="admin-row-card" key={pronunciation.id || index}>
                      <div className="admin-row-head">
                        <strong>{getPronunciationLabel(pronunciation, index)}</strong>
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
                          音频 URL
                          <input
                            value={pronunciation.audioUrl}
                            onChange={(event) =>
                              updatePronunciation(index, 'audioUrl', event.target.value)
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                  {draft.pronunciations.length === 0 && (
                    <p className="empty-state">这个词目前还没有读音。</p>
                  )}
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
                      </div>
                    </div>
                  ))}
                  {draft.examples.length === 0 && (
                    <p className="empty-state">这个词目前还没有例句。</p>
                  )}
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
