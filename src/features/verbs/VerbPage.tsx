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

function VerbList({ onOpenVerb }: Pick<VerbPageProps, 'onOpenVerb'>) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<VerbListItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchVerbs() {
      setIsLoading(true)
      setError('')

      try {
        const payload = await requestVerbList(query, controller.signal)
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
  }, [query])

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
          <span>verbs</span>
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
      </section>

      {(isLoading || error) && (
        <section className="panel verbs-status">
          {isLoading && '正在读取动词列表…'}
          {!isLoading && error && '动词列表暂时无法读取，请稍后再试。'}
        </section>
      )}

      <section className="verbs-list" aria-label="动词列表">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="verb-row"
            onClick={() => onOpenVerb(item.id)}
          >
            <span className="verb-row-main">
              <strong>{item.verb}</strong>
              <small>{item.meaningZh}</small>
            </span>
            <span className="verb-row-meta">
              {item.isPhrase && <em>短语</em>}
              <em className={item.pathCount > 0 ? 'ready' : ''}>
                {item.pathCount > 0 ? `${item.pathCount} 条路径` : '待补充'}
              </em>
            </span>
          </button>
        ))}
      </section>
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
