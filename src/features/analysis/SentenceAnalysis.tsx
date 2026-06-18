import { Fragment, useRef, useState } from 'react'
import './sentence-analysis.css'

interface AnalysisKeyword {
  text: string
  note: string
}

interface AnalysisResult {
  backbone?: { en?: string; zh?: string }
  structure?: string
  usage?: string
  keywords?: AnalysisKeyword[]
}

interface SentenceAnalysisProps {
  sentence: string
  word?: string
  translation?: string
}

type Status = 'idle' | 'loading' | 'done' | 'error'

function SentenceAnalysis({ sentence, word, translation }: SentenceAnalysisProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  // Keep the latest in-flight request so reopening doesn't double-fetch.
  const requestedRef = useRef(false)

  async function runAnalysis() {
    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence, word, translation }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { analysis?: AnalysisResult; error?: string }
        | null

      if (!response.ok || !payload?.analysis) {
        throw new Error(payload?.error ?? 'AI 分析失败，请稍后再试')
      }

      setResult(payload.analysis)
      setStatus('done')
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : 'AI 分析失败，请稍后再试',
      )
      setStatus('error')
    }
  }

  function handleToggle() {
    const next = !open
    setOpen(next)

    if (next && !requestedRef.current) {
      requestedRef.current = true
      runAnalysis()
    }
  }

  function handleRetry() {
    runAnalysis()
  }

  return (
    <Fragment>
      <button
        type="button"
        className={`sentence-analysis-trigger${open ? ' is-open' : ''}`}
        aria-label={open ? '收起 AI 解析' : 'AI 解析这句'}
        aria-expanded={open}
        onClick={handleToggle}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M9.4 9.2a2.6 2.6 0 0 1 5.1.6c0 1.7-2.5 2-2.5 3.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="sentence-analysis-panel" role="region" aria-label="AI 句子解析">
          {status === 'loading' && (
            <div className="sentence-analysis-loading" aria-busy="true">
              <span />
              <span />
              <span />
            </div>
          )}

          {status === 'error' && (
            <div className="sentence-analysis-error">
              <p>{error}</p>
              <button type="button" onClick={handleRetry}>
                重试
              </button>
            </div>
          )}

          {status === 'done' && result && (
            <div className="sentence-analysis-body">
              {result.backbone?.en && (
                <div className="sentence-analysis-block sentence-analysis-backbone">
                  <span className="sentence-analysis-label">主干</span>
                  <p className="sentence-analysis-backbone-en">{result.backbone.en}</p>
                  {result.backbone.zh && (
                    <p className="sentence-analysis-backbone-zh">{result.backbone.zh}</p>
                  )}
                </div>
              )}

              {result.structure && (
                <div className="sentence-analysis-block">
                  <span className="sentence-analysis-label">结构</span>
                  <p>{result.structure}</p>
                </div>
              )}

              {result.usage && (
                <div className="sentence-analysis-block">
                  <span className="sentence-analysis-label">用法</span>
                  <p>{result.usage}</p>
                </div>
              )}

              {result.keywords && result.keywords.length > 0 && (
                <div className="sentence-analysis-block">
                  <span className="sentence-analysis-label">重点词</span>
                  <ul className="sentence-analysis-keywords">
                    {result.keywords.map((keyword, index) => (
                      <li key={`${keyword.text}-${index}`}>
                        <code>{keyword.text}</code>
                        <span>{keyword.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="sentence-analysis-disclaimer">由 AI 生成，仅供参考</p>
            </div>
          )}
        </div>
      )}
    </Fragment>
  )
}

export default SentenceAnalysis
