import { useEffect, useState } from 'react'
import './App.css'
import {
  getPathFromView,
  getVerbLookupFromPath,
  getViewFromPath,
  type ViewId,
} from './app/routing'
import VocabularyAdmin from './admin/VocabularyAdmin'
import SiteHeader from './components/SiteHeader'
import SentencePracticePage from './features/examples/SentencePracticePage'
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

function App() {
  const [view, setView] = useState<ViewId>(getInitialView)
  const [selectedVerbLookup, setSelectedVerbLookup] = useState(getInitialVerbLookup)
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
  }
  const placeholderPage = placeholderPages[view]

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

  useEffect(() => {
    if (/^\/(?:login|register|signup)\/?$/.test(window.location.pathname)) {
      window.history.replaceState(null, '', '/')
    }

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
      <SiteHeader
        view={view}
        onChangeView={changeView}
        onOpenVocabulary={resetVocabularyPage}
      />

      <main
        className={`content ${view === 'roadmap' ? 'landing-content' : ''} ${
          view === 'verbs' ? 'verb-content' : ''
        } ${
          view === 'vocabulary' ? 'vocab-content' : ''
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

        {view === 'strategy' && <StrategyPage onChangeView={changeView} />}

        {view === 'examples' && <SentencePracticePage />}

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
