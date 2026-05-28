import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
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

type ViewId =
  | 'roadmap'
  | 'strategy'
  | 'verbs'
  | 'examples'
  | 'vocabulary'
  | 'library'
  | 'admin'
type NavigationViewId = 'strategy' | 'verbs' | 'examples' | 'vocabulary'
type VocabularyFrequencyFilter = VocabularyFrequencyBand | 'all'

const ROADMAP_PROGRESS_KEY = 'english-orbit-roadmap-progress-v1'
const VOCABULARY_VISIBLE_LIMIT = 240
const CORE_VOCABULARY_TOTAL = 3000


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

const primaryNavigationItems: Array<{
  id: NavigationViewId
  label: string
}> = [
  { id: 'strategy', label: '学习策略' },
  { id: 'verbs', label: '动词' },
  { id: 'examples', label: '例句' },
  { id: 'vocabulary', label: '词汇' },
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
  const shownVocabularyStart =
    visibleCoreVocabulary.length > 0 ? vocabularyOffset + 1 : 0
  const shownVocabularyEnd = vocabularyOffset + visibleCoreVocabulary.length
  const pageHeading = {
    strategy: { eyebrow: 'Learning Strategy', title: '学习策略' },
    verbs: { eyebrow: 'Verb Patterns', title: '动词' },
    examples: { eyebrow: 'Sentence Examples', title: '例句' },
    vocabulary: { eyebrow: 'Core 3000', title: '核心词库' },
    library: { eyebrow: 'Reference Shelf', title: '资源库' },
    admin: { eyebrow: 'Content Admin', title: '数据后台' },
  }[view as Exclude<ViewId, 'roadmap'>]
  const placeholderPages: Partial<
    Record<
      ViewId,
      {
        title: string
        description: string
        note: string
      }
    >
  > = {
    strategy: {
      title: '先把学习路径放在这里',
      description:
        '后面会沉淀一套适合中文语境程序员的英语学习策略：先解决读文档、理解句子结构，再慢慢扩展表达能力。',
      note: '当前为占位入口，避免导航先空着。',
    },
    verbs: {
      title: '动词会成为第二个重点模块',
      description:
        '程序员读英文时，真正影响理解速度的往往不是名词，而是动词和动词短语。这里后续会整理 run、resolve、apply、handle 这类高频动作词。',
      note: '当前为占位入口，后续接动词模式数据。',
    },
    examples: {
      title: '例句会围绕真实阅读场景整理',
      description:
        '这里会优先展示短、准、可复用的英文句子，帮助把单词放回语境里，而不是孤立背词。',
      note: '第一版先保留入口，后续从公共例句数据中接入。',
    },
  }
  const placeholderPage = placeholderPages[view]

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
  }


  function submitVocabularySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setVocabularyOffset(0)
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
      <header className="site-header">
        <button
          type="button"
          className="site-brand"
          onClick={() => changeView('roadmap')}
          aria-label="返回 English Orbit 首页"
        >
          <img
            className="brand-icon"
            src="/brand/beaver-head-128.png"
            alt=""
            width="40"
            height="40"
            decoding="async"
          />
        </button>

        <nav className="site-nav" aria-label="主导航">
          {primaryNavigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? 'active' : ''}
              onClick={() => changeView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <form className="site-search" onSubmit={submitVocabularySearch}>
          <span aria-hidden="true">⌕</span>
          <input
            placeholder="搜索单词"
            value={vocabularyQuery}
            onChange={(event) => setVocabularyQuery(event.target.value)}
          />
        </form>
      </header>

      <main className={`content ${view === 'roadmap' ? 'landing-content' : ''}`}>
        {view !== 'roadmap' && pageHeading && (
          <header className="page-header">
            <div>
              <p>{pageHeading.eyebrow}</p>
              <h1>{pageHeading.title}</h1>
            </div>
            <div className="header-meta">
              <span>{roadmapProgress} / 3000</span>
              <strong>自由进度</strong>
            </div>
          </header>
        )}

        {view === 'roadmap' && (
          <>
            <section className="landing-hero" aria-label="English Orbit 首页搜索">
              <img
                className="beaver-mascot"
                src="/mascot/beaver-mascot.svg"
                alt="English Orbit Beaver mascot"
                width="960"
                height="720"
                decoding="async"
              />

              <form className="landing-command" onSubmit={submitVocabularySearch}>
                <span aria-hidden="true">$</span>
                <input
                  placeholder="搜索核心词汇，例如 process / system / cache"
                  value={vocabularyQuery}
                  onChange={(event) => setVocabularyQuery(event.target.value)}
                />
                <button type="submit">搜索</button>
              </form>
            </section>

            <section className="landing-modules" aria-label="能力模块">
              <article>
                <span>01</span>
                <h2>核心词汇</h2>
                <p>先把通用英语底座打稳，读文档、看资料都更顺。</p>
              </article>
              <article>
                <span>02</span>
                <h2>程序员英语</h2>
                <p>后续补齐 async、cache、latency、runtime 等技术高频词。</p>
              </article>
              <article>
                <span>03</span>
                <h2>句子结构</h2>
                <p>把英文句子拆成可复用 pattern，减少阅读和表达阻力。</p>
              </article>
            </section>
          </>
        )}

        {placeholderPage && (
          <section className="panel placeholder-panel">
            <span>{pageHeading?.eyebrow}</span>
            <h2>{placeholderPage.title}</h2>
            <p>{placeholderPage.description}</p>
            <small>{placeholderPage.note}</small>
          </section>
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
