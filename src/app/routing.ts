export type ViewId =
  | 'roadmap'
  | 'strategy'
  | 'verbs'
  | 'examples'
  | 'vocabulary'
  | 'library'
  | 'login'
  | 'register'
  | 'admin'

export type NavigationViewId = 'strategy' | 'verbs' | 'examples' | 'vocabulary'

export function getVerbLookupFromPath(pathname: string) {
  if (!pathname.startsWith('/verbs/')) {
    return ''
  }

  return decodeURIComponent(pathname.replace('/verbs/', '').split('/')[0] ?? '')
}

export function getVocabularyLookupFromPath(pathname: string) {
  if (!pathname.startsWith('/vocabulary/')) {
    return ''
  }

  return decodeURIComponent(
    pathname.replace('/vocabulary/', '').split('/')[0] ?? '',
  )
}

export function getViewFromPath(pathname: string): ViewId {
  if (pathname.startsWith('/admin')) {
    return 'admin'
  }

  if (pathname.startsWith('/login')) {
    return 'login'
  }

  if (pathname.startsWith('/register') || pathname.startsWith('/signup')) {
    return 'register'
  }

  if (pathname.startsWith('/strategy')) {
    return 'strategy'
  }

  if (pathname.startsWith('/verbs')) {
    return 'verbs'
  }

  if (pathname.startsWith('/examples')) {
    return 'examples'
  }

  if (pathname.startsWith('/vocabulary')) {
    return 'vocabulary'
  }

  if (pathname.startsWith('/library')) {
    return 'library'
  }

  return 'roadmap'
}

export function getPathFromView(view: ViewId): string {
  const pathByView: Partial<Record<ViewId, string>> = {
    admin: '/admin',
    strategy: '/strategy',
    verbs: '/verbs',
    examples: '/examples',
    vocabulary: '/vocabulary',
    library: '/library',
    login: '/login',
    register: '/register',
  }

  return pathByView[view] ?? '/'
}

export function isAuthView(view: ViewId): view is 'login' | 'register' {
  return view === 'login' || view === 'register'
}
