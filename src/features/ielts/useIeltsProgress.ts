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

  // topics.json can move an entry to another topic (or renumber topics) after it
  // was mastered. Once a module's entries are loaded, point the mastered ones at
  // their current topic so the overview counts them in the right place.
  const syncTopics = useCallback(
    (entries: ReadonlyArray<{ id: string; topicId: string }>) => {
      setMastered((current) => {
        let next: MasteredMap | null = null

        for (const entry of entries) {
          const stored = current[entry.id]

          if (stored && stored !== entry.topicId) {
            if (!next) {
              next = { ...current }
            }
            next[entry.id] = entry.topicId
          }
        }

        if (!next) {
          return current
        }

        writeMastered(next)
        return next
      })
    },
    [],
  )

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
    syncTopics,
    countMastered,
  }
}

export type IeltsProgress = ReturnType<typeof useIeltsProgress>
