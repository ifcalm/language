export const clampNumber = (
  value: string | null,
  fallback: number,
  min: number,
  max: number,
) => {
  if (value === null || value.trim() === '') {
    return fallback
  }

  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(max, Math.max(min, Math.floor(parsed)))
}

export const nowIso = () => new Date().toISOString()

export const normalizeText = (value: unknown, fallback = '') => {
  if (typeof value !== 'string') {
    return fallback
  }

  return value.trim()
}

export const makeJsonResponse = (payload: unknown, init?: ResponseInit) =>
  Response.json(payload, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init?.headers ?? {}),
    },
  })

export const makeErrorResponse = (message: string, status = 400) =>
  makeJsonResponse({ error: message }, { status })
