import { handleAuthRequest } from './auth'
import { handleSentenceAnalyze } from './analysis/routes'
import { makeJsonResponse } from './shared/http'
import {
  handleAdminVocabularyDetail,
  handleAdminVocabularySave,
} from './vocabulary/adminRoutes'
import {
  handleVocabularyDetail,
  handleVocabularyList,
  handleVocabularyPronunciations,
} from './vocabulary/publicRoutes'
import { handleVerbDetail, handleVerbList } from './verbs/routes'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return makeJsonResponse({
        ok: true,
        service: 'english-orbit',
      })
    }

    if (url.pathname.startsWith('/api/auth/')) {
      return handleAuthRequest(request, env)
    }

    if (url.pathname === '/api/analyze' && request.method === 'POST') {
      return handleSentenceAnalyze(request, env)
    }

    if (url.pathname === '/api/verbs' && request.method === 'GET') {
      return handleVerbList(request, env)
    }

    if (url.pathname.startsWith('/api/verbs/') && request.method === 'GET') {
      return handleVerbDetail(request, env)
    }

    if (url.pathname === '/api/vocabulary' && request.method === 'GET') {
      return handleVocabularyList(request, env)
    }

    if (
      url.pathname === '/api/vocabulary/pronunciations' &&
      request.method === 'GET'
    ) {
      return handleVocabularyPronunciations(request, env)
    }

    if (url.pathname.startsWith('/api/vocabulary/') && request.method === 'GET') {
      return handleVocabularyDetail(request, env)
    }

    if (url.pathname === '/api/admin/vocabulary' && request.method === 'GET') {
      return handleVocabularyList(request, env)
    }

    if (url.pathname.startsWith('/api/admin/vocabulary/')) {
      if (request.method === 'GET') {
        return handleAdminVocabularyDetail(request, env)
      }

      if (request.method === 'PUT') {
        return handleAdminVocabularySave(request, env)
      }
    }

    if (url.pathname.startsWith('/api/')) {
      return makeJsonResponse({ error: 'Not Found' }, { status: 404 })
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
