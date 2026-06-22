import type {
  CoreVocabularyEntry,
  VocabularyPronunciation,
} from '../../data/vocabulary'

export function getVocabularyRank(
  item: Pick<CoreVocabularyEntry, 'frequencyRank' | 'priority'>,
) {
  return item.frequencyRank ?? item.priority
}

export function getPronunciationLabel(
  pronunciation: VocabularyPronunciation,
  index: number,
) {
  const normalizedId = pronunciation.id.toLowerCase()

  if (normalizedId.endsWith('-us') || normalizedId.includes('-us-')) {
    return 'US'
  }

  if (normalizedId.endsWith('-uk') || normalizedId.includes('-uk-')) {
    return 'UK'
  }

  return `读音 ${index + 1}`
}

export function getPronunciationKey(
  item: Pick<CoreVocabularyEntry, 'id'>,
  pronunciation: Pick<VocabularyPronunciation, 'id'>,
) {
  return `${item.id}-${pronunciation.id}`
}

export function getPrimaryPronunciation(item: {
  pronunciations?: VocabularyPronunciation[]
}) {
  const pronunciations = item.pronunciations ?? []

  return (
    pronunciations.find((pronunciation) => {
      const normalizedId = pronunciation.id.toLowerCase()
      return normalizedId.endsWith('-us') || normalizedId.includes('-us-')
    }) ??
    pronunciations[0] ??
    null
  )
}

// Highlight the target word and common inflections inside an example.
export function highlightTargetWord(sentence: string, word: string) {
  const base = word.trim()

  if (!base) {
    return sentence
  }

  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const splitter = new RegExp(`(\\b${escaped}(?:s|es|ed|ing|d)?\\b)`, 'gi')
  const tester = new RegExp(`^${escaped}(?:s|es|ed|ing|d)?$`, 'i')

  return sentence
    .split(splitter)
    .map((part, index) =>
      tester.test(part) ? <mark key={index}>{part}</mark> : part,
    )
}

