import { useCallback, useEffect, useRef, useState } from 'react'
import { getVocabularyLookupFromPath } from '../../app/routing'
import type { CoreVocabularyEntry } from '../../data/vocabulary'
import {
  mapApiVocabularyItem,
  requestVocabularyDetail,
  requestVocabularyList,
} from './api'
import type { VocabularyDetail } from './types'
import { usePronunciationPlayback } from './usePronunciationPlayback'
import {
  getPrimaryPronunciation,
  getPronunciationKey,
  getPronunciationLabel,
  getVocabularyRank,
  highlightTargetWord,
} from './utils'

const VOCABULARY_PAGE_SIZE = 120

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 6 9 12l6 6" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7Z" />
    </svg>
  )
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

function getInitialVocabularyLookup() {
  if (typeof window === 'undefined') {
    return ''
  }

  return getVocabularyLookupFromPath(window.location.pathname)
}

function VocabularyPage() {
  const [vocabularyQuery, setVocabularyQuery] = useState('')
  const [vocabularyOffset, setVocabularyOffset] = useState(
    getInitialVocabularyOffset,
  )
  const [focusedVocabularyIndex, setFocusedVocabularyIndex] = useState(0)
  const [apiVocabulary, setApiVocabulary] = useState<CoreVocabularyEntry[]>([])
  const [apiVocabularyTotal, setApiVocabularyTotal] = useState(0)
  const [isVocabularyLoading, setIsVocabularyLoading] = useState(false)
  const [vocabularyApiError, setVocabularyApiError] = useState('')
  const [selectedVocabularyLookup, setSelectedVocabularyLookup] = useState(
    getInitialVocabularyLookup,
  )
  const [selectedVocabularyDetail, setSelectedVocabularyDetail] =
    useState<VocabularyDetail | null>(null)
  const [isVocabularyDetailLoading, setIsVocabularyDetailLoading] = useState(false)
  const [vocabularyDetailError, setVocabularyDetailError] = useState('')
  const vocabularySearchInputRef = useRef<HTMLInputElement | null>(null)
  const vocabularyToolbarRef = useRef<HTMLElement | null>(null)
  const vocabularyFocusSourceRef = useRef<'keyboard' | 'mouse'>('keyboard')
  const {
    activePronunciationKey,
    pronunciationPlaybackError,
    playPronunciation,
  } = usePronunciationPlayback()

  const visibleCoreVocabulary = apiVocabulary
  const vocabularyResultCount = apiVocabularyTotal
  const shownVocabularyStart =
    visibleCoreVocabulary.length > 0 ? vocabularyOffset + 1 : 0
  const shownVocabularyEnd = vocabularyOffset + visibleCoreVocabulary.length
  const openVocabularyDetail = useCallback((lookup: string) => {
    const normalizedLookup = lookup.trim()

    if (!normalizedLookup) {
      return
    }

    setSelectedVocabularyLookup(normalizedLookup)

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.pathname = `/vocabulary/${encodeURIComponent(normalizedLookup)}`
      window.history.pushState(null, '', url)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  function closeVocabularyDetail() {
    setSelectedVocabularyLookup('')
    setSelectedVocabularyDetail(null)
    setVocabularyDetailError('')

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.pathname = '/vocabulary'
      window.history.pushState(null, '', url)
    }
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

  const vocabularyPagination = (
    <div className="vocabulary-pagination">
      <button
        type="button"
        className="pagination-step"
        aria-label="上一批"
        disabled={vocabularyOffset === 0}
        onClick={() => goToVocabularyOffset(vocabularyOffset - VOCABULARY_PAGE_SIZE)}
      >
        ←
      </button>
      <span className="pagination-range">
        {shownVocabularyStart > 0
          ? `${shownVocabularyStart}–${shownVocabularyEnd} / ${vocabularyResultCount}`
          : `0 / ${vocabularyResultCount}`}
      </span>
      <button
        type="button"
        className="pagination-step"
        aria-label="下一批"
        disabled={shownVocabularyEnd >= vocabularyResultCount}
        onClick={() => goToVocabularyOffset(vocabularyOffset + VOCABULARY_PAGE_SIZE)}
      >
        →
      </button>
    </div>
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const url = new URL(window.location.href)

    if (vocabularyOffset > 0) {
      url.searchParams.set('from', String(vocabularyOffset))
    } else {
      url.searchParams.delete('from')
    }

    window.history.replaceState(null, '', url)
  }, [vocabularyOffset])

  useEffect(() => {
    function handlePopState() {
      setSelectedVocabularyLookup(
        getVocabularyLookupFromPath(window.location.pathname),
      )
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (vocabularyFocusSourceRef.current !== 'keyboard') {
      return
    }

    document
      .querySelector('.vocabulary-row.is-focused')
      ?.scrollIntoView({ block: 'nearest' })
  }, [focusedVocabularyIndex])

  useEffect(() => {
    if (selectedVocabularyLookup) {
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
        default:
          break
      }
    }

    window.addEventListener('keydown', handleVocabularyKeyDown)
    return () => window.removeEventListener('keydown', handleVocabularyKeyDown)
  }, [
    selectedVocabularyLookup,
    visibleCoreVocabulary,
    focusedVocabularyIndex,
    openVocabularyDetail,
    playPronunciation,
  ])

  useEffect(() => {
    if (selectedVocabularyLookup) {
      return
    }

    const controller = new AbortController()

    async function fetchVocabulary() {
      setIsVocabularyLoading(true)
      setVocabularyApiError('')

      try {
        const payload = await requestVocabularyList(
          {
            query: vocabularyQuery,
            offset: vocabularyOffset,
            limit: VOCABULARY_PAGE_SIZE,
          },
          controller.signal,
        )

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
  }, [selectedVocabularyLookup, vocabularyOffset, vocabularyQuery])

  useEffect(() => {
    if (!selectedVocabularyLookup) {
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
  }, [selectedVocabularyLookup])

  useEffect(() => {
    const detail = selectedVocabularyDetail

    if (!detail) {
      return
    }

    const previousVocabularyId = detail.prevId
    const nextVocabularyId = detail.nextId

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

      if (event.key === 'ArrowLeft' && previousVocabularyId) {
        event.preventDefault()
        openVocabularyDetail(previousVocabularyId)
      } else if (event.key === 'ArrowRight' && nextVocabularyId) {
        event.preventDefault()
        openVocabularyDetail(nextVocabularyId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedVocabularyDetail, openVocabularyDetail])

  return (
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
              <div className="vocabulary-detail-topbar">
                <button
                  type="button"
                  className="vocabulary-detail-back"
                  onClick={closeVocabularyDetail}
                >
                  ← 返回词库
                </button>

                <div className="vocabulary-detail-nav">
                  {selectedVocabularyDetail.position &&
                    selectedVocabularyDetail.total && (
                      <span className="vocabulary-detail-position">
                        {selectedVocabularyDetail.core.word} ·{' '}
                        {selectedVocabularyDetail.position}/
                        {selectedVocabularyDetail.total}
                      </span>
                    )}
                  <button
                    type="button"
                    className="vocab-pager-btn"
                    aria-label="上一词"
                    disabled={!selectedVocabularyDetail.prevId}
                    onClick={() =>
                      selectedVocabularyDetail.prevId &&
                      openVocabularyDetail(selectedVocabularyDetail.prevId)
                    }
                  >
                    <ArrowLeftIcon />
                  </button>
                  <button
                    type="button"
                    className="vocab-pager-btn"
                    aria-label="下一词"
                    disabled={!selectedVocabularyDetail.nextId}
                    onClick={() =>
                      selectedVocabularyDetail.nextId &&
                      openVocabularyDetail(selectedVocabularyDetail.nextId)
                    }
                  >
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>

              <section className="panel vocabulary-detail-hero">
                <div className="vocabulary-detail-primary">
                  <div className="vocabulary-detail-heading">
                    <h2>{selectedVocabularyDetail.core.word}</h2>
                    <p>
                      {selectedVocabularyDetail.core.meaningZh ||
                        selectedVocabularyDetail.core.meaning}
                    </p>
                  </div>

                  {selectedVocabularyDetail.core.definitionEn ? (
                    <p className="vocabulary-detail-definition">
                      {selectedVocabularyDetail.core.definitionEn}
                    </p>
                  ) : null}
                </div>

                <aside
                  className="vocabulary-detail-study"
                  aria-label={`${selectedVocabularyDetail.core.word} 学习信息`}
                >
                  {(selectedVocabularyDetail.core.phoneticUs ||
                    selectedVocabularyDetail.core.phoneticUk) ? (
                    <p className="vocabulary-phonetics">
                      {selectedVocabularyDetail.core.phoneticUs ? (
                        <span>US {selectedVocabularyDetail.core.phoneticUs}</span>
                      ) : null}
                      {selectedVocabularyDetail.core.phoneticUk ? (
                        <span>UK {selectedVocabularyDetail.core.phoneticUk}</span>
                      ) : null}
                    </p>
                  ) : null}

                  {selectedVocabularyDetail.pronunciations.length > 0 ? (
                    <div
                      className="pronunciation-list"
                      aria-label={`${selectedVocabularyDetail.core.word} 读音`}
                    >
                      {selectedVocabularyDetail.pronunciations.map(
                        (pronunciation, index) => {
                          const label = getPronunciationLabel(pronunciation, index)
                          const isPlaying =
                            activePronunciationKey ===
                            getPronunciationKey(
                              selectedVocabularyDetail.core,
                              pronunciation,
                            )

                          return (
                            <button
                              key={`${selectedVocabularyDetail.core.id}-${pronunciation.id}`}
                              type="button"
                              className={isPlaying ? 'playing' : ''}
                              aria-label={`播放 ${selectedVocabularyDetail.core.word} ${label} 读音`}
                              title={`${selectedVocabularyDetail.core.word} ${label} 读音`}
                              onClick={() =>
                                playPronunciation(
                                  selectedVocabularyDetail.core,
                                  pronunciation,
                                )
                              }
                            >
                              <PlayIcon />
                              <span>{isPlaying ? `${label} 播放中` : label}</span>
                            </button>
                          )
                        },
                      )}
                    </div>
                  ) : null}
                </aside>
              </section>

              {selectedVocabularyDetail.examples.length > 0 ? (
                <section className="panel vocabulary-detail-examples">
                  <div className="vocabulary-example-list">
                    {selectedVocabularyDetail.examples.map((example, index) => (
                      <article key={example.id}>
                        <span className="vocabulary-example-index">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p>
                          {highlightTargetWord(
                            example.sentenceEn,
                            selectedVocabularyDetail.core.word,
                          )}
                        </p>
                        {example.sentenceZh ? (
                          <small>{example.sentenceZh}</small>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="panel vocabulary-source-note">
                  这个词暂时还没有例句，后面会逐步补齐。
                </section>
              )}
            </>
          )}
        </>
      )}

      {!selectedVocabularyLookup && (
        <>
          <section
            className="vocabulary-toolbar"
            ref={vocabularyToolbarRef}
          >
            <div className="vocabulary-search-box">
              <input
                ref={vocabularySearchInputRef}
                className="vocabulary-search"
                aria-label="搜索单词"
                value={vocabularyQuery}
                onChange={(event) => {
                  setVocabularyQuery(event.target.value)
                  setVocabularyOffset(0)
                  setFocusedVocabularyIndex(0)
                }}
              />
              <svg
                className="vocabulary-search-icon"
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
              const isFocused = index === focusedVocabularyIndex
              const primaryPronunciation = getPrimaryPronunciation(item)
              const isPlaying =
                primaryPronunciation !== null &&
                activePronunciationKey ===
                  getPronunciationKey(item, primaryPronunciation)

              return (
                <article
                  key={item.id}
                  className={`vocabulary-row${isFocused ? ' is-focused' : ''}`}
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
                  </span>
                </article>
              )
            })}
          </section>

          {visibleCoreVocabulary.length > 0 && (
            <div className="vocabulary-pagination-footer">
              {vocabularyPagination}
            </div>
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
              <kbd>/</kbd> 搜索
            </span>
          </section>
        </>
      )}
    </>
  )
}

export default VocabularyPage
