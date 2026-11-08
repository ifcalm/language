import type { KeyboardEvent } from 'react'
import type { ClozeAnswerState } from './clozeAnswer'
import './cloze-blank.css'

// One typed blank inside a sentence: the expected word sits faded underneath
// and the learner types over it. Shared by the COCA fill-in page and IELTS
// practice.

interface ClozeBlankProps {
  answer: string
  value: string
  state: ClozeAnswerState
  ariaLabel: string
  /** Hides the faded answer; the underline keeps the word's length. */
  hideHint?: boolean
  inputRef?: (node: HTMLInputElement | null) => void
  onChange: (value: string) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
}

export function ClozeBlank({
  answer,
  value,
  state,
  ariaLabel,
  hideHint = false,
  inputRef,
  onChange,
  onKeyDown,
}: ClozeBlankProps) {
  return (
    <span className="cloze-blank" style={{ width: `${Math.max(answer.length + 1, 5)}ch` }}>
      <span className="cloze-hint" aria-hidden="true">
        <span className={`cloze-entered is-${state}`}>{value}</span>
        <span className={hideHint && state !== 'complete' ? 'is-hidden' : undefined}>
          {answer.slice(value.length)}
        </span>
      </span>
      <input
        ref={inputRef}
        className={`cloze-input is-${state}`}
        value={value}
        aria-label={ariaLabel}
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
    </span>
  )
}
