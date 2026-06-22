import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useState,
} from 'react'
import { requestVocabularyDetail } from '../vocabulary/api'
import type { VocabularyDetail } from '../vocabulary/types'
import { usePronunciationPlayback } from '../vocabulary/usePronunciationPlayback'
import {
  getPronunciationKey,
  getPronunciationLabel,
} from '../vocabulary/utils'

interface HomePageProps {
  onOpenVocabulary: () => void
}

function HomePage({ onOpenVocabulary }: HomePageProps) {
  const [vocabularyQuery, setVocabularyQuery] = useState('')
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupDetail, setLookupDetail] = useState<VocabularyDetail | null>(null)
  const [isLookupLoading, setIsLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const {
    activePronunciationKey,
    pronunciationPlaybackError,
    playPronunciation,
    resetPronunciationPlayback,
  } = usePronunciationPlayback()
  const lookupPrimaryExample = lookupDetail?.examples[0]

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
        resetPronunciationPlayback()
        setLookupQuery('')
        setLookupDetail(null)
        setIsLookupLoading(false)
        setLookupError('')
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [lookupQuery, resetPronunciationPlayback])

  function openLookupResult(lookup: string) {
    const normalizedLookup = lookup.trim()

    if (!normalizedLookup) {
      return
    }

    resetPronunciationPlayback()
    setLookupQuery(normalizedLookup)
    setLookupDetail(null)
    setIsLookupLoading(false)
    setLookupError('')
  }

  function closeLookupResult() {
    resetPronunciationPlayback()
    setLookupQuery('')
    setLookupDetail(null)
    setIsLookupLoading(false)
    setLookupError('')
  }

  function runVocabularySearch() {
    const normalizedQuery = vocabularyQuery.trim()

    if (normalizedQuery) {
      openLookupResult(normalizedQuery)
      return
    }

    onOpenVocabulary()
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

  return (
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
                        {lookupDetail.core.meaningZh || lookupDetail.core.meaning}
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
                      {lookupDetail.pronunciations.map((pronunciation, index) => {
                        const label = getPronunciationLabel(pronunciation, index)

                        return (
                          <button
                            key={`${lookupDetail.core.id}-${pronunciation.id}`}
                            type="button"
                            className={
                              activePronunciationKey ===
                              getPronunciationKey(lookupDetail.core, pronunciation)
                                ? 'playing'
                                : ''
                            }
                            aria-label={`播放 ${lookupDetail.core.word} ${label} 读音`}
                            title={`${lookupDetail.core.word} ${label} 读音`}
                            onClick={() =>
                              playPronunciation(lookupDetail.core, pronunciation)
                            }
                          >
                            {activePronunciationKey ===
                            getPronunciationKey(lookupDetail.core, pronunciation)
                              ? `${label} 播放中`
                              : label}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {pronunciationPlaybackError && (
                    <p className="lookup-result-status" role="status">
                      {pronunciationPlaybackError}
                    </p>
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
  )
}

export default HomePage
