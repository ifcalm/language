import { useCallback, useState } from 'react'

// Mastered entries live only in this browser: { [entryId]: topicId }.
// Keeping the topic id lets the overview count progress per module and topic
// without downloading the module data.
const STORAGE_KEY = 'ielts-mastered-v1'

type MasteredMap = Record<string, string>

function readMastered(): MasteredMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? (parsed as MasteredMap) : {}
  } catch {
    return {}
  }
}

function writeMastered(mastered: MasteredMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mastered))
  } catch {
    // Private mode or blocked storage: progress just won't persist.
  }
}

export function useIeltsProgress() {
  const [mastered, setMastered] = useState<MasteredMap>(readMastered)

  const toggleMastered = useCallback((entryId: string, topicId: string) => {
    setMastered((current) => {
      const next = { ...current }

      if (next[entryId]) {
        delete next[entryId]
      } else {
        next[entryId] = topicId
      }

      writeMastered(next)
      return next
    })
  }, [])

  const countMastered = useCallback(
    (prefix: string) =>
      Object.values(mastered).filter(
        (topicId) => topicId === prefix || topicId.startsWith(`${prefix}-`),
      ).length,
    [mastered],
  )

  return {
    isMastered: (entryId: string) => Boolean(mastered[entryId]),
    toggleMastered,
    countMastered,
  }
}

export type IeltsProgress = ReturnType<typeof useIeltsProgress>
