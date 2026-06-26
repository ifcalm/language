import type { VerbPath } from '../types'

export interface ComposeChunk {
  id: string
  text: string
  kind: 'action' | 'core' | 'modifier'
  labelZh: string
}

export type ComposeSegment =
  | { type: 'fixed'; text: string }
  | { type: 'slot'; slotIndex: number; answerId: string }

export interface ComposeChallenge {
  // The full sentence split into fixed text (connectors/punctuation) and the
  // slots that the chunks must fill, in reading order.
  segments: ComposeSegment[]
  slotCount: number
  // Correct chunk id for each slot, indexed by slotIndex.
  answerBySlot: string[]
  // Chunks that have a slot — the draggable word bank.
  chunks: ComposeChunk[]
  fullSentenceEn: string
  fullSentenceZh: string
}

interface ChunkRange {
  start: number
  end: number
  chunkId: string
}

// Locate each chunk's first non-overlapping occurrence in the full sentence.
// Longer chunks match first so a short word ("the") can't claim a position
// inside a longer chunk ("the patch").
function locateChunkRanges(
  sentence: string,
  chunks: ComposeChunk[],
): ChunkRange[] {
  const normalized = sentence.toLowerCase()
  const ranges: ChunkRange[] = []

  const ordered = [...chunks].sort(
    (left, right) => right.text.trim().length - left.text.trim().length,
  )

  for (const chunk of ordered) {
    const needle = chunk.text.trim().toLowerCase()

    if (!needle) {
      continue
    }

    let from = normalized.indexOf(needle)

    while (from >= 0) {
      const end = from + needle.length
      const overlaps = ranges.some(
        (range) => from < range.end && end > range.start,
      )

      if (!overlaps) {
        ranges.push({ start: from, end, chunkId: chunk.id })
        break
      }

      from = normalized.indexOf(needle, end)
    }
  }

  return ranges.sort((left, right) => left.start - right.start)
}

export function buildComposeChallenge(path: VerbPath): ComposeChallenge | null {
  const growth = path.growth
  const sentence = path.fullSentenceEn.trim()

  if (!growth || growth.nodes.length === 0 || !sentence) {
    return null
  }

  const chunks: ComposeChunk[] = growth.nodes.map((node) => ({
    id: node.id,
    text: node.text.trim(),
    kind: node.kind,
    labelZh: node.labelZh?.trim() ?? '',
  }))

  const ranges = locateChunkRanges(sentence, chunks)

  if (ranges.length < 2) {
    return null
  }

  const segments: ComposeSegment[] = []
  const answerBySlot: string[] = []
  let cursor = 0

  ranges.forEach((range, slotIndex) => {
    if (range.start > cursor) {
      segments.push({ type: 'fixed', text: sentence.slice(cursor, range.start) })
    }

    segments.push({ type: 'slot', slotIndex, answerId: range.chunkId })
    answerBySlot[slotIndex] = range.chunkId
    cursor = range.end
  })

  if (cursor < sentence.length) {
    segments.push({ type: 'fixed', text: sentence.slice(cursor) })
  }

  // Only chunks that earned a slot are playable; keep the bank in sync.
  const slottedIds = new Set(answerBySlot)
  const playableChunks = chunks.filter((chunk) => slottedIds.has(chunk.id))

  return {
    segments,
    slotCount: answerBySlot.length,
    answerBySlot,
    chunks: playableChunks,
    fullSentenceEn: sentence,
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

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

// —— Cloze (typing) challenge: the same sentence, but only a few important
// chunks are blanked out for the learner to type; the rest stays as fixed text.

export type ClozeSegment =
  | { type: 'fixed'; text: string }
  | { type: 'blank'; blankIndex: number; answer: string; kind: ComposeChunk['kind'] }

export interface ClozeChallenge {
  segments: ClozeSegment[]
  blankCount: number
  answers: string[]
  fullSentenceEn: string
  fullSentenceZh: string
}

// Pick the most teach-worthy chunks (action first, then core, then modifier),
// capped at 2–5 — the rest stay visible as context.
function pickBlankChunks(chunks: ComposeChunk[]): ComposeChunk[] {
  const priority: Record<ComposeChunk['kind'], number> = {
    action: 0,
    core: 1,
    modifier: 2,
  }

  const ordered = [...chunks].sort(
    (left, right) => priority[left.kind] - priority[right.kind],
  )

  return ordered.slice(0, Math.min(5, chunks.length))
}

export function buildClozeChallenge(path: VerbPath): ClozeChallenge | null {
  const growth = path.growth
  const sentence = path.fullSentenceEn.trim()

  if (!growth || growth.nodes.length === 0 || !sentence) {
    return null
  }

  const chunks: ComposeChunk[] = growth.nodes.map((node) => ({
    id: node.id,
    text: node.text.trim(),
    kind: node.kind,
    labelZh: node.labelZh?.trim() ?? '',
  }))

  if (chunks.length < 2) {
    return null
  }

  const blankChunks = pickBlankChunks(chunks)
  const ranges = locateChunkRanges(sentence, blankChunks)

  if (ranges.length < 2) {
    return null
  }

  const chunkById = new Map(chunks.map((chunk) => [chunk.id, chunk]))
  const segments: ClozeSegment[] = []
  const answers: string[] = []
  let cursor = 0

  ranges.forEach((range, blankIndex) => {
    if (range.start > cursor) {
      segments.push({ type: 'fixed', text: sentence.slice(cursor, range.start) })
    }

    const chunk = chunkById.get(range.chunkId)
    const answer = chunk?.text ?? sentence.slice(range.start, range.end)

    segments.push({
      type: 'blank',
      blankIndex,
      answer,
      kind: chunk?.kind ?? 'core',
    })
    answers[blankIndex] = answer
    cursor = range.end
  })

  if (cursor < sentence.length) {
    segments.push({ type: 'fixed', text: sentence.slice(cursor) })
  }

  return {
    segments,
    blankCount: ranges.length,
    answers,
    fullSentenceEn: sentence,
    fullSentenceZh: path.fullSentenceZh.trim(),
  }
}
