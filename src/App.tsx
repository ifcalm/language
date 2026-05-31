import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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
  type VocabularyExample,
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
  examples?: VocabularyExample[]
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

interface VocabularyDetailCore extends VocabularyApiItem {
  normalizedWord: string
  lemma: string | null
}

interface VocabularyDetailResponse {
  core: VocabularyDetailCore
  pronunciations: VocabularyPronunciation[]
  examples: VocabularyExample[]
}

interface VocabularyDetail {
  core: CoreVocabularyEntry & {
    normalizedWord: string
    lemma: string | null
    meaningZh: string
    definitionEn: string
  }
  pronunciations: VocabularyPronunciation[]
  examples: VocabularyExample[]
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
  examples: item.examples ?? [],
  skills: ['listening', 'speaking', 'reading', 'writing'],
  pronunciations: item.pronunciations ?? [],
})

const mapVocabularyDetail = (
  payload: VocabularyDetailResponse,
): VocabularyDetail => {
  const examples = payload.examples ?? []
  const pronunciations = payload.pronunciations ?? []

  return {
    core: {
      id: payload.core.id,
      word: payload.core.word,
      normalizedWord: payload.core.normalizedWord,
      lemma: payload.core.lemma,
      meaning: payload.core.meaning,
      meaningZh: payload.core.meaningZh,
      definitionEn: payload.core.definitionEn,
      priority: payload.core.priority,
      frequencyRank: payload.core.frequencyRank ?? undefined,
      phoneticUs: payload.core.phoneticUs,
      phoneticUk: payload.core.phoneticUk,
      example: examples[0]?.sentenceEn,
      examples,
      pronunciations,
      skills: ['listening', 'speaking', 'reading', 'writing'],
    },
    pronunciations,
    examples,
  }
}

async function requestVocabularyDetail(
  lookup: string,
  signal: AbortSignal,
): Promise<VocabularyDetail> {
  const response = await fetch(`/api/vocabulary/${encodeURIComponent(lookup)}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Vocabulary detail API responded with ${response.status}`)
  }

  const payload = (await response.json()) as VocabularyDetailResponse
  return mapVocabularyDetail(payload)
}

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
  const [selectedVocabularyLookup, setSelectedVocabularyLookup] = useState('')
  const [selectedVocabularyDetail, setSelectedVocabularyDetail] =
    useState<VocabularyDetail | null>(null)
  const [isVocabularyDetailLoading, setIsVocabularyDetailLoading] = useState(false)
  const [vocabularyDetailError, setVocabularyDetailError] = useState('')
  const [lookupModalQuery, setLookupModalQuery] = useState('')
  const [lookupModalDetail, setLookupModalDetail] =
    useState<VocabularyDetail | null>(null)
  const [isLookupModalLoading, setIsLookupModalLoading] = useState(false)
  const [lookupModalError, setLookupModalError] = useState('')
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
  const selectedVocabularyRank = selectedVocabularyDetail
    ? getVocabularyRank(selectedVocabularyDetail.core)
    : 0
  const selectedVocabularyPrimaryExample = selectedVocabularyDetail?.examples[0]
  const selectedVocabularyIsInRoadmapProgress =
    selectedVocabularyRank > 0 && selectedVocabularyRank <= roadmapProgress
  const lookupModalRank = lookupModalDetail
    ? getVocabularyRank(lookupModalDetail.core)
    : 0
  const lookupModalPrimaryExample = lookupModalDetail?.examples[0]
  const lookupModalIsInRoadmapProgress =
    lookupModalRank > 0 && lookupModalRank <= roadmapProgress

  useEffect(() => {
    window.localStorage.setItem(ROADMAP_PROGRESS_KEY, String(roadmapProgress))
  }, [roadmapProgress])

  useEffect(() => {
    return () => {
      pronunciationAudioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (view !== 'vocabulary' || selectedVocabularyLookup) {
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
  }, [
    selectedVocabularyLookup,
    view,
    vocabularyFrequency,
    vocabularyOffset,
    vocabularyQuery,
  ])

  useEffect(() => {
    if (view !== 'vocabulary' || !selectedVocabularyLookup) {
      return
    }

    const controller = new AbortController()

    async function fetchVocabularyDetail() {
      setIsVocabularyDetailLoading(true)
      setVocabularyDetailError('')
      setSelectedVocabularyDetail(null)

      try {
        setSelectedVocabularyDetail(
          await requestVocabularyDetail(selectedVocabularyLookup, controller.signal),
        )
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setVocabularyDetailError(
          error instanceof Error ? error.message : 'Vocabulary detail unavailable',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsVocabularyDetailLoading(false)
        }
      }
    }

    fetchVocabularyDetail()

    return () => controller.abort()
  }, [selectedVocabularyLookup, view])

  useEffect(() => {
    if (!lookupModalQuery) {
      return
    }

    const controller = new AbortController()

    async function fetchLookupModalDetail() {
      setIsLookupModalLoading(true)
      setLookupModalError('')
      setLookupModalDetail(null)

      try {
        setLookupModalDetail(
          await requestVocabularyDetail(lookupModalQuery, controller.signal),
        )
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setLookupModalError(
          error instanceof Error ? error.message : 'Vocabulary lookup unavailable',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLookupModalLoading(false)
        }
      }
    }

    fetchLookupModalDetail()

    return () => controller.abort()
  }, [lookupModalQuery])

  useEffect(() => {
    if (!lookupModalQuery) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeLookupModal()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [lookupModalQuery])

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


  function openVocabularyDetail(lookup: string) {
    const normalizedLookup = lookup.trim()

    if (!normalizedLookup) {
      return
    }

    setVocabularyOffset(0)
    setSelectedVocabularyLookup(normalizedLookup)
    changeView('vocabulary')

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function closeVocabularyDetail() {
    setSelectedVocabularyLookup('')
    setSelectedVocabularyDetail(null)
    setVocabularyDetailError('')
  }

  function openLookupModal(lookup: string) {
    const normalizedLookup = lookup.trim()

    if (!normalizedLookup) {
      return
    }

    pronunciationAudioRef.current?.pause()
    pronunciationAudioRef.current = null
    setActivePronunciationKey('')
    setPronunciationPlaybackError('')
    setLookupModalQuery(normalizedLookup)
    setLookupModalDetail(null)
    setIsLookupModalLoading(false)
    setLookupModalError('')
  }

  function closeLookupModal() {
    pronunciationAudioRef.current?.pause()
    pronunciationAudioRef.current = null
    setActivePronunciationKey('')
    setLookupModalQuery('')
    setLookupModalDetail(null)
    setIsLookupModalLoading(false)
    setLookupModalError('')
  }

  function runVocabularySearch() {
    setVocabularyOffset(0)

    const normalizedQuery = vocabularyQuery.trim()

    if (normalizedQuery) {
      openLookupModal(normalizedQuery)
      return
    }

    setSelectedVocabularyLookup('')
    changeView('vocabulary')
  }

  function submitVocabularySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    runVocabularySearch()
  }

  function handleLandingSearchKeyDown(
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    runVocabularySearch()
  }

  function playPronunciation(
    item: Pick<CoreVocabularyEntry, 'id' | 'word' | 'pronunciations'>,
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
        <div className="site-header-inner">
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
                onClick={() => {
                  if (item.id === 'vocabulary') {
                    closeVocabularyDetail()
                  }

                  changeView(item.id)
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="site-auth-actions" aria-label="账户入口">
            <button type="button">登录</button>
            <span aria-hidden="true">/</span>
            <button type="button">注册</button>
          </div>
        </div>
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
              <p className="landing-tagline">
                让写代码的人，不再被英文挡在门外。
              </p>

              <form className="landing-command" onSubmit={submitVocabularySearch}>
                <span aria-hidden="true">$</span>
                <input
                  placeholder="搜索核心词汇，例如 process / system / data"
                  value={vocabularyQuery}
                  onChange={(event) => setVocabularyQuery(event.target.value)}
                  onKeyDown={handleLandingSearchKeyDown}
                />
                <button type="submit">搜索</button>
              </form>
            </section>

            <section className="landing-method" aria-label="学习路径">
              <div className="method-example" aria-label="学习路径示例句">
                <p className="method-poem">欲穷千里目 更上一层楼</p>
                <strong>The cache improves response time.</strong>
                <p>从一句开发者常见英文，拆成词、动词、例句和结构。</p>
              </div>

              <div className="landing-modules" aria-label="学习路径模块">
                <article>
                  <span>01</span>
                  <h3>词汇</h3>
                  <code>cache / improves / response / time</code>
                  <p>认识句子里的稳定词块。</p>
                </article>
                <article>
                  <span>02</span>
                  <h3>动词</h3>
                  <code>improves = 提高、改善</code>
                  <p>把动词当作函数，理解它带来的动作。</p>
                </article>
                <article>
                  <span>03</span>
                  <h3>例句</h3>
                  <code>The cache improves response time.</code>
                  <p>在完整句子里反复遇见核心表达。</p>
                </article>
                <article>
                  <span>04</span>
                  <h3>句子结构</h3>
                  <code>The cache / improves / response time</code>
                  <p>找到主干，再理解修饰和细节。</p>
                </article>
              </div>
            </section>

            <section className="landing-principles" aria-label="学习原则">
              <div className="principles-list">
                <article className="principle-item">
                  <span>01</span>
                  <div>
                    <h2>重复，不断重复</h2>
                    <p>语言不是一次记住的，而是在不同语境里反复遇见。</p>
                  </div>
                </article>
                <article className="principle-item">
                  <span>02</span>
                  <div>
                    <h2>阅读能力</h2>
                    <p>
                      解决开发者最常遇到的英文阅读场景：文档、文章、错误信息。
                    </p>
                  </div>
                </article>
                <article className="principle-item">
                  <span>03</span>
                  <div>
                    <h2>动词</h2>
                    <p>先找到动作，再看参数和修饰，句子的结构会变清楚。</p>
                  </div>
                </article>
                <article className="principle-item">
                  <span>04</span>
                  <div>
                    <h2>开发者视角</h2>
                    <p>
                      从开发者真实使用场景出发，围绕代码、文档和技术表达来设计学习内容。
                    </p>
                  </div>
                </article>
              </div>

              <figure className="principles-visual" aria-hidden="true">
                <img
                  className="principles-diagram"
                  src="/mascot/beaver-teacher-board.webp"
                  alt=""
                  width="824"
                  height="782"
                  decoding="async"
                />
              </figure>
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
            {selectedVocabularyLookup && (
              <>
                {(isVocabularyDetailLoading || vocabularyDetailError) && (
                  <section className="panel vocabulary-source-note">
                    {isVocabularyDetailLoading && '正在读取单词详情…'}
                    {!isVocabularyDetailLoading &&
                      vocabularyDetailError &&
                      '没有找到这个单词，或者详情暂时无法读取。'}
                    {!isVocabularyDetailLoading && vocabularyDetailError && (
                      <button
                        type="button"
                        className="vocabulary-detail-back"
                        onClick={closeVocabularyDetail}
                      >
                        返回词库
                      </button>
                    )}
                  </section>
                )}

                {pronunciationPlaybackError && (
                  <section className="panel vocabulary-source-note" role="status">
                    {pronunciationPlaybackError}
                  </section>
                )}

                {selectedVocabularyDetail && (
                  <>
                    <section className="panel vocabulary-detail-hero">
                      <button
                        type="button"
                        className="vocabulary-detail-back"
                        onClick={closeVocabularyDetail}
                      >
                        ← 返回词库
                      </button>

                      <div className="vocabulary-detail-heading">
                        <span>
                          #{String(selectedVocabularyRank).padStart(4, '0')}
                        </span>
                        <h2>{selectedVocabularyDetail.core.word}</h2>
                        <p>
                          {selectedVocabularyDetail.core.meaningZh ||
                            selectedVocabularyDetail.core.meaning}
                        </p>
                      </div>

                      {selectedVocabularyDetail.core.definitionEn && (
                        <p className="vocabulary-detail-definition">
                          {selectedVocabularyDetail.core.definitionEn}
                        </p>
                      )}

                      {(selectedVocabularyDetail.core.phoneticUs ||
                        selectedVocabularyDetail.core.phoneticUk) && (
                        <p className="vocabulary-phonetics">
                          {selectedVocabularyDetail.core.phoneticUs && (
                            <span>US {selectedVocabularyDetail.core.phoneticUs}</span>
                          )}
                          {selectedVocabularyDetail.core.phoneticUk && (
                            <span>UK {selectedVocabularyDetail.core.phoneticUk}</span>
                          )}
                        </p>
                      )}

                      {selectedVocabularyDetail.pronunciations.length > 0 && (
                        <div
                          className="pronunciation-list"
                          aria-label={`${selectedVocabularyDetail.core.word} 读音`}
                        >
                          {selectedVocabularyDetail.pronunciations.map(
                            (pronunciation, index) => {
                              const label = getPronunciationLabel(
                                pronunciation,
                                index,
                              )

                              return (
                                <button
                                  key={`${selectedVocabularyDetail.core.id}-${pronunciation.id}`}
                                  type="button"
                                  className={
                                    activePronunciationKey ===
                                    getPronunciationKey(
                                      selectedVocabularyDetail.core,
                                      pronunciation,
                                    )
                                      ? 'playing'
                                      : ''
                                  }
                                  aria-label={`播放 ${selectedVocabularyDetail.core.word} ${label} 读音`}
                                  title={`${selectedVocabularyDetail.core.word} ${label} 读音`}
                                  onClick={() =>
                                    playPronunciation(
                                      selectedVocabularyDetail.core,
                                      pronunciation,
                                    )
                                  }
                                >
                                  {activePronunciationKey ===
                                  getPronunciationKey(
                                    selectedVocabularyDetail.core,
                                    pronunciation,
                                  )
                                    ? `${label} 播放中`
                                    : label}
                                </button>
                              )
                            },
                          )}
                        </div>
                      )}
                    </section>

                    <section className="vocabulary-detail-layout">
                      <article className="panel vocabulary-detail-main">
                        <span>How to read it</span>
                        <h2>阅读提示</h2>
                        <p>
                          看到 <strong>{selectedVocabularyDetail.core.word}</strong>{' '}
                          时，不要只背中文义。看它附近的动词和对象，再把它放回完整句子里理解。
                        </p>

                        {selectedVocabularyPrimaryExample && (
                          <div className="vocabulary-detail-example">
                            <h3>精选例句</h3>
                            <p>{selectedVocabularyPrimaryExample.sentenceEn}</p>
                            {selectedVocabularyPrimaryExample.sentenceZh && (
                              <small>
                                {selectedVocabularyPrimaryExample.sentenceZh}
                              </small>
                            )}
                          </div>
                        )}
                      </article>

                      <aside className="panel vocabulary-detail-side">
                        <h2>快速信息</h2>
                        <dl>
                          <div>
                            <dt>频率排序</dt>
                            <dd>#{selectedVocabularyRank}</dd>
                          </div>
                          {selectedVocabularyDetail.core.lemma && (
                            <div>
                              <dt>词元</dt>
                              <dd>{selectedVocabularyDetail.core.lemma}</dd>
                            </div>
                          )}
                          <div>
                            <dt>例句数量</dt>
                            <dd>{selectedVocabularyDetail.examples.length}</dd>
                          </div>
                        </dl>

                        <div className="vocabulary-detail-actions">
                          <button
                            type="button"
                            disabled={selectedVocabularyIsInRoadmapProgress}
                            onClick={() =>
                              updateRoadmapProgress(selectedVocabularyRank)
                            }
                          >
                            {selectedVocabularyIsInRoadmapProgress
                              ? '已在进度内'
                              : `标记到 #${selectedVocabularyRank}`}
                          </button>
                        </div>
                      </aside>
                    </section>

                    {selectedVocabularyDetail.examples.length > 1 && (
                      <section className="panel vocabulary-detail-examples">
                        <div className="section-heading">
                          <h2>更多例句</h2>
                          <span>{selectedVocabularyDetail.examples.length} 条</span>
                        </div>
                        {selectedVocabularyDetail.examples.slice(1).map((example) => (
                          <article key={example.id}>
                            <p>{example.sentenceEn}</p>
                            {example.sentenceZh && <small>{example.sentenceZh}</small>}
                          </article>
                        ))}
                      </section>
                    )}
                  </>
                )}
              </>
            )}

            {!selectedVocabularyLookup && (
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
                      <div className="vocabulary-card-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => openVocabularyDetail(item.id)}
                        >
                          查看详情
                        </button>
                        <button
                          type="button"
                          disabled={isInRoadmapProgress}
                          onClick={() => updateRoadmapProgress(rank)}
                        >
                          {isInRoadmapProgress ? '已在进度内' : '标记到这里'}
                        </button>
                      </div>
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

      {lookupModalQuery && (
        <div
          className="lookup-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLookupModal()
            }
          }}
        >
          <section
            className="panel lookup-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lookup-modal-title"
          >
            <button
              type="button"
              className="lookup-modal-close"
              aria-label="关闭查词卡片"
              onClick={closeLookupModal}
            >
              ×
            </button>

            {isLookupModalLoading && (
              <p className="lookup-modal-status">正在查询 {lookupModalQuery}…</p>
            )}

            {!isLookupModalLoading && lookupModalError && (
              <div className="lookup-modal-empty">
                <span>暂未收录</span>
                <h2 id="lookup-modal-title">{lookupModalQuery}</h2>
                <p>可以换一个核心词试试，例如 process / system / data。</p>
              </div>
            )}

            {!isLookupModalLoading && lookupModalDetail && (
              <>
                <header className="lookup-modal-header">
                  <span>#{String(lookupModalRank).padStart(4, '0')}</span>
                  <h2 id="lookup-modal-title">{lookupModalDetail.core.word}</h2>
                  <p>
                    {lookupModalDetail.core.meaningZh || lookupModalDetail.core.meaning}
                  </p>
                </header>

                {lookupModalDetail.core.definitionEn && (
                  <p className="lookup-modal-definition">
                    {lookupModalDetail.core.definitionEn}
                  </p>
                )}

                {(lookupModalDetail.core.phoneticUs ||
                  lookupModalDetail.core.phoneticUk) && (
                  <p className="vocabulary-phonetics">
                    {lookupModalDetail.core.phoneticUs && (
                      <span>US {lookupModalDetail.core.phoneticUs}</span>
                    )}
                    {lookupModalDetail.core.phoneticUk && (
                      <span>UK {lookupModalDetail.core.phoneticUk}</span>
                    )}
                  </p>
                )}

                {lookupModalDetail.pronunciations.length > 0 && (
                  <div
                    className="pronunciation-list"
                    aria-label={`${lookupModalDetail.core.word} 读音`}
                  >
                    {lookupModalDetail.pronunciations.map((pronunciation, index) => {
                      const label = getPronunciationLabel(pronunciation, index)

                      return (
                        <button
                          key={`${lookupModalDetail.core.id}-${pronunciation.id}`}
                          type="button"
                          className={
                            activePronunciationKey ===
                            getPronunciationKey(lookupModalDetail.core, pronunciation)
                              ? 'playing'
                              : ''
                          }
                          aria-label={`播放 ${lookupModalDetail.core.word} ${label} 读音`}
                          title={`${lookupModalDetail.core.word} ${label} 读音`}
                          onClick={() =>
                            playPronunciation(lookupModalDetail.core, pronunciation)
                          }
                        >
                          {activePronunciationKey ===
                          getPronunciationKey(lookupModalDetail.core, pronunciation)
                            ? `${label} 播放中`
                            : label}
                        </button>
                      )
                    })}
                  </div>
                )}

                {lookupModalPrimaryExample && (
                  <div className="lookup-modal-example">
                    <span>Example</span>
                    <p>{lookupModalPrimaryExample.sentenceEn}</p>
                    {lookupModalPrimaryExample.sentenceZh && (
                      <small>{lookupModalPrimaryExample.sentenceZh}</small>
                    )}
                  </div>
                )}

                <footer className="lookup-modal-actions">
                  <button
                    type="button"
                    disabled={lookupModalIsInRoadmapProgress}
                    onClick={() => updateRoadmapProgress(lookupModalRank)}
                  >
                    {lookupModalIsInRoadmapProgress
                      ? '已在进度内'
                      : `标记到 #${lookupModalRank}`}
                  </button>
                  <button type="button" className="secondary-button" onClick={closeLookupModal}>
                    关闭
                  </button>
                </footer>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default App
