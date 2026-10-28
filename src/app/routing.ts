export type ViewId =
  | 'roadmap'
  | 'strategy'
  | 'verbs'
  | 'examples'
  | 'vocabulary'
  | 'ielts'

export type NavigationViewId =
  | 'strategy'
  | 'verbs'
  | 'examples'
  | 'vocabulary'
  | 'ielts'

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

  if (pathname === '/ielts' || pathname.startsWith('/ielts/')) {
    return 'ielts'
  }

  return 'roadmap'
}

export function getPathFromView(view: ViewId): string {
  const pathByView: Partial<Record<ViewId, string>> = {
    strategy: '/strategy',
    verbs: '/verbs',
    examples: '/examples',
    vocabulary: '/vocabulary',
    ielts: '/ielts',
  }

  return pathByView[view] ?? '/'
}
