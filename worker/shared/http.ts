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

// Reads the part of the path after `prefix`. Returns null for a broken escape
// such as "%E0%A4%A", which decodeURIComponent rejects by throwing.
export const readPathLookup = (request: Request, prefix: string) => {
  try {
    return decodeURIComponent(new URL(request.url).pathname.slice(prefix.length))
  } catch {
    return null
  }
}
