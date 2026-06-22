import { useEffect, useState } from 'react'
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
import HomePage from './features/home/HomePage'
import LibraryPage from './features/library/LibraryPage'
import StrategyPage from './features/strategy/StrategyPage'
import VerbPage from './features/verbs/VerbPage'
import VocabularyPage from './features/vocabulary/VocabularyPage'

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

interface AuthUser extends SiteHeaderUser {
  id: string
  role: string
}

interface AuthMeResponse {
  user: AuthUser | null
}

function App() {
  const [view, setView] = useState<ViewId>(getInitialView)
  const [selectedVerbLookup, setSelectedVerbLookup] = useState(getInitialVerbLookup)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [vocabularyPageKey, setVocabularyPageKey] = useState(0)

  const pageHeadings: Partial<
    Record<
      ViewId,
      {
        eyebrow: string
        title: string
      }
    >
  > = {
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
    examples: {
      title: '例句会围绕真实阅读场景整理',
      description:
        '这里会优先展示短、准、可复用的英文句子，帮助把单词放回语境里，而不是孤立背词。',
      note: '第一版先保留入口，后续从公共例句数据中接入。',
    },
  }
  const placeholderPage = placeholderPages[view]
  const isAuthPage = isAuthView(view)

  function resetVocabularyPage() {
    setVocabularyPageKey((key) => key + 1)
  }

  function changeView(nextView: ViewId) {
    const nextPath = getPathFromView(nextView)
    setView(nextView)

    if (nextView !== 'verbs') {
      setSelectedVerbLookup('')
    }

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', nextPath)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function openVocabularyFromHome() {
    resetVocabularyPage()
    changeView('vocabulary')
  }

  function openVerbDetail(verbId: string) {
    const normalizedVerbId = verbId.trim()

    if (!normalizedVerbId) {
      return
    }

    setSelectedVerbLookup(normalizedVerbId)
    setView('verbs')

    if (typeof window !== 'undefined') {
      window.history.pushState(
        null,
        '',
        `/verbs/${encodeURIComponent(normalizedVerbId)}`,
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function closeVerbDetail() {
    setSelectedVerbLookup('')

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/verbs')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setAuthUser(null)
      changeView('roadmap')
    }
  }

  useEffect(() => {
    let isActive = true

    async function fetchSession() {
      setIsAuthLoading(true)

      try {
        const response = await fetch('/api/auth/me')

        if (!response.ok) {
          throw new Error('Session unavailable')
        }

        const payload = (await response.json()) as AuthMeResponse

        if (isActive) {
          setAuthUser(payload.user)
        }
      } catch {
        if (isActive) {
          setAuthUser(null)
        }
      } finally {
        if (isActive) {
          setIsAuthLoading(false)
        }
      }
    }

    fetchSession()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    function handlePopState() {
      const nextView = getViewFromPath(window.location.pathname)
      setView(nextView)
      setSelectedVerbLookup(getVerbLookupFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <div className="app-shell">
      {!isAuthPage && (
        <SiteHeader
          view={view}
          user={authUser}
          isAuthLoading={isAuthLoading}
          onChangeView={changeView}
          onOpenVocabulary={resetVocabularyPage}
          onLogout={logout}
        />
      )}

      <main
        className={`content ${view === 'roadmap' ? 'landing-content' : ''} ${
          view === 'verbs' ? 'verb-content' : ''
        } ${
          view === 'vocabulary' ? 'vocab-content' : ''
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
          </header>
        )}

        {view === 'roadmap' && <HomePage onOpenVocabulary={openVocabularyFromHome} />}

        {isAuthPage && <AuthPage mode={view} onChangeView={changeView} />}

        {view === 'strategy' && <StrategyPage onChangeView={changeView} />}

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

        {view === 'vocabulary' && <VocabularyPage key={vocabularyPageKey} />}

        {view === 'library' && <LibraryPage />}

        {view === 'admin' && <VocabularyAdmin />}
      </main>
    </div>
  )
}

export default App
