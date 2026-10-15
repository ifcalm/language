// The D1 database lives in North America while most visitors reach the Worker
// through an Asian edge, so every uncached query costs a trans-Pacific round
// trip. Public content only changes when the data scripts run, which makes
// these GET responses safe to keep at the edge and in the browser.
//
// Bump CACHE_VERSION after changing D1 content to invalidate the edge copies
// immediately; browsers pick the change up once BROWSER_TTL_SECONDS expires.
const CACHE_VERSION = '1'
const EDGE_TTL_SECONDS = 60 * 60 * 24
const BROWSER_TTL_SECONDS = 60 * 5

export async function withEdgeCache(
  request: Request,
  ctx: ExecutionContext,
  produce: () => Promise<Response>,
) {
  const keyUrl = new URL(request.url)
  keyUrl.searchParams.set('_cv', CACHE_VERSION)
  const cacheKey = new Request(keyUrl.toString(), { method: 'GET' })
  // `default` is a Workers-only extension the DOM lib typings don't declare.
  const cache = (caches as unknown as { default: Cache }).default

  const cached = await cache.match(cacheKey)
  if (cached) {
    const hit = new Response(cached.body, cached)
    hit.headers.set('X-Edge-Cache', 'HIT')
    return hit
  }

  const response = await produce()
  if (response.status !== 200) {
    return response
  }

  const fresh = new Response(response.body, response)
  fresh.headers.set(
    'Cache-Control',
    `public, max-age=${BROWSER_TTL_SECONDS}, s-maxage=${EDGE_TTL_SECONDS}`,
  )
  fresh.headers.set('X-Edge-Cache', 'MISS')
  ctx.waitUntil(cache.put(cacheKey, fresh.clone()))
  return fresh
}
