import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import './App.css'
import {
  getPathFromView,
  getVerbLookupFromPath,
  getViewFromPath,
  isAuthView,
  type ViewId,
} from './app/routing'
import VocabularyAdmin from './admin/VocabularyAdmin'
import SiteHeader, { type SiteHeaderUser } from './components/SiteHeader'
import AuthPage from './features/auth/AuthPage'
import VerbPage from './features/verbs/VerbPage'
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
  type CoreVocabularyEntry,
  type VocabularyExample,
  type VocabularyPronunciation,
} from './data/vocabulary'

const ROADMAP_PROGRESS_KEY = 'english-orbit-roadmap-progress-v1'
const VOCABULARY_PAGE_SIZE = 120
// Fallback until the real corpus size arrives from /api/vocabulary?band=all.
const CORE_VOCABULARY_TOTAL = 5536

function getInitialVerbLookup() {
  if (typeof window === 'undefined') {
    return ''
  }

  return getVerbLookupFromPath(window.location.pathname)
}

function getInitialView(): ViewId {
  if (typeof window === 'undefined') {
    return 'roadmap'
  }

  return getViewFromPath(window.location.pathname)
}

function getInitialVocabularyOffset() {
  if (typeof window === 'undefined') {
    return 0
  }

  const fromParam = Number(
    new URLSearchParams(window.location.search).get('from'),
  )

  if (!Number.isFinite(fromParam) || fromParam <= 0) {
    return 0
  }

  return Math.floor(fromParam / VOCABULARY_PAGE_SIZE) * VOCABULARY_PAGE_SIZE
}

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
  filters?: {
    band: string
    query: string
    maxRank?: number
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

interface AuthUser extends SiteHeaderUser {
  id: string
  role: string
}

interface AuthMeResponse {
  user: AuthUser | null
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

function getPrimaryPronunciation(item: {
  pronunciations?: VocabularyPronunciation[]
}) {
  const pronunciations = item.pronunciations ?? []

  return (
    pronunciations.find((pronunciation) => {
      const normalizedId = pronunciation.id.toLowerCase()
      return normalizedId.endsWith('-us') || normalizedId.includes('-us-')
    }) ??
    pronunciations[0] ??
    null
  )
}


function App() {
  const [view, setView] = useState<ViewId>(getInitialView)
  const [roadmapProgress, setRoadmapProgress] = useState(loadRoadmapProgress)
  const [resourceSkill, setResourceSkill] = useState<Skill | 'all'>('all')
  const [resourceLevel, setResourceLevel] = useState<Difficulty | 'all'>('all')
  const [query, setQuery] = useState('')
  const [vocabularyQuery, setVocabularyQuery] = useState('')
  const [vocabularyOffset, setVocabularyOffset] = useState(
    getInitialVocabularyOffset,
  )
  const [focusedVocabularyIndex, setFocusedVocabularyIndex] = useState(0)
  const [apiVocabulary, setApiVocabulary] = useState<CoreVocabularyEntry[]>([])
  const [apiVocabularyTotal, setApiVocabularyTotal] = useState(0)
  const [coreVocabularyTotal, setCoreVocabularyTotal] = useState(
    CORE_VOCABULARY_TOTAL,
  )
  const [isVocabularyLoading, setIsVocabularyLoading] = useState(false)
  const [vocabularyApiError, setVocabularyApiError] = useState('')
  const [selectedVocabularyLookup, setSelectedVocabularyLookup] = useState('')
  const [selectedVocabularyDetail, setSelectedVocabularyDetail] =
    useState<VocabularyDetail | null>(null)
  const [isVocabularyDetailLoading, setIsVocabularyDetailLoading] = useState(false)
  const [vocabularyDetailError, setVocabularyDetailError] = useState('')
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupDetail, setLookupDetail] =
    useState<VocabularyDetail | null>(null)
  const [isLookupLoading, setIsLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [selectedVerbLookup, setSelectedVerbLookup] = useState(getInitialVerbLookup)
  const [activePronunciationKey, setActivePronunciationKey] = useState('')
  const [pronunciationPlaybackError, setPronunciationPlaybackError] = useState('')
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const pronunciationAudioRef = useRef<HTMLAudioElement | null>(null)
  const vocabularySearchInputRef = useRef<HTMLInputElement | null>(null)
  const vocabularyToolbarRef = useRef<HTMLElement | null>(null)
  // Mouse-driven focus must not trigger scrollIntoView, or hovering rows at
  // the viewport edge makes the page jump.
  const vocabularyFocusSourceRef = useRef<'keyboard' | 'mouse'>('keyboard')

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
  const shownVocabularyStart =
    visibleCoreVocabulary.length > 0 ? vocabularyOffset + 1 : 0
  const shownVocabularyEnd = vocabularyOffset + visibleCoreVocabulary.length
  const pageHeadings: Partial<
    Record<
      ViewId,
      {
        eyebrow: string
        title: string
      }
    >
  > = {
    strategy: { eyebrow: 'Learning Strategy', title: '学习策略' },
    examples: { eyebrow: 'Sentence Examples', title: '例句' },
    library: { eyebrow: 'Reference Shelf', title: '资源库' },
    admin: { eyebrow: 'Content Admin', title: '数据后台' },
  }
  const pageHeading = pageHeadings[view]
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
    examples: {
      title: '例句会围绕真实阅读场景整理',
      description:
        '这里会优先展示短、准、可复用的英文句子，帮助把单词放回语境里，而不是孤立背词。',
      note: '第一版先保留入口，后续从公共例句数据中接入。',
    },
  }
  const placeholderPage = placeholderPages[view]
  const vocabularyPagination = (
    <div className="vocabulary-pagination">
      <button
        type="button"
        className="pagination-step"
        disabled={vocabularyOffset === 0}
        onClick={() => goToVocabularyOffset(vocabularyOffset - VOCABULARY_PAGE_SIZE)}
      >
        ← 上一批
      </button>
      <span className="pagination-range">
        {shownVocabularyStart > 0
          ? `${shownVocabularyStart}–${shownVocabularyEnd} / ${vocabularyResultCount}`
          : `0 / ${vocabularyResultCount}`}
      </span>
      <button
        type="button"
        className="pagination-step"
        disabled={shownVocabularyEnd >= vocabularyResultCount}
        onClick={() => goToVocabularyOffset(vocabularyOffset + VOCABULARY_PAGE_SIZE)}
      >
        下一批 →
      </button>
      {roadmapProgress > 0 && (
        <button
          type="button"
          className="pagination-progress"
          onClick={jumpToRoadmapProgress}
        >
          回到我的进度 #{roadmapProgress}
        </button>
      )}
    </div>
  )
  const isAuthPage = isAuthView(view)
  const selectedVocabularyRank = selectedVocabularyDetail
    ? getVocabularyRank(selectedVocabularyDetail.core)
    : 0
  const selectedVocabularyPrimaryExample = selectedVocabularyDetail?.examples[0]
  const selectedVocabularyIsInRoadmapProgress =
    selectedVocabularyRank > 0 && selectedVocabularyRank <= roadmapProgress
  const lookupPrimaryExample = lookupDetail?.examples[0]

  useEffect(() => {
    window.localStorage.setItem(ROADMAP_PROGRESS_KEY, String(roadmapProgress))
  }, [roadmapProgress])

  useEffect(() => {
    if (typeof window === 'undefined' || view !== 'vocabulary') {
      return
    }

    const url = new URL(window.location.href)

    if (vocabularyOffset > 0) {
      url.searchParams.set('from', String(vocabularyOffset))
    } else {
      url.searchParams.delete('from')
    }

    window.history.replaceState(null, '', url)
  }, [view, vocabularyOffset])

  useEffect(() => {
    if (view !== 'vocabulary' || vocabularyFocusSourceRef.current !== 'keyboard') {
      return
    }

    document
      .querySelector('.vocabulary-row.is-focused')
      ?.scrollIntoView({ block: 'nearest' })
  }, [view, focusedVocabularyIndex])

  useEffect(() => {
    if (view !== 'vocabulary' || selectedVocabularyLookup) {
      return
    }

    function handleVocabularyKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isEditableTarget =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)

      if (event.key === '/' && !isEditableTarget) {
        event.preventDefault()
        vocabularySearchInputRef.current?.focus()
        return
      }

      if (isEditableTarget || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (visibleCoreVocabulary.length === 0) {
        return
      }

      const maxIndex = visibleCoreVocabulary.length - 1
      const currentIndex = Math.min(focusedVocabularyIndex, maxIndex)
      const currentItem = visibleCoreVocabulary[currentIndex]

      switch (event.key) {
        case 'j':
        case 'ArrowDown':
          event.preventDefault()
          vocabularyFocusSourceRef.current = 'keyboard'
          setFocusedVocabularyIndex(Math.min(currentIndex + 1, maxIndex))
          break
        case 'k':
        case 'ArrowUp':
          event.preventDefault()
          vocabularyFocusSourceRef.current = 'keyboard'
          setFocusedVocabularyIndex(Math.max(currentIndex - 1, 0))
          break
        case 'Enter':
          event.preventDefault()
          openVocabularyDetail(currentItem.id)
          break
        case 'p': {
          const pronunciation = getPrimaryPronunciation(currentItem)

          if (pronunciation) {
            playPronunciation(currentItem, pronunciation)
          }

          break
        }
        case 'm':
          updateRoadmapProgress(getVocabularyRank(currentItem))
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleVocabularyKeyDown)
    return () => window.removeEventListener('keydown', handleVocabularyKeyDown)
  }, [
    view,
    selectedVocabularyLookup,
    visibleCoreVocabulary,
    focusedVocabularyIndex,
  ])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchCoreVocabularyTotal() {
      try {
        const response = await fetch('/api/vocabulary?band=all&limit=1', {
          signal: controller.signal,
        })

        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as VocabularyApiResponse
        const total = payload.pagination?.total ?? 0

        // Older workers fall back to top-500 for unknown bands; only trust
        // the count when the API confirms it answered for the full corpus.
        if (total > 0 && payload.filters?.band === 'all') {
          setCoreVocabularyTotal(total)
        }
      } catch {
        // Keep the fallback total when the request fails.
      }
    }

    fetchCoreVocabularyTotal()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAuthUser() {
      setIsAuthLoading(true)

      try {
        const response = await fetch('/api/auth/me', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Auth API responded with ${response.status}`)
        }

        const payload = (await response.json()) as AuthMeResponse
        setAuthUser(payload.user)
      } catch {
        if (!controller.signal.aborted) {
          setAuthUser(null)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsAuthLoading(false)
        }
      }
    }

    fetchAuthUser()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    return () => {
      pronunciationAudioRef.current?.pause()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    function handlePopState() {
      setView(getViewFromPath(window.location.pathname))
      setSelectedVerbLookup(getVerbLookupFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
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
        band: 'all',
        limit: String(VOCABULARY_PAGE_SIZE),
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
    if (!lookupQuery) {
      return
    }

    const controller = new AbortController()

    async function fetchLookupDetail() {
      setIsLookupLoading(true)
      setLookupError('')
      setLookupDetail(null)

      try {
        setLookupDetail(
          await requestVocabularyDetail(lookupQuery, controller.signal),
        )
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setLookupError(
          error instanceof Error ? error.message : 'Vocabulary lookup unavailable',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLookupLoading(false)
        }
      }
    }

    fetchLookupDetail()

    return () => controller.abort()
  }, [lookupQuery])

  useEffect(() => {
    if (!lookupQuery) {
      return
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeLookupResult()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [lookupQuery])

  function changeView(nextView: ViewId) {
    setView(nextView)
    setSelectedVerbLookup('')

    if (typeof window === 'undefined') {
      return
    }

    const nextPath = getPathFromView(nextView)

    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath)
    }
  }

  function updateRoadmapProgress(nextProgress: number) {
    const normalizedProgress = clampRoadmapProgress(nextProgress)
    setRoadmapProgress(normalizedProgress)
  }

  function scrollToVocabularyToolbar() {
    vocabularyToolbarRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function goToVocabularyOffset(nextOffset: number) {
    const lastPageOffset =
      Math.floor(Math.max(vocabularyResultCount - 1, 0) / VOCABULARY_PAGE_SIZE) *
      VOCABULARY_PAGE_SIZE
    setVocabularyOffset(Math.max(0, Math.min(nextOffset, lastPageOffset)))
    setFocusedVocabularyIndex(0)
    scrollToVocabularyToolbar()
  }

  async function jumpToRoadmapProgress() {
    if (roadmapProgress <= 0) {
      return
    }

    // Ranks have gaps, so rank N is usually not the Nth row. Ask the API how
    // many words sit at or below the progress rank; fall back to treating the
    // rank as a position when the deployed worker does not know maxRank yet.
    let position = roadmapProgress

    try {
      const response = await fetch(
        `/api/vocabulary?band=all&limit=1&maxRank=${roadmapProgress}`,
      )

      if (response.ok) {
        const payload = (await response.json()) as VocabularyApiResponse

        if (
          typeof payload.filters?.maxRank === 'number' &&
          payload.pagination.total > 0
        ) {
          position = payload.pagination.total
        }
      }
    } catch {
      // Keep the rank-as-position fallback.
    }

    setVocabularyQuery('')
    setVocabularyOffset(
      Math.floor((position - 1) / VOCABULARY_PAGE_SIZE) * VOCABULARY_PAGE_SIZE,
    )
    vocabularyFocusSourceRef.current = 'keyboard'
    setFocusedVocabularyIndex((position - 1) % VOCABULARY_PAGE_SIZE)
    scrollToVocabularyToolbar()
  }

  function openVocabularyDetail(lookup: string) {
    const normalizedLookup = lookup.trim()

    if (!normalizedLookup) {
      return
    }

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

  function openVerbDetail(lookup: string) {
    const normalizedLookup = lookup.trim()

    if (!normalizedLookup) {
      return
    }

    setSelectedVerbLookup(normalizedLookup)
    setView('verbs')

    if (typeof window !== 'undefined') {
      const nextPath = `/verbs/${encodeURIComponent(normalizedLookup)}`

      if (window.location.pathname !== nextPath) {
        window.history.pushState(null, '', nextPath)
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function closeVerbDetail() {
    setSelectedVerbLookup('')
    setView('verbs')

    if (typeof window !== 'undefined' && window.location.pathname !== '/verbs') {
      window.history.pushState(null, '', '/verbs')
    }
  }

  function openLookupResult(lookup: string) {
    const normalizedLookup = lookup.trim()

    if (!normalizedLookup) {
      return
    }

    pronunciationAudioRef.current?.pause()
    pronunciationAudioRef.current = null
    setActivePronunciationKey('')
    setPronunciationPlaybackError('')
    setLookupQuery(normalizedLookup)
    setLookupDetail(null)
    setIsLookupLoading(false)
    setLookupError('')
  }

  function closeLookupResult() {
    pronunciationAudioRef.current?.pause()
    pronunciationAudioRef.current = null
    setActivePronunciationKey('')
    setLookupQuery('')
    setLookupDetail(null)
    setIsLookupLoading(false)
    setLookupError('')
  }

  function runVocabularySearch() {
    setVocabularyOffset(0)

    const normalizedQuery = vocabularyQuery.trim()

    if (normalizedQuery) {
      openLookupResult(normalizedQuery)
      return
    }

    setSelectedVocabularyLookup('')
    changeView('vocabulary')
  }

  function submitVocabularySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    runVocabularySearch()
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setAuthUser(null)
      changeView('roadmap')
    }
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
      {!isAuthPage && (
        <SiteHeader
          view={view}
          user={authUser}
          isAuthLoading={isAuthLoading}
          onChangeView={changeView}
          onOpenVocabulary={closeVocabularyDetail}
          onLogout={logout}
        />
      )}

      <main
        className={`content ${view === 'roadmap' ? 'landing-content' : ''} ${
          view === 'verbs' ? 'verb-content' : ''
        } ${
          isAuthPage ? 'auth-content' : ''
        }`}
      >
        {view !== 'roadmap' && pageHeading && (
          <header className="page-header">
            <div>
              <p>{pageHeading.eyebrow}</p>
              <h1>{pageHeading.title}</h1>
            </div>
            <div className="header-meta">
              <span>{roadmapProgress} / {coreVocabularyTotal}</span>
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

              <div className="landing-lookup">
                <form className="landing-command" onSubmit={submitVocabularySearch}>
                  <span aria-hidden="true">$</span>
                  <input
                    placeholder="搜索核心词汇，例如 process / system / data"
                    value={vocabularyQuery}
                    onChange={(event) => {
                      setVocabularyQuery(event.target.value)

                      if (!event.target.value.trim()) {
                        closeLookupResult()
                      }
                    }}
                    onKeyDown={handleLandingSearchKeyDown}
                  />
                  <button type="submit">搜索</button>
                </form>

                {lookupQuery && (
                  <section
                    className="lookup-result"
                    aria-label="查词结果"
                    aria-live="polite"
                  >
                    <button
                      type="button"
                      className="lookup-result-close"
                      aria-label="关闭查词结果"
                      onClick={closeLookupResult}
                    >
                      ×
                    </button>

                    {isLookupLoading && (
                      <p className="lookup-result-status">
                        正在查询 {lookupQuery}…
                      </p>
                    )}

                    {!isLookupLoading && lookupError && (
                      <div className="lookup-result-empty">
                        <span>暂未收录</span>
                        <strong>{lookupQuery}</strong>
                        <p>
                          可以换一个核心词试试，例如 process / system / data。
                        </p>
                      </div>
                    )}

                    {!isLookupLoading && lookupDetail && (
                      <>
                        <header className="lookup-result-header">
                          <span>Lookup</span>
                          <div>
                            <h2>{lookupDetail.core.word}</h2>
                            <p>
                              {lookupDetail.core.meaningZh ||
                                lookupDetail.core.meaning}
                            </p>
                          </div>
                        </header>

                        {(lookupDetail.core.phoneticUs ||
                          lookupDetail.core.phoneticUk) && (
                          <p className="vocabulary-phonetics">
                            {lookupDetail.core.phoneticUs && (
                              <span>US {lookupDetail.core.phoneticUs}</span>
                            )}
                            {lookupDetail.core.phoneticUk && (
                              <span>UK {lookupDetail.core.phoneticUk}</span>
                            )}
                          </p>
                        )}

                        {lookupDetail.pronunciations.length > 0 && (
                          <div
                            className="pronunciation-list"
                            aria-label={`${lookupDetail.core.word} 读音`}
                          >
                            {lookupDetail.pronunciations.map(
                              (pronunciation, index) => {
                                const label = getPronunciationLabel(
                                  pronunciation,
                                  index,
                                )

                                return (
                                  <button
                                    key={`${lookupDetail.core.id}-${pronunciation.id}`}
                                    type="button"
                                    className={
                                      activePronunciationKey ===
                                      getPronunciationKey(
                                        lookupDetail.core,
                                        pronunciation,
                                      )
                                        ? 'playing'
                                        : ''
                                    }
                                    aria-label={`播放 ${lookupDetail.core.word} ${label} 读音`}
                                    title={`${lookupDetail.core.word} ${label} 读音`}
                                    onClick={() =>
                                      playPronunciation(
                                        lookupDetail.core,
                                        pronunciation,
                                      )
                                    }
                                  >
                                    {activePronunciationKey ===
                                    getPronunciationKey(
                                      lookupDetail.core,
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

                        {lookupDetail.core.definitionEn && (
                          <p className="lookup-result-definition">
                            {lookupDetail.core.definitionEn}
                          </p>
                        )}

                        {lookupPrimaryExample && (
                          <div className="lookup-result-example">
                            <span>Example</span>
                            <p>{lookupPrimaryExample.sentenceEn}</p>
                            {lookupPrimaryExample.sentenceZh && (
                              <small>{lookupPrimaryExample.sentenceZh}</small>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </section>
                )}
              </div>
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

        {isAuthPage && <AuthPage mode={view} onChangeView={changeView} />}

        {placeholderPage && (
          <section className="panel placeholder-panel">
            <span>{pageHeading?.eyebrow}</span>
            <h2>{placeholderPage.title}</h2>
            <p>{placeholderPage.description}</p>
            <small>{placeholderPage.note}</small>
          </section>
        )}

        {view === 'verbs' && (
          <VerbPage
            selectedVerbId={selectedVerbLookup}
            onOpenVerb={openVerbDetail}
            onBackToList={closeVerbDetail}
          />
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
            <section
              className="panel vocabulary-toolbar"
              ref={vocabularyToolbarRef}
            >
              <div className="filters vocabulary-filters">
                <input
                  ref={vocabularySearchInputRef}
                  placeholder="搜索单词、中文释义或英文释义（按 / 聚焦）"
                  value={vocabularyQuery}
                  onChange={(event) => {
                    setVocabularyQuery(event.target.value)
                    setVocabularyOffset(0)
                    setFocusedVocabularyIndex(0)
                  }}
                />
              </div>
              {vocabularyPagination}
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

            <section className="panel vocabulary-list" aria-label="词汇列表">
              {visibleCoreVocabulary.map((item, index) => {
                const rank = getVocabularyRank(item)
                const isInRoadmapProgress = rank > 0 && rank <= roadmapProgress
                const isProgressRow = rank > 0 && rank === roadmapProgress
                const isFocused = index === focusedVocabularyIndex
                const primaryPronunciation = getPrimaryPronunciation(item)
                const isPlaying =
                  primaryPronunciation !== null &&
                  activePronunciationKey ===
                    getPronunciationKey(item, primaryPronunciation)

                return (
                  <article
                    key={item.id}
                    className={`vocabulary-row${isFocused ? ' is-focused' : ''}${
                      isProgressRow ? ' is-progress' : ''
                    }`}
                    onClick={() => openVocabularyDetail(item.id)}
                    onMouseEnter={() => {
                      vocabularyFocusSourceRef.current = 'mouse'
                      setFocusedVocabularyIndex(index)
                    }}
                  >
                    <span className="row-rank">
                      #{String(rank).padStart(4, '0')}
                    </span>
                    <span className="row-word">{item.word}</span>
                    <span className="row-phonetic">
                      {item.phoneticUs || item.phoneticUk}
                    </span>
                    <button
                      type="button"
                      className={`row-play${isPlaying ? ' playing' : ''}`}
                      disabled={!primaryPronunciation}
                      aria-label={`播放 ${item.word} 读音`}
                      onClick={(event) => {
                        event.stopPropagation()

                        if (primaryPronunciation) {
                          playPronunciation(item, primaryPronunciation)
                        }
                      }}
                    >
                      ▶
                    </button>
                    <span className="row-meaning">{item.meaning}</span>
                    {isProgressRow && (
                      <span className="row-progress-flag">我的进度</span>
                    )}
                    <span className="row-actions">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          openVocabularyDetail(item.id)
                        }}
                      >
                        详情
                      </button>
                      <button
                        type="button"
                        disabled={isInRoadmapProgress}
                        onClick={(event) => {
                          event.stopPropagation()
                          updateRoadmapProgress(rank)
                        }}
                      >
                        {isInRoadmapProgress ? '已在进度内' : '标记到这里'}
                      </button>
                    </span>
                  </article>
                )
              })}
            </section>

            {visibleCoreVocabulary.length > 0 && (
              <section className="panel vocabulary-pagination-panel">
                {vocabularyPagination}
              </section>
            )}

            <section className="vocabulary-kbd-hints" aria-hidden="true">
              <span>
                <kbd>j</kbd>
                <kbd>k</kbd> 移动
              </span>
              <span>
                <kbd>enter</kbd> 详情
              </span>
              <span>
                <kbd>p</kbd> 读音
              </span>
              <span>
                <kbd>m</kbd> 标记
              </span>
              <span>
                <kbd>/</kbd> 搜索
              </span>
            </section>
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

    </div>
  )
}

export default App
