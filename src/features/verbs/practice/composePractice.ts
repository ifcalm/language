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

// —— Cloze (typing) challenge: the same sentence with a few important *words*
// blanked out for the learner to type; everything else stays as fixed text.

export type ClozeSegment =
  | { type: 'fixed'; text: string }
  | { type: 'blank'; blankIndex: number; answer: string }

export interface ClozeChallenge {
  segments: ClozeSegment[]
  blankCount: number
  answers: string[]
  fullSentenceEn: string
  fullSentenceZh: string
}

// High-frequency function words that aren't worth blanking out.
const CLOZE_STOPWORDS = new Set([
  'a', 'an', 'the', 'this', 'that', 'these', 'those',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'as', 'into',
  'about', 'over', 'under', 'than',
  'and', 'or', 'but', 'nor', 'so', 'yet',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
  'do', 'does', 'did', 'done',
  'have', 'has', 'had',
  'will', 'would', 'can', 'could', 'shall', 'should', 'may', 'might', 'must',
  'not', 'no',
  'it', 'its', 'he', 'she', 'they', 'them', 'we', 'us', 'you', 'your', 'i',
  'my', 'me', 'his', 'her', 'their', 'our',
  'when', 'while', 'because', 'if', 'whether', 'though', 'although', 'since',
  'until', 'before', 'after', 'during',
  'there', 'here', 'then', 'out', 'up', 'down',
])

interface WordToken {
  text: string
  index: number
}

function tokenizeWords(sentence: string): WordToken[] {
  const tokens: WordToken[] = []
  const regex = /[A-Za-z][A-Za-z'-]*/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(sentence)) !== null) {
    tokens.push({ text: match[0], index: match.index })
  }

  return tokens
}

// Blank count scales with sentence length (<= 40%, clamped to 1–3). Verbs get
// no special treatment — the longest content words win, so any important word
// (noun, adjective, verb…) can be chosen; pure function words are skipped.
function pickBlankWords(tokens: WordToken[]): WordToken[] {
  if (tokens.length === 0) {
    return []
  }

  const candidates = tokens.filter(
    (token) =>
      token.text.length >= 2 && !CLOZE_STOPWORDS.has(token.text.toLowerCase()),
  )
  const pool = candidates.length > 0 ? candidates : tokens

  const target = Math.max(1, Math.min(3, Math.floor(tokens.length * 0.4)))
  const count = Math.min(target, pool.length)

  return [...pool]
    .sort((left, right) => right.text.length - left.text.length)
    .slice(0, count)
    .sort((left, right) => left.index - right.index)
}

export function buildClozeChallenge(path: VerbPath): ClozeChallenge | null {
  const sentence = path.fullSentenceEn.trim()

  if (!sentence) {
    return null
  }

  const tokens = tokenizeWords(sentence)
  const blanks = pickBlankWords(tokens)

  if (blanks.length === 0) {
    return null
  }

  const segments: ClozeSegment[] = []
  const answers: string[] = []
  let cursor = 0

  blanks.forEach((token, blankIndex) => {
    if (token.index > cursor) {
      segments.push({ type: 'fixed', text: sentence.slice(cursor, token.index) })
    }

    segments.push({ type: 'blank', blankIndex, answer: token.text })
    answers[blankIndex] = token.text
    cursor = token.index + token.text.length
  })

  if (cursor < sentence.length) {
    segments.push({ type: 'fixed', text: sentence.slice(cursor) })
  }

  return {
    segments,
    blankCount: blanks.length,
    answers,
    fullSentenceEn: sentence,
    fullSentenceZh: path.fullSentenceZh.trim(),
  }
}
