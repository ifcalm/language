import { withEdgeCache } from './shared/cache'
import { makeJsonResponse } from './shared/http'
import {
  handlePracticeSentences,
  handleVocabularyDetail,
  handleVocabularyList,
  handleVocabularyPronunciations,
} from './vocabulary/publicRoutes'
import { handleVerbDetail, handleVerbList } from './verbs/routes'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const isGet = request.method === 'GET'

    if (url.pathname === '/api/health') {
      return makeJsonResponse({
        ok: true,
        service: 'english-orbit',
      })
    }

    if (url.pathname.startsWith('/api/auth/')) {
      return makeJsonResponse(
        { error: 'Account registration and login are no longer available.' },
        {
          status: 410,
          headers: {
            'Set-Cookie': 'eo_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
          },
        },
      )
    }

    if (url.pathname === '/api/verbs' && isGet) {
      return withEdgeCache(request, ctx, () => handleVerbList(request, env))
    }

    if (url.pathname.startsWith('/api/verbs/') && isGet) {
      return withEdgeCache(request, ctx, () => handleVerbDetail(request, env))
    }

    if (url.pathname === '/api/practice/sentences' && isGet) {
      return withEdgeCache(request, ctx, () => handlePracticeSentences(request, env))
    }

    if (url.pathname === '/api/vocabulary' && isGet) {
      return withEdgeCache(request, ctx, () => handleVocabularyList(request, env))
    }

    if (url.pathname === '/api/vocabulary/pronunciations' && isGet) {
      return withEdgeCache(request, ctx, () =>
        handleVocabularyPronunciations(request, env),
      )
    }

    if (url.pathname.startsWith('/api/vocabulary/') && isGet) {
      return withEdgeCache(request, ctx, () => handleVocabularyDetail(request, env))
    }

    if (url.pathname.startsWith('/api/')) {
      return makeJsonResponse({ error: 'Not Found' }, { status: 404 })
    }

    const assetResponse = await env.ASSETS.fetch(request)
    if (!/(?:^|;\s*)eo_session=/.test(request.headers.get('Cookie') ?? '')) {
      return assetResponse
    }

    const headers = new Headers(assetResponse.headers)
    headers.append(
      'Set-Cookie',
      'eo_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
    )
    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    })
  },
} satisfies ExportedHandler<Env>
