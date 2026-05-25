import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import VocabularyAdmin from './admin/VocabularyAdmin'
import {
  difficultyLabels,
  formatLabels,
  resources,
  skillLabels,
  type Difficulty,
  type LearningResource,
  type Skill,
} from './data/resources'
import {
  vocabularyFrequencyBandLabels,
  type CoreVocabularyEntry,
  type VocabularyFrequencyBand,
  type VocabularyPronunciation,
} from './data/vocabulary'

type ViewId = 'roadmap' | 'vocabulary' | 'library' | 'admin'
type VocabularyFrequencyFilter = VocabularyFrequencyBand | 'all'

const ROADMAP_PROGRESS_KEY = 'english-orbit-roadmap-progress-v1'
const VOCABULARY_VISIBLE_LIMIT = 240
const CORE_VOCABULARY_TOTAL = 3000

const roadmapSegments = [
  {
    id: 'top-100',
    label: 'Top 100',
    start: 1,
    end: 100,
    title: 'Runtime basics',
    description: '先稳住最高频词，像语言系统的标准库。',
  },
  {
    id: 'top-500',
    label: 'Top 500',
    start: 101,
    end: 500,
    title: 'Common interface',
    description: '进入日常表达、阅读和听力里最常遇到的词。',
  },
  {
    id: 'top-1000',
    label: 'Top 1000',
    start: 501,
    end: 1000,
    title: 'Working set',
    description: '形成稳定工作集，能支撑大部分通用材料。',
  },
  {
    id: 'top-3000',
    label: 'Top 3000',
    start: 1001,
    end: 3000,
    title: 'Long range',
    description: '慢慢补齐长期词库，不需要按天追赶。',
  },
]

function getInitialView(): ViewId {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return 'admin'
  }

  return 'roadmap'
}

const vocabularyFrequencyOptions: Array<{
  value: VocabularyFrequencyFilter
  label: string
}> = [
  { value: 'top-100', label: vocabularyFrequencyBandLabels['top-100'] },
  { value: 'top-500', label: vocabularyFrequencyBandLabels['top-500'] },
  { value: 'top-1000', label: vocabularyFrequencyBandLabels['top-1000'] },
  { value: 'all', label: '全部 3000' },
]

interface VocabularyApiItem {
  id: string
  word: string
  meaning: string
  meaningZh: string
  definitionEn: string
  priority: number
  frequencyRank: number | null
  phoneticUs: string
  phoneticUk: string
  example?: string
  pronunciations?: VocabularyPronunciation[]
}

interface VocabularyApiResponse {
  items: VocabularyApiItem[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
}

const mapApiVocabularyItem = (item: VocabularyApiItem): CoreVocabularyEntry => ({
  id: item.id,
  word: item.word,
  meaning: item.meaning,
  priority: item.priority,
  frequencyRank: item.frequencyRank ?? undefined,
  phoneticUs: item.phoneticUs,
  phoneticUk: item.phoneticUk,
  example: item.example,
  skills: ['listening', 'speaking', 'reading', 'writing'],
  pronunciations: item.pronunciations ?? [],
})

function clampRoadmapProgress(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.min(CORE_VOCABULARY_TOTAL, Math.round(value)))
}

function loadRoadmapProgress() {
  if (typeof window === 'undefined') {
    return 0
  }

  return clampRoadmapProgress(Number(window.localStorage.getItem(ROADMAP_PROGRESS_KEY)))
}

function getRoadmapPercent(progress: number) {
  return Math.round((progress / CORE_VOCABULARY_TOTAL) * 100)
}

function getSegmentPercent(progress: number, segment: (typeof roadmapSegments)[number]) {
  const segmentSize = segment.end - segment.start + 1
  const completed = clampRoadmapProgress(progress) - segment.start + 1
  return Math.max(0, Math.min(100, Math.round((completed / segmentSize) * 100)))
}

function getSegmentStatus(progress: number, segment: (typeof roadmapSegments)[number]) {
  if (progress >= segment.end) {
    return 'Done'
  }

  if (progress >= segment.start) {
    return 'In progress'
  }

  return 'Queued'
}

function getVocabularyFilterForProgress(progress: number): VocabularyFrequencyFilter {
  if (progress < 100) {
    return 'top-100'
  }

  if (progress < 500) {
    return 'top-500'
  }

  if (progress < 1000) {
    return 'top-1000'
  }

  return 'all'
}

function getVocabularyRank(item: Pick<CoreVocabularyEntry, 'frequencyRank' | 'priority'>) {
  return item.frequencyRank ?? item.priority
}

function getPronunciationLabel(
  pronunciation: VocabularyPronunciation,
  index: number,
) {
  const normalizedId = pronunciation.id.toLowerCase()

  if (normalizedId.endsWith('-us') || normalizedId.includes('-us-')) {
    return 'US'
  }

  if (normalizedId.endsWith('-uk') || normalizedId.includes('-uk-')) {
    return 'UK'
  }

  return `读音 ${index + 1}`
}

function getPronunciationKey(
  item: Pick<CoreVocabularyEntry, 'id'>,
  pronunciation: Pick<VocabularyPronunciation, 'id'>,
) {
  return `${item.id}-${pronunciation.id}`
}

function App() {
  const [view, setView] = useState<ViewId>(getInitialView)
  const [roadmapProgress, setRoadmapProgress] = useState(loadRoadmapProgress)
  const [checkpointInput, setCheckpointInput] = useState(() =>
    String(loadRoadmapProgress()),
  )
  const [resourceSkill, setResourceSkill] = useState<Skill | 'all'>('all')
  const [resourceLevel, setResourceLevel] = useState<Difficulty | 'all'>('all')
  const [vocabularyFrequency, setVocabularyFrequency] =
    useState<VocabularyFrequencyFilter>('top-500')
  const [query, setQuery] = useState('')
  const [vocabularyQuery, setVocabularyQuery] = useState('')
  const [vocabularyOffset, setVocabularyOffset] = useState(0)
  const [apiVocabulary, setApiVocabulary] = useState<CoreVocabularyEntry[]>([])
  const [apiVocabularyTotal, setApiVocabularyTotal] = useState(0)
  const [isVocabularyLoading, setIsVocabularyLoading] = useState(false)
  const [vocabularyApiError, setVocabularyApiError] = useState('')
  const [activePronunciationKey, setActivePronunciationKey] = useState('')
  const [pronunciationPlaybackError, setPronunciationPlaybackError] = useState('')
  const pronunciationAudioRef = useRef<HTMLAudioElement | null>(null)

  const featuredResources = useMemo(
    () => resources.filter((resource) => resource.featured),
    [],
  )
  const filteredResources = useMemo(
    () =>
      resources.filter((resource) => {
        const matchesSkill = resourceSkill === 'all' || resource.skill === resourceSkill
        const matchesLevel =
          resourceLevel === 'all' || resource.difficulty === resourceLevel
        const normalizedQuery = query.trim().toLowerCase()
        const matchesQuery =
          normalizedQuery.length === 0 ||
          resource.title.toLowerCase().includes(normalizedQuery) ||
          resource.summary.toLowerCase().includes(normalizedQuery) ||
          resource.tags.some((tag) => tag.includes(normalizedQuery))

        return matchesSkill && matchesLevel && matchesQuery
      }),
    [query, resourceLevel, resourceSkill],
  )

  const visibleCoreVocabulary = apiVocabulary
  const vocabularyResultCount = apiVocabularyTotal
  const hiddenVocabularyCount = Math.max(
    0,
    vocabularyResultCount - vocabularyOffset - visibleCoreVocabulary.length,
  )
  const vocabularyTotalCount = Math.max(CORE_VOCABULARY_TOTAL, apiVocabularyTotal)
  const roadmapPercent = getRoadmapPercent(roadmapProgress)
  const nextWordNumber = Math.min(roadmapProgress + 1, CORE_VOCABULARY_TOTAL)
  const currentSegment =
    roadmapSegments.find((segment) => roadmapProgress < segment.end) ??
    roadmapSegments[roadmapSegments.length - 1]
  const shownVocabularyStart =
    visibleCoreVocabulary.length > 0 ? vocabularyOffset + 1 : 0
  const shownVocabularyEnd = vocabularyOffset + visibleCoreVocabulary.length

  useEffect(() => {
    window.localStorage.setItem(ROADMAP_PROGRESS_KEY, String(roadmapProgress))
  }, [roadmapProgress])

  useEffect(() => {
    return () => {
      pronunciationAudioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (view !== 'vocabulary') {
      return
    }

    const controller = new AbortController()

    async function fetchVocabulary() {
      setIsVocabularyLoading(true)
      setVocabularyApiError('')

      const params = new URLSearchParams({
        band: vocabularyFrequency === 'all' ? 'top-3000' : vocabularyFrequency,
        limit: String(VOCABULARY_VISIBLE_LIMIT),
        offset: String(vocabularyOffset),
      })

      const normalizedQuery = vocabularyQuery.trim()

      if (normalizedQuery) {
        params.set('q', normalizedQuery)
      }

      try {
        const response = await fetch(`/api/vocabulary?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Vocabulary API responded with ${response.status}`)
        }

        const payload = (await response.json()) as VocabularyApiResponse

        setApiVocabulary(payload.items.map(mapApiVocabularyItem))
        setApiVocabularyTotal(payload.pagination.total)
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setApiVocabulary([])
        setApiVocabularyTotal(0)
        setVocabularyApiError(
          error instanceof Error ? error.message : 'Vocabulary API unavailable',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsVocabularyLoading(false)
        }
      }
    }

    fetchVocabulary()

    return () => controller.abort()
  }, [view, vocabularyFrequency, vocabularyOffset, vocabularyQuery])

  function changeView(nextView: ViewId) {
    setView(nextView)

    if (typeof window === 'undefined') {
      return
    }

    if (nextView === 'admin') {
      window.history.pushState(null, '', '/admin')
      return
    }

    if (window.location.pathname.startsWith('/admin')) {
      window.history.pushState(null, '', '/')
    }
  }

  function updateRoadmapProgress(nextProgress: number) {
    const normalizedProgress = clampRoadmapProgress(nextProgress)
    setRoadmapProgress(normalizedProgress)
    setCheckpointInput(String(normalizedProgress))
  }

  function commitCheckpointInput() {
    updateRoadmapProgress(Number(checkpointInput))
  }

  function continueLearning() {
    const nextOffset = Math.max(0, Math.min(nextWordNumber - 1, CORE_VOCABULARY_TOTAL - 1))

    setVocabularyFrequency(getVocabularyFilterForProgress(roadmapProgress))
    setVocabularyQuery('')
    setVocabularyOffset(Math.max(0, nextOffset - 8))
    changeView('vocabulary')
  }

  function playPronunciation(
    item: CoreVocabularyEntry,
    pronunciation: VocabularyPronunciation,
  ) {
    const pronunciationKey = getPronunciationKey(item, pronunciation)
    const label = getPronunciationLabel(
      pronunciation,
      item.pronunciations?.findIndex((entry) => entry.id === pronunciation.id) ?? 0,
    )

    pronunciationAudioRef.current?.pause()
    pronunciationAudioRef.current = null
    setPronunciationPlaybackError('')
    setActivePronunciationKey(pronunciationKey)

    const audio = new Audio(pronunciation.audioUrl)
    pronunciationAudioRef.current = audio

    audio.addEventListener(
      'ended',
      () => {
        if (pronunciationAudioRef.current === audio) {
          setActivePronunciationKey('')
          pronunciationAudioRef.current = null
        }
      },
      { once: true },
    )

    audio.addEventListener(
      'error',
      () => {
        if (pronunciationAudioRef.current === audio) {
          setActivePronunciationKey('')
          pronunciationAudioRef.current = null
          setPronunciationPlaybackError(
            `${item.word} 的 ${label} 读音暂时无法播放，请稍后再试。`,
          )
        }
      },
      { once: true },
    )

    void audio.play().catch(() => {
      if (pronunciationAudioRef.current === audio) {
        setActivePronunciationKey('')
        pronunciationAudioRef.current = null
        setPronunciationPlaybackError(
          `${item.word} 的 ${label} 读音暂时无法播放，请检查浏览器播放权限。`,
        )
      }
    })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">EO</span>
          <div>
            <p>English Orbit</p>
            <strong>Developer English</strong>
          </div>
        </div>

        <nav aria-label="主导航">
          <button
            type="button"
            className={view === 'roadmap' ? 'active' : ''}
            onClick={() => changeView('roadmap')}
          >
            进度
          </button>
          <button
            type="button"
            className={view === 'library' ? 'active' : ''}
            onClick={() => changeView('library')}
          >
            资源库
          </button>
          <button
            type="button"
            className={view === 'vocabulary' ? 'active' : ''}
            onClick={() => changeView('vocabulary')}
          >
            核心词库
          </button>
          <button
            type="button"
            className={view === 'admin' ? 'active' : ''}
            onClick={() => changeView('admin')}
          >
            数据后台
          </button>
        </nav>

        <section className="sidebar-card">
          <span>Progress</span>
          <strong>{roadmapProgress} / 3000</strong>
          <p>按频率顺序，自由推进</p>
        </section>
      </aside>

      <main className="content">
        <header className="page-header">
          <div>
            <p>English Orbit</p>
            <h1>Core Vocabulary Roadmap</h1>
          </div>
          <div className="header-meta">
            <span>No streaks</span>
            <strong>No pressure</strong>
          </div>
        </header>

        {view === 'roadmap' && (
          <>
            <section className="hero-grid">
              <article className="panel overview-card roadmap-overview">
                <span>3000 Core Words</span>
                <h2>A quiet vocabulary system for developers.</h2>
                <p>
                  这不是每日任务，也不是打卡表。它更像一个长期维护的词汇仓库：
                  按出现频率推进，任何时候打开，都可以从上一次的位置继续。
                </p>
                <div className="progress-track" aria-label="3000 词总进度">
                  <span style={{ width: `${roadmapPercent}%` }} />
                </div>
                <footer>
                  <strong>{roadmapPercent}%</strong>
                  <small>
                    {roadmapProgress}/{CORE_VOCABULARY_TOTAL} reviewed
                  </small>
                </footer>
                <div className="roadmap-actions">
                  <button type="button" onClick={continueLearning}>
                    Continue from #{nextWordNumber}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={roadmapProgress === 0}
                    onClick={() => updateRoadmapProgress(0)}
                  >
                    Reset checkpoint
                  </button>
                </div>
              </article>

              <article className="panel checkpoint-card">
                <div className="section-heading">
                  <h2>Checkpoint</h2>
                  <span>local only</span>
                </div>
                <label>
                  当前已推进到
                  <input
                    type="number"
                    min={0}
                    max={CORE_VOCABULARY_TOTAL}
                    value={checkpointInput}
                    onBlur={commitCheckpointInput}
                    onChange={(event) => setCheckpointInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.currentTarget.blur()
                      }
                    }}
                  />
                </label>
                <p>
                  进度先保存在当前浏览器。没有账号、没有提醒、没有连续学习天数，
                  先把公共词库这条主线走稳。
                </p>
                <div className="checkpoint-meta">
                  <span>Next word</span>
                  <strong>#{nextWordNumber}</strong>
                </div>
              </article>
            </section>

            <section className="roadmap-section">
              <div className="section-heading">
                <h2>Roadmap</h2>
                <span>当前区间：{currentSegment.label}</span>
              </div>
              <div className="roadmap-grid">
                {roadmapSegments.map((segment) => (
                  <article key={segment.id} className="panel roadmap-card">
                    <div className="roadmap-card-head">
                      <span>{segment.label}</span>
                      <strong>{getSegmentStatus(roadmapProgress, segment)}</strong>
                    </div>
                    <h3>{segment.title}</h3>
                    <p>{segment.description}</p>
                    <div className="progress-track thin" aria-hidden="true">
                      <span
                        style={{ width: `${getSegmentPercent(roadmapProgress, segment)}%` }}
                      />
                    </div>
                    <small>
                      #{segment.start}–#{segment.end}
                    </small>
                  </article>
                ))}
              </div>
            </section>

            <section className="split-grid reference-grid">
              <article className="panel reference-card">
                <div className="section-heading">
                  <h2>Current focus</h2>
                  <span>{currentSegment.label}</span>
                </div>
                <p>
                  先把词汇当作底层数据来维护：词义、音标、读音、例句都稳定后，
                  再往动词、句子结构和程序员真实语境里扩展。
                </p>
              </article>

              <article className="panel reference-card">
                <div className="section-heading">
                  <h2>Reference shelf</h2>
                  <span>{featuredResources.length} 个精选资源</span>
                </div>
                <div className="compact-list">
                  {featuredResources.slice(0, 4).map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <strong>{resource.title}</strong>
                      <span>{skillLabels[resource.skill]}</span>
                    </a>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        {view === 'vocabulary' && (
          <>
            <section className="panel vocabulary-hero">
              <div>
                <span>Core 3000</span>
                <h2>按频率顺序维护一套自己的英语底层数据</h2>
                <p>
                  这里不要求“今天必须完成”。你可以搜索、听读音、看例句，
                  也可以把当前位置标记为 Roadmap 进度。
                </p>
              </div>
              <div className="vocabulary-stats">
                <strong>{vocabularyTotalCount}</strong>
                <span>core words</span>
              </div>
            </section>

            <section className="panel vocabulary-toolbar">
              <div className="section-heading">
                <h2>核心词库</h2>
                <span>
                  {shownVocabularyStart > 0
                    ? `${shownVocabularyStart}-${shownVocabularyEnd} / ${vocabularyResultCount}`
                    : `${vocabularyResultCount} 个匹配结果`}
                </span>
              </div>
              <div className="filters vocabulary-filters">
                <input
                  placeholder="搜索单词、中文释义或英文释义"
                  value={vocabularyQuery}
                  onChange={(event) => {
                    setVocabularyQuery(event.target.value)
                    setVocabularyOffset(0)
                  }}
                />
                <select
                  value={vocabularyFrequency}
                  onChange={(event) => {
                    setVocabularyFrequency(
                      event.target.value as VocabularyFrequencyFilter,
                    )
                    setVocabularyOffset(0)
                  }}
                >
                  {vocabularyFrequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {vocabularyOffset > 0 && (
                <div className="toolbar-note">
                  <span>已从 #{vocabularyOffset + 1} 附近继续。</span>
                  <button type="button" onClick={() => setVocabularyOffset(0)}>
                    回到开头
                  </button>
                </div>
              )}
            </section>

            {(isVocabularyLoading || vocabularyApiError) && (
              <section className="panel vocabulary-source-note">
                {isVocabularyLoading && '正在从数据库读取词库…'}
                {!isVocabularyLoading &&
                  vocabularyApiError &&
                  '数据库词库暂不可用，请稍后再试。'}
              </section>
            )}

            {pronunciationPlaybackError && (
              <section className="panel vocabulary-source-note" role="status">
                {pronunciationPlaybackError}
              </section>
            )}

            <section className="vocabulary-grid">
              {visibleCoreVocabulary.map((item) => {
                const rank = getVocabularyRank(item)
                const isInRoadmapProgress = rank <= roadmapProgress

                return (
                  <article key={item.id} className="panel vocabulary-card">
                    <header>
                      <div>
                        <span>#{String(rank).padStart(4, '0')}</span>
                        <h3>{item.word}</h3>
                      </div>
                    </header>
                    {(item.phoneticUs || item.phoneticUk) && (
                      <p className="vocabulary-phonetics">
                        {item.phoneticUs && <span>US {item.phoneticUs}</span>}
                        {item.phoneticUk && <span>UK {item.phoneticUk}</span>}
                      </p>
                    )}
                    <p className="vocabulary-meaning">{item.meaning}</p>
                    {item.pronunciations && item.pronunciations.length > 0 && (
                      <div
                        className="pronunciation-list"
                        aria-label={`${item.word} 读音`}
                      >
                        {item.pronunciations.map((pronunciation, index) => {
                          const label = getPronunciationLabel(pronunciation, index)

                          return (
                            <button
                              key={`${item.id}-${pronunciation.id}`}
                              type="button"
                              className={
                                activePronunciationKey ===
                                getPronunciationKey(item, pronunciation)
                                  ? 'playing'
                                  : ''
                              }
                              aria-label={`播放 ${item.word} ${label} 读音`}
                              title={`${item.word} ${label} 读音`}
                              onClick={() => playPronunciation(item, pronunciation)}
                            >
                              {activePronunciationKey ===
                              getPronunciationKey(item, pronunciation)
                                ? `${label} 播放中`
                                : label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {item.example && (
                      <p className="vocabulary-example">{item.example}</p>
                    )}
                    <footer>
                      <small>
                        {isInRoadmapProgress
                          ? 'Already inside your roadmap progress'
                          : `Mark progress through #${rank}`}
                      </small>
                      <button
                        type="button"
                        disabled={isInRoadmapProgress}
                        onClick={() => updateRoadmapProgress(rank)}
                      >
                        {isInRoadmapProgress ? '已在进度内' : '标记到这里'}
                      </button>
                    </footer>
                  </article>
                )
              })}
            </section>

            {hiddenVocabularyCount > 0 && (
              <section className="panel vocabulary-more-note">
                还有 {hiddenVocabularyCount} 个匹配词没有直接展开。可以继续搜索单词、中文释义或
                英文释义来缩小范围。
              </section>
            )}
          </>
        )}

        {view === 'library' && (
          <>
            <section className="panel library-toolbar">
              <div className="section-heading">
                <h2>资源库</h2>
                <span>作为参考资料，不作为任务清单</span>
              </div>
              <div className="filters">
                <input
                  placeholder="搜索资源、标签或用途"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <select
                  value={resourceSkill}
                  onChange={(event) =>
                    setResourceSkill(event.target.value as Skill | 'all')
                  }
                >
                  <option value="all">全部技能</option>
                  {Object.entries(skillLabels).map(([skill, label]) => (
                    <option key={skill} value={skill}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  value={resourceLevel}
                  onChange={(event) =>
                    setResourceLevel(event.target.value as Difficulty | 'all')
                  }
                >
                  <option value="all">全部难度</option>
                  {Object.entries(difficultyLabels).map(([level, label]) => (
                    <option key={level} value={level}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section className="resource-grid">
              {filteredResources.map((resource: LearningResource) => (
                <article key={resource.id} className="panel resource-card">
                  <div className="resource-meta">
                    <span>{skillLabels[resource.skill]}</span>
                    <span>{difficultyLabels[resource.difficulty]}</span>
                    <span>{formatLabels[resource.format]}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.summary}</p>
                  <footer>
                    <small>{resource.minutes} 分钟</small>
                    <a href={resource.url} target="_blank" rel="noreferrer">
                      打开资源
                    </a>
                  </footer>
                </article>
              ))}
            </section>
          </>
        )}

        {view === 'admin' && <VocabularyAdmin />}
      </main>
    </div>
  )
}

export default App
