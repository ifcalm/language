import type { NavigationViewId, ViewId } from '../app/routing'
import './SiteHeader.css'

const primaryNavigationItems: Array<{
  id: NavigationViewId
  label: string
}> = [
  { id: 'strategy', label: '学习策略' },
  { id: 'verbs', label: '动词' },
  { id: 'examples', label: '例句' },
  { id: 'vocabulary', label: '词汇' },
]

export interface SiteHeaderUser {
  email: string | null
  displayName: string | null
  avatarUrl: string | null
}

interface SiteHeaderProps {
  view: ViewId
  user: SiteHeaderUser | null
  isAuthLoading: boolean
  onChangeView: (view: ViewId) => void
  onOpenVocabulary: () => void
  onLogout: () => void
}

function getUserLabel(user: SiteHeaderUser) {
  return user.displayName || user.email || '已登录'
}

function getUserInitial(user: SiteHeaderUser) {
  return getUserLabel(user).trim().slice(0, 1).toUpperCase() || 'E'
}

function SiteHeader({
  view,
  user,
  isAuthLoading,
  onChangeView,
  onOpenVocabulary,
  onLogout,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button
          type="button"
          className="site-brand"
          onClick={() => onChangeView('roadmap')}
          aria-label="返回 English Orbit 首页"
        >
          <img
            className="brand-icon"
            src="/brand/beaver-head-128.png"
            alt=""
            width="40"
            height="40"
            decoding="async"
          />
        </button>

        <nav className="site-nav" aria-label="主导航">
          {primaryNavigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? 'active' : ''}
              onClick={() => {
                if (item.id === 'vocabulary') {
                  onOpenVocabulary()
                }

                onChangeView(item.id)
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="site-auth-actions" aria-label="账户入口">
          {isAuthLoading && <span className="site-auth-placeholder" aria-hidden="true" />}

          {!isAuthLoading && user && (
            <>
              <span className="site-user">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    width="28"
                    height="28"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="site-user-fallback" aria-hidden="true">
                    {getUserInitial(user)}
                  </span>
                )}
                <span className="site-user-name">{getUserLabel(user)}</span>
              </span>
              <span aria-hidden="true">/</span>
              <button type="button" onClick={onLogout}>
                退出
              </button>
            </>
          )}

          {!isAuthLoading && !user && (
            <>
              <button type="button" onClick={() => onChangeView('login')}>
                登录
              </button>
              <span aria-hidden="true">/</span>
              <button type="button" onClick={() => onChangeView('register')}>
                注册
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
