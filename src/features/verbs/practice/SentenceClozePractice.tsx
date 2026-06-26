import { useMemo, useRef, useState } from 'react'
import type { VerbPath } from '../types'
import { buildClozeChallenge, normalizeAnswer } from './composePractice'

interface SentenceClozePracticeProps {
  path: VerbPath
}

function buildHint(answer: string): string {
  const first = answer.slice(0, 1)
  const rest = Math.max(answer.length - 1, 0)
  return `${first}${'·'.repeat(rest)}`
}

function SentenceClozePractice({ path }: SentenceClozePracticeProps) {
  const challenge = useMemo(() => buildClozeChallenge(path), [path])

  const [values, setValues] = useState<string[]>(() =>
    challenge ? new Array(challenge.blankCount).fill('') : [],
  )
  const [showHints, setShowHints] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  // Not every path yields a usable cloze (needs >= 2 locatable chunks).
  if (!challenge) {
    return null
  }

  const isLocked = (index: number) =>
    normalizeAnswer(values[index] ?? '') ===
    normalizeAnswer(challenge.answers[index] ?? '')
  const isWrong = (index: number) =>
    (values[index] ?? '').trim() !== '' && !isLocked(index)
  const solvedCount = challenge.answers.filter((_, index) =>
    isLocked(index),
  ).length
  const isSolved = solvedCount === challenge.blankCount

  const setValue = (index: number, value: string) =>
    setValues((current) => {
      const next = [...current]
      next[index] = value
      return next
    })

  const focusNext = (index: number) => {
    for (let next = index + 1; next < challenge.blankCount; next += 1) {
      const input = inputRefs.current[next]
      if (input && !input.readOnly) {
        input.focus()
        return
      }
    }
  }

  return (
    <div className="cloze-practice" aria-label="默写练习">
      <p className="compose-prompt-label">默写句子里标出的重要单词</p>
      <p className="compose-prompt-zh">{challenge.fullSentenceZh}</p>

      <div className="compose-sentence cloze-sentence">
        {challenge.segments.map((segment, index) => {
          if (segment.type === 'fixed') {
            return (
              <span className="compose-fixed" key={`fixed-${index}`}>
                {segment.text}
              </span>
            )
          }

          const blankIndex = segment.blankIndex
          const locked = isLocked(blankIndex)
          const wrong = isWrong(blankIndex)
          const answer = challenge.answers[blankIndex] ?? ''

          return (
            <input
              key={`blank-${blankIndex}`}
              ref={(element) => {
                inputRefs.current[blankIndex] = element
              }}
              className={`cloze-input${locked ? ' is-locked' : ''}${
                wrong ? ' is-wrong' : ''
              }`}
              value={values[blankIndex] ?? ''}
              readOnly={locked}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              placeholder={showHints && !locked ? buildHint(answer) : ''}
              style={{ width: `${Math.max(answer.length, 3) + 1.5}ch` }}
              aria-label={`第 ${blankIndex + 1} 个空`}
              onChange={(event) => setValue(blankIndex, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  focusNext(blankIndex)
                }
              }}
            />
          )
        })}
      </div>

      {isSolved ? (
        <div className="compose-solved" role="status">
          <p className="compose-solved-title">
            <svg
              className="compose-solved-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m5 13 4 4 10-10" />
            </svg>
            默写完成
          </p>
          <p className="compose-solved-sentence">{challenge.fullSentenceEn}</p>
        </div>
      ) : (
        <div className="compose-toolbar">
          <span className="compose-progress">
            {solvedCount}/{challenge.blankCount}
          </span>
          <button
            type="button"
            className="compose-reshuffle"
            aria-pressed={showHints}
            onClick={() => setShowHints((value) => !value)}
          >
            {showHints ? '隐藏提示' : '提示'}
          </button>
        </div>
      )}
    </div>
  )
}

export default SentenceClozePractice
