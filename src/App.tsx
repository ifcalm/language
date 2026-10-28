import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import {
  getPathFromView,
  getVerbLookupFromPath,
  getViewFromPath,
  type ViewId,
} from './app/routing'
import SiteHeader from './components/SiteHeader'
import HomePage from './features/home/HomePage'
import VocabularyPage from './features/vocabulary/VocabularyPage'

// Pages other than the landing page and the word list load on demand, so the
// first visit does not download the sentence-growth player, the drag-and-drop
// library or the strategy trees.
const SentencePracticePage = lazy(
  () => import('./features/examples/SentencePracticePage'),
)
const StrategyPage = lazy(() => import('./features/strategy/StrategyPage'))
const VerbPage = lazy(() => import('./features/verbs/VerbPage'))
const IeltsPage = lazy(() => import('./features/ielts/IeltsPage'))

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
  const [ieltsPageKey, setIeltsPageKey] = useState(0)

  function resetVocabularyPage() {
    setVocabularyPageKey((key) => key + 1)
  }

  function changeView(nextView: ViewId) {
    const nextPath = getPathFromView(nextView)
    setView(nextView)

    if (nextView !== 'verbs') {
      setSelectedVerbLookup('')
    }

    // The IELTS page keeps its module/topic/word state from the URL; remount it
    // so the header link always returns to the module overview.
    if (nextView === 'ielts') {
      setIeltsPageKey((key) => key + 1)
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
        } ${view === 'ielts' ? 'ielts-content' : ''}`}
      >
        {view === 'roadmap' && <HomePage onOpenVocabulary={openVocabularyFromHome} />}

        <Suspense
          fallback={
            <section className="panel placeholder-panel" role="status">
              正在加载…
            </section>
          }
        >
        {view === 'strategy' && <StrategyPage onChangeView={changeView} />}

        {view === 'examples' && <SentencePracticePage />}

        {view === 'ielts' && <IeltsPage key={ieltsPageKey} />}

        {view === 'verbs' && (
          <VerbPage
            selectedVerbId={selectedVerbLookup}
            onOpenVerb={openVerbDetail}
            onBackToList={closeVerbDetail}
          />
        )}

        </Suspense>

        {view === 'vocabulary' && <VocabularyPage key={vocabularyPageKey} />}
      </main>
    </div>
  )
}

export default App
