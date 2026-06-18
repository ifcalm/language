import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

interface PopoverPosition {
  top: number
  left: number
  width: number
  maxHeight: number
}

type Status = 'idle' | 'loading' | 'done' | 'error'

const POPOVER_WIDTH = 380
const EDGE_GAP = 12
const ANCHOR_GAP = 8

function SentenceAnalysis({ sentence, word, translation }: SentenceAnalysisProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [position, setPosition] = useState<PopoverPosition | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  // Only fetch once per mount; reopening reuses the cached result.
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

  // Anchor the popover to the trigger; flip above when there's no room below.
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) {
      return
    }

    const rect = triggerRef.current.getBoundingClientRect()

    // Close once the trigger has scrolled out of view entirely.
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setOpen(false)
      return
    }

    const width = Math.min(POPOVER_WIDTH, window.innerWidth - EDGE_GAP * 2)
    const left = Math.max(
      EDGE_GAP,
      Math.min(rect.right - width, window.innerWidth - EDGE_GAP - width),
    )

    const popHeight = popoverRef.current?.offsetHeight ?? 0
    const spaceBelow = window.innerHeight - rect.bottom - ANCHOR_GAP - EDGE_GAP
    const spaceAbove = rect.top - ANCHOR_GAP - EDGE_GAP

    let top: number
    let maxHeight: number

    if (popHeight && popHeight <= spaceBelow) {
      top = rect.bottom + ANCHOR_GAP
      maxHeight = spaceBelow
    } else if (popHeight && popHeight <= spaceAbove) {
      top = rect.top - ANCHOR_GAP - popHeight
      maxHeight = spaceAbove
    } else if (spaceBelow >= spaceAbove) {
      top = rect.bottom + ANCHOR_GAP
      maxHeight = spaceBelow
    } else {
      top = EDGE_GAP
      maxHeight = spaceAbove
    }

    setPosition({ top, left, width, maxHeight: Math.max(140, maxHeight) })
  }, [])

  useLayoutEffect(() => {
    if (open) {
      updatePosition()
    }
  }, [open, status, updatePosition])

  // Keep the popover glued to the trigger on scroll/resize; dismiss only on
  // outside interaction or Escape.
  useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (
        popoverRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  function handleRetry() {
    runAnalysis()
  }

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
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

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="sentence-analysis-popover"
            role="dialog"
            aria-label="AI 句子解析"
            style={
              position
                ? {
                    top: position.top,
                    left: position.left,
                    width: position.width,
                    maxHeight: position.maxHeight,
                  }
                : { visibility: 'hidden' }
            }
          >
            <div className="sentence-analysis-header">
              <p className="sentence-analysis-source">{sentence}</p>
              <button
                type="button"
                className="sentence-analysis-close"
                aria-label="关闭"
                onClick={() => setOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

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
                    <p className="sentence-analysis-backbone-en">
                      {result.backbone.en}
                    </p>
                    {result.backbone.zh && (
                      <p className="sentence-analysis-backbone-zh">
                        {result.backbone.zh}
                      </p>
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
          </div>,
          document.body,
        )}
    </>
  )
}

export default SentenceAnalysis
