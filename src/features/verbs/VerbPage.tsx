import { useEffect, useMemo, useState } from 'react'
import { requestVerbDetail, requestVerbList } from './api'
import SentenceAnalysis from '../analysis/SentenceAnalysis'
import SentenceGrowthPlayer from './SentenceGrowthPlayer'
import type { VerbDetail, VerbListItem } from './types'
import './verbs.css'

interface VerbPageProps {
  selectedVerbId: string
  onOpenVerb: (verbId: string) => void
  onBackToList: () => void
}

function getSceneLabel(scene: string) {
  const sceneLabels: Record<string, string> = {
    api: 'API',
    ci: 'CI',
    cli: 'CLI',
    code: '代码',
    config: '配置',
    debug: '调试',
    deploy: '部署',
    frontend: '前端',
    queue: '队列',
    release: '发布',
    runtime: '运行时',
    security: '安全',
    system: '系统',
  }

  return sceneLabels[scene] ?? (scene || '通用')
}

const VERB_PAGE_SIZE = 120

function VerbList({ onOpenVerb }: Pick<VerbPageProps, 'onOpenVerb'>) {
  const [query, setQuery] = useState('')
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<VerbListItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset to the first page whenever the query changes.
  useEffect(() => {
    setOffset(0)
  }, [query])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchVerbs() {
      setIsLoading(true)
      setError('')

      try {
        const payload = await requestVerbList(
          { query, offset, limit: VERB_PAGE_SIZE },
          controller.signal,
        )
        setItems(payload.items)
        setTotal(payload.pagination.total)
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }

        setItems([])
        setTotal(0)
        setError(fetchError instanceof Error ? fetchError.message : '动词列表暂时无法读取')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchVerbs()

    return () => controller.abort()
  }, [query, offset])

  const shownStart = items.length > 0 ? offset + 1 : 0
  const shownEnd = offset + items.length
  const lastPageOffset =
    Math.floor(Math.max(total - 1, 0) / VERB_PAGE_SIZE) * VERB_PAGE_SIZE

  function goToOffset(nextOffset: number) {
    const clamped = Math.max(0, Math.min(nextOffset, lastPageOffset))
    setOffset(clamped)

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const pagination = (
    <div className="verbs-pager">
      <button
        type="button"
        className="verbs-pager-btn"
        aria-label="上一批"
        disabled={offset === 0 || isLoading}
        onClick={() => goToOffset(offset - VERB_PAGE_SIZE)}
      >
        ←
      </button>
      <span className="verbs-pager-range">
        {shownStart > 0 ? `${shownStart}–${shownEnd} / ${total}` : `0 / ${total}`}
      </span>
      <button
        type="button"
        className="verbs-pager-btn"
        aria-label="下一批"
        disabled={shownEnd >= total || isLoading}
        onClick={() => goToOffset(offset + VERB_PAGE_SIZE)}
      >
        →
      </button>
    </div>
  )

  const showEmptyState = !isLoading && !error && items.length === 0

  return (
    <>
      <section className="verbs-toolbar">
        <div className="verbs-search-box">
          <input
            className="verbs-search"
            aria-label="搜索动词"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <svg
            className="verbs-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        {pagination}
      </section>

      {error && (
        <section className="panel verbs-status">
          动词暂时无法读取，请稍后再试。
        </section>
      )}

      {isLoading && (
        <section
          className="panel verbs-list"
          aria-label="正在加载动词列表"
          aria-busy="true"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="verb-row verb-row-skeleton" aria-hidden="true">
              <span className="verb-row-rank" />
              <span className="verb-row-word" />
              <span className="verb-row-meaning" />
            </div>
          ))}
        </section>
      )}

      {showEmptyState && (
        <section className="panel verbs-status">
          {query
            ? `没有匹配「${query}」的动词，换个词试试。`
            : '暂时没有可显示的动词。'}
        </section>
      )}

      {!isLoading && items.length > 0 && (
        <section className="panel verbs-list" aria-label="动词列表">
          {items.map((item, index) => (
            <div key={item.id} className="verb-row-item">
              <button
                type="button"
                className={`verb-row${item.pathCount === 0 ? ' is-pending' : ''}`}
                onClick={() => onOpenVerb(item.id)}
              >
                <span className="verb-row-rank">
                  #{String(offset + index + 1).padStart(4, '0')}
                </span>
                <span className="verb-row-word">{item.verb}</span>
                <span className="verb-row-meaning">{item.meaningZh}</span>
                {item.coreSentenceEn && (
                  <span className="verb-row-example" title={item.coreSentenceZh}>
                    {item.coreSentenceEn}
                  </span>
                )}
              </button>
              {item.isPhrase && <span className="verb-row-tag">短语</span>}
              {item.coreSentenceEn && (
                <SentenceAnalysis
                  sentence={item.coreSentenceEn}
                  word={item.verb}
                  translation={item.coreSentenceZh}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {!isLoading && items.length > 0 && (
        <div className="verbs-pagination-footer">{pagination}</div>
      )}
    </>
  )
}

function VerbDetailView({
  selectedVerbId,
  onOpenVerb,
  onBackToList,
}: Pick<VerbPageProps, 'selectedVerbId' | 'onOpenVerb' | 'onBackToList'>) {
  const [detail, setDetail] = useState<VerbDetail | null>(null)
  const [activePathId, setActivePathId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedVerbId) {
      return
    }

    const controller = new AbortController()

    async function fetchDetail() {
      setIsLoading(true)
      setError('')
      setDetail(null)
      setActivePathId('')

      try {
        const payload = await requestVerbDetail(selectedVerbId, controller.signal)
        setDetail(payload)
        setActivePathId(payload.paths[0]?.id ?? '')
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return
        }

        setError(fetchError instanceof Error ? fetchError.message : '动词详情暂时无法读取')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchDetail()

    return () => controller.abort()
  }, [selectedVerbId])

  const activePath = useMemo(
    () => detail?.paths.find((path) => path.id === activePathId) ?? detail?.paths[0],
    [activePathId, detail?.paths],
  )

  // Walk to the previous/next verb with the keyboard, mirroring the on-page arrows.
  useEffect(() => {
    if (!detail) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isEditable =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if (isEditable || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key === 'ArrowLeft' && detail?.prevId) {
        event.preventDefault()
        onOpenVerb(detail.prevId)
      } else if (event.key === 'ArrowRight' && detail?.nextId) {
        event.preventDefault()
        onOpenVerb(detail.nextId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [detail, onOpenVerb])

  if (isLoading || error || !detail) {
    return (
      <section className="panel verbs-status">
        <button
          type="button"
          className="verb-back-button"
          onClick={onBackToList}
          aria-label="返回动词列表"
        >
          ←
        </button>
        {isLoading && <p>正在读取动词详情…</p>}
        {!isLoading && error && <p>没有找到这个动词，或者详情暂时无法读取。</p>}
      </section>
    )
  }

  return (
    <>
      <section className="verb-detail-hero">
        <button
          type="button"
          className="verb-back-button"
          onClick={onBackToList}
          aria-label="返回动词列表"
        >
          ←
        </button>

        <div className="verb-detail-nav">
          {detail.position && detail.total && (
            <span className="verb-detail-position">
              {detail.verb.verb} · {detail.position}/{detail.total}
            </span>
          )}
          <button
            type="button"
            className="verbs-pager-btn"
            aria-label="上一词"
            disabled={!detail.prevId}
            onClick={() => detail.prevId && onOpenVerb(detail.prevId)}
          >
            ←
          </button>
          <button
            type="button"
            className="verbs-pager-btn"
            aria-label="下一词"
            disabled={!detail.nextId}
            onClick={() => detail.nextId && onOpenVerb(detail.nextId)}
          >
            →
          </button>
        </div>
      </section>

      {detail.paths.length > 0 && (
        <section className="verb-detail-layout">
          {activePath && (
            <article className="panel verb-animation-panel">
              {detail.paths.length > 1 && (
                <div className="verb-path-switcher" aria-label="学习路径">
                  {detail.paths.map((path) => (
                    <button
                      key={path.id}
                      type="button"
                      className={path.id === activePath.id ? 'active' : ''}
                      onClick={() => setActivePathId(path.id)}
                    >
                      <strong>{path.title}</strong>
                      <span>{getSceneLabel(path.scene)} · {path.meaningZh}</span>
                    </button>
                  ))}
                </div>
              )}

              <SentenceGrowthPlayer key={activePath.id} path={activePath} />
            </article>
          )}
        </section>
      )}

      {detail.paths.length === 0 && (
        <section className="panel verbs-status">
          这个动词还没有整理内容，后面会逐步补齐。
        </section>
      )}
    </>
  )
}

function VerbPage({ selectedVerbId, onOpenVerb, onBackToList }: VerbPageProps) {
  if (selectedVerbId) {
    return (
      <VerbDetailView
        selectedVerbId={selectedVerbId}
        onOpenVerb={onOpenVerb}
        onBackToList={onBackToList}
      />
    )
  }

  return <VerbList onOpenVerb={onOpenVerb} />
}

export default VerbPage
