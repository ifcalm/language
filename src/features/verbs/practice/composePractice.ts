import type { VerbPath } from '../types'

export interface ComposeChunk {
  id: string
  text: string
  kind: 'action' | 'core' | 'modifier'
  labelZh: string
}

export interface ComposeChallenge {
  chunks: ComposeChunk[]
  // Correct chunk id order, derived from the full sentence.
  answerOrder: string[]
  fullSentenceEn: string
  fullSentenceZh: string
}

// Standard order = each chunk's first appearance in the full sentence. Glue
// words (to / before / articles) aren't chunks, so this reads the canonical
// word order straight off the target sentence instead of trusting node order.
// Chunks whose text can't be located (rare generation drift) fall back to the
// order in which the growth steps introduce them, appended after the matched
// ones so the exercise never breaks.
function getAnswerOrder(path: VerbPath, chunks: ComposeChunk[]): string[] {
  const sentence = path.fullSentenceEn.toLowerCase()

  const stepOrder = new Map<string, number>()
  let stepCursor = 0
  for (const step of path.growth?.steps ?? []) {
    for (const nodeId of step.addNodeIds) {
      if (!stepOrder.has(nodeId)) {
        stepOrder.set(nodeId, stepCursor)
        stepCursor += 1
      }
    }
  }

  return [...chunks]
    .map((chunk) => {
      const position = sentence.indexOf(chunk.text.trim().toLowerCase())
      return {
        id: chunk.id,
        matched: position >= 0,
        position,
        stepIndex: stepOrder.get(chunk.id) ?? Number.MAX_SAFE_INTEGER,
      }
    })
    .sort((left, right) => {
      if (left.matched && right.matched) {
        return left.position - right.position
      }
      // Unmatched chunks sort after matched ones, ordered by step introduction.
      if (left.matched !== right.matched) {
        return left.matched ? -1 : 1
      }
      return left.stepIndex - right.stepIndex
    })
    .map((entry) => entry.id)
}

export function buildComposeChallenge(path: VerbPath): ComposeChallenge | null {
  const growth = path.growth

  if (!growth || growth.nodes.length === 0 || !path.fullSentenceEn.trim()) {
    return null
  }

  const chunks: ComposeChunk[] = growth.nodes.map((node) => ({
    id: node.id,
    text: node.text.trim(),
    kind: node.kind,
    labelZh: node.labelZh?.trim() ?? '',
  }))

  const answerOrder = getAnswerOrder(path, chunks)

  // A challenge with a single chunk has nothing to order.
  if (answerOrder.length < 2) {
    return null
  }

  return {
    chunks,
    answerOrder,
    fullSentenceEn: path.fullSentenceEn.trim(),
    fullSentenceZh: path.fullSentenceZh.trim(),
  }
}

export function shuffleIds(ids: string[]): string[] {
  const result = [...ids]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }

  return result
}

// Avoid handing the learner an already-solved (or trivially short) board.
export function shuffleChallengeOrder(answerOrder: string[]): string[] {
  if (answerOrder.length < 2) {
    return [...answerOrder]
  }

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const shuffled = shuffleIds(answerOrder)
    const sameAsAnswer = shuffled.every((id, index) => id === answerOrder[index])

    if (!sameAsAnswer) {
      return shuffled
    }
  }

  // Fallback: rotate by one so it's never identical to the solution.
  return [...answerOrder.slice(1), answerOrder[0]]
}

export interface GradeResult {
  // Per-position correctness, aligned with the current order.
  correctByIndex: boolean[]
  isAllCorrect: boolean
  correctCount: number
}

export function gradeOrder(
  currentOrder: string[],
  answerOrder: string[],
): GradeResult {
  const correctByIndex = currentOrder.map(
    (id, index) => id === answerOrder[index],
  )
  const correctCount = correctByIndex.filter(Boolean).length

  return {
    correctByIndex,
    isAllCorrect:
      currentOrder.length === answerOrder.length &&
      correctCount === answerOrder.length,
    correctCount,
  }
}
