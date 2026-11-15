import { useCallback, useEffect, useRef, useState } from 'react'
import { getClozeAnswerState } from './clozeAnswer'

// Typing state for a set of blanks shown together (one sentence, or one word
// or phrase): typing anywhere on the page lands in the first unfinished blank,
// a correct blank locks, and Enter moves on once every blank is filled.

// Typing lands in a blank unless focus is already in a text field; checkboxes
// and buttons don't count.
const TEXT_ENTRY_SELECTOR =
  'input:not([type]), input[type="text"], input[type="search"], input[type="number"], textarea, select, [contenteditable]'

// Letters (accented ones too), digits for mid-1990s and 3D, apostrophes, hyphens.
export const CLOZE_CHARACTERS = /[\p{L}\p{N}'’-]+/gu

function sanitizeAnswer(value: string) {
  return value.replace(/[^\p{L}\p{N}'’-]/gu, '')
}

export function useClozeBlanks(expected: string[], onEnter: () => void) {
  const [answers, setAnswers] = useState<string[]>(() => expected.map(() => ''))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const states = expected.map((text, index) => getClozeAnswerState(answers[index], text))
  const isComplete = states.every((state) => state === 'complete')
  const currentBlank = Math.max(
    states.findIndex((state) => state !== 'complete'),
    0,
  )

  const currentBlankRef = useRef(currentBlank)
  currentBlankRef.current = currentBlank

  const focusCurrent = useCallback(() => {
    inputRefs.current[currentBlankRef.current]?.focus({ preventScroll: true })
  }, [])

  // Typing anywhere on the page goes into the first unfinished blank.
  useEffect(() => {
    if (isComplete) {
      return
    }

    function handleTypingStart(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        !/^[\p{L}\p{N}'’-]$/u.test(event.key) ||
        (event.target instanceof HTMLElement && event.target.closest(TEXT_ENTRY_SELECTOR))
      ) {
        return
      }

      event.preventDefault()
      inputRefs.current[currentBlank]?.focus({ preventScroll: true })
      setAnswers((current) =>
        current.map((answer, index) => (index === currentBlank ? answer + event.key : answer)),
      )
    }

    document.addEventListener('keydown', handleTypingStart)
    return () => document.removeEventListener('keydown', handleTypingStart)
  }, [currentBlank, isComplete])

  // Enter moves on from anywhere on the page once everything is filled in,
  // not only while focus is still in a blank. Buttons, selects and checkboxes
  // keep their own Enter.
  useEffect(() => {
    if (!isComplete) {
      return
    }

    function handleEnter(event: KeyboardEvent) {
      if (
        event.key !== 'Enter' ||
        event.defaultPrevented ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (event.target instanceof HTMLElement &&
          event.target.closest('button, a, select, textarea, input[type="checkbox"]'))
      ) {
        return
      }

      event.preventDefault()
      onEnter()
    }

    document.addEventListener('keydown', handleEnter)
    return () => document.removeEventListener('keydown', handleEnter)
  }, [isComplete, onEnter])

  function updateAnswer(index: number, value: string) {
    // A finished blank stays as it is: focus rests in it, and a stray key
    // would otherwise turn the correct answer into an error.
    if (states[index] === 'complete') {
      return
    }

    const answer = sanitizeAnswer(value)
    const nextAnswers = answers.map((current, answerIndex) =>
      answerIndex === index ? answer : current,
    )
    setAnswers(nextAnswers)

    if (getClozeAnswerState(answer, expected[index]) === 'complete') {
      const nextBlank = expected.findIndex(
        (text, blankIndex) => getClozeAnswerState(nextAnswers[blankIndex], text) !== 'complete',
      )
      if (nextBlank >= 0) {
        inputRefs.current[nextBlank]?.focus({ preventScroll: true })
      }
    }
  }

  return {
    answers,
    states,
    isComplete,
    currentBlank,
    focusCurrent,
    updateAnswer,
    setInputRef: (index: number) => (node: HTMLInputElement | null) => {
      inputRefs.current[index] = node
    },
  }
}
