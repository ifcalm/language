import { useEffect, useMemo, useState } from 'react'
import { requestVerbDetail, requestVerbList } from './api'
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
  const [onlyWithPaths, setOnlyWithPaths] = useState(false)
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<VerbListItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Reset to the first page whenever the result set changes.
  useEffect(() => {
    setOffset(0)
  }, [query, onlyWithPaths])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchVerbs() {
      setIsLoading(true)
      setError('')

      try {
        const payload = await requestVerbList(
          { query, offset, limit: VERB_PAGE_SIZE, hasPaths: onlyWithPaths },
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
  }, [query, offset, onlyWithPaths])

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
    <div className="vocabulary-pagination">
      <button
        type="button"
        className="pagination-step"
        disabled={offset === 0 || isLoading}
        onClick={() => goToOffset(offset - VERB_PAGE_SIZE)}
      >
        ← 上一批
      </button>
      <span className="pagination-range">
        {shownStart > 0 ? `${shownStart}–${shownEnd} / ${total}` : `0 / ${total}`}
      </span>
      <button
        type="button"
        className="pagination-step"
        disabled={shownEnd >= total || isLoading}
        onClick={() => goToOffset(offset + VERB_PAGE_SIZE)}
      >
        下一批 →
      </button>
    </div>
  )

  const showEmptyState = !isLoading && !error && items.length === 0

  return (
    <>
      <section className="panel verbs-hero">
        <div>
          <span>Verb Lab</span>
          <h2>从动词进入句子</h2>
          <p>
            先看一个动作，再看它如何带出场景、目的、时间和细节。技术场景优先，
            但不为了技术而硬套。
          </p>
        </div>
        <div className="verbs-hero-count">
          <strong>{total || 1383}</strong>
          <span>{onlyWithPaths ? '有路径' : 'verbs'}</span>
        </div>
      </section>

      <section className="panel verbs-toolbar">
        <div className="section-heading">
          <h2>动词列表</h2>
          <span>已有句子路径的动词会排在前面</span>
        </div>
        <input
          placeholder="搜索动词或中文义，例如 deploy / depend on / 返回"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="verbs-toolbar-controls">
          <label className="verbs-filter-toggle">
            <input
              type="checkbox"
              checked={onlyWithPaths}
              onChange={(event) => setOnlyWithPaths(event.target.checked)}
            />
            只看有句子路径的动词
          </label>
          {pagination}
        </div>
      </section>

      {error && (
        <section className="panel verbs-status">
          动词列表暂时无法读取，请稍后再试。
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
            : onlyWithPaths
              ? '还没有带句子路径的动词。'
              : '暂时没有可显示的动词。'}
        </section>
      )}

      {!isLoading && items.length > 0 && (
        <section className="panel verbs-list" aria-label="动词列表">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`verb-row${item.pathCount === 0 ? ' is-pending' : ''}`}
              onClick={() => onOpenVerb(item.id)}
            >
              <span className="verb-row-word">{item.verb}</span>
              <span className="verb-row-meaning">{item.meaningZh}</span>
              {item.isPhrase && <span className="verb-row-tag">短语</span>}
            </button>
          ))}
        </section>
      )}

      {!isLoading && items.length > 0 && (
        <section className="panel verbs-pagination-panel">{pagination}</section>
      )}
    </>
  )
}

function VerbDetailView({
  selectedVerbId,
  onBackToList,
}: Pick<VerbPageProps, 'selectedVerbId' | 'onBackToList'>) {
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
          这个动词还没有句子路径。后面补数据时会逐步补齐。
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
        onBackToList={onBackToList}
      />
    )
  }

  return <VerbList onOpenVerb={onOpenVerb} />
}

export default VerbPage
