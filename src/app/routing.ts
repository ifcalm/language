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

  return 'roadmap'
}

export function getPathFromView(view: ViewId): string {
  const pathByView: Partial<Record<ViewId, string>> = {
    admin: '/admin',
    login: '/login',
    register: '/register',
  }

  return pathByView[view] ?? '/'
}

export function isAuthView(view: ViewId): view is 'login' | 'register' {
  return view === 'login' || view === 'register'
}
