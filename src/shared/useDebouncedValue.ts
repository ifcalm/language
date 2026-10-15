import { useEffect, useState } from 'react'

// Search boxes use this so a request is sent once typing pauses, not on every
// keystroke; each request is a database round trip.
export function useDebouncedValue<T>(value: T, delayMs = 250) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
