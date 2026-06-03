import { useEffect, useMemo, useState } from 'react'
import type { VerbPath } from './types'

interface SentenceGrowthPlayerProps {
  path: VerbPath
}

function isFocusedSegment(text: string, focusText: string) {
  const normalizedText = text.trim().toLowerCase()
  const normalizedFocus = focusText.trim().toLowerCase()

  return Boolean(
    normalizedFocus &&
      (normalizedText.includes(normalizedFocus) ||
        normalizedFocus.includes(normalizedText)),
  )
}

function SentenceGrowthPlayer({ path }: SentenceGrowthPlayerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const steps = path.steps
  const activeStep = steps[activeStepIndex]
  const canGoPrevious = activeStepIndex > 0
  const canGoNext = activeStepIndex < steps.length - 1

  const progress = useMemo(() => {
    if (steps.length <= 1) {
      return 100
    }

    return Math.round((activeStepIndex / (steps.length - 1)) * 100)
  }, [activeStepIndex, steps.length])

  useEffect(() => {
    if (!isPlaying || !canGoNext) {
      return
    }

    const timer = window.setTimeout(() => {
      setActiveStepIndex((current) => Math.min(current + 1, steps.length - 1))
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [canGoNext, isPlaying, steps.length, activeStepIndex])

  if (!activeStep) {
    return (
      <section className="sentence-player-empty">
        这个动词还没有句子生长路径。
      </section>
    )
  }

  return (
    <section className="sentence-player" aria-label="句子生长动画">
      <div className="sentence-player-stage">
        <div className="sentence-player-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <p className="sentence-player-label">{activeStep.label}</p>

        <p
          key={`${path.id}-${activeStep.stepNo}`}
          className="sentence-player-sentence"
        >
          {activeStep.segments.length > 0
            ? activeStep.segments.map((segment, index) => (
                <span
                  key={`${segment.text}-${index}`}
                  className={`sentence-segment ${segment.kind} ${
                    isFocusedSegment(segment.text, activeStep.focusText)
                      ? 'focused'
                      : ''
                  }`}
                >
                  {segment.text}
                </span>
              ))
            : activeStep.sentenceEn}
        </p>

        {activeStep.sentenceZh && (
          <p className="sentence-player-translation">{activeStep.sentenceZh}</p>
        )}

        {activeStep.noteZh && (
          <p className="sentence-player-note">{activeStep.noteZh}</p>
        )}
      </div>

      <div className="sentence-player-controls">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => setActiveStepIndex((current) => Math.max(0, current - 1))}
        >
          上一步
        </button>
        <button
          type="button"
          onClick={() => {
            if (!canGoNext) {
              setActiveStepIndex(0)
              setIsPlaying(true)
              return
            }

            setIsPlaying((current) => !current)
          }}
        >
          {canGoNext ? (isPlaying ? '暂停' : '播放') : '重播'}
        </button>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => setActiveStepIndex((current) => Math.min(steps.length - 1, current + 1))}
        >
          下一步
        </button>
      </div>

      <ol className="sentence-player-steps" aria-label="句子生长步骤">
        {steps.map((step, index) => (
          <li key={`${path.id}-${step.stepNo}`}>
            <button
              type="button"
              className={index === activeStepIndex ? 'active' : ''}
              onClick={() => {
                setActiveStepIndex(index)
                setIsPlaying(false)
              }}
            >
              <span>{String(step.stepNo).padStart(2, '0')}</span>
              <strong>{step.label}</strong>
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default SentenceGrowthPlayer
