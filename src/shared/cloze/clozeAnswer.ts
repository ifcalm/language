// Answer checking for typed blanks; see ClozeBlank.tsx.

export type ClozeAnswerState = 'empty' | 'correct' | 'error' | 'complete'

export function normalizeClozeWord(value: string) {
  return value.trim().toLowerCase().replace('’', "'")
}

// résumé and El Niño should accept plain-letter typing.
function foldAccents(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '')
}

export function getClozeAnswerState(answer: string, expected: string): ClozeAnswerState {
  if (!answer) {
    return 'empty'
  }

  const normalizedAnswer = foldAccents(normalizeClozeWord(answer))
  const normalizedExpected = foldAccents(normalizeClozeWord(expected))

  if (normalizedAnswer === normalizedExpected) {
    return 'complete'
  }

  return normalizedExpected.startsWith(normalizedAnswer) ? 'correct' : 'error'
}
