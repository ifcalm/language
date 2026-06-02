import { useEffect, useRef, useState } from 'react'
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
  return user.displayName || user.email?.split('@')[0] || '已登录'
}

function SiteHeader({
  view,
  user,
  isAuthLoading,
  onChangeView,
  onOpenVocabulary,
  onLogout,
}: SiteHeaderProps) {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsAccountMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAccountMenuOpen])

  const closeAccountMenu = () => setIsAccountMenuOpen(false)

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
            <div className="site-account" ref={accountMenuRef}>
              <button
                type="button"
                className="site-account-trigger"
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
              >
                <span className="site-account-avatar">
                  <img
                    src={user.avatarUrl || '/brand/beaver-head-128.png'}
                    alt=""
                    width="40"
                    height="40"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </span>
                <span className="site-account-caret" aria-hidden="true" />
                <span className="sr-only">打开账户菜单</span>
              </button>

              {isAccountMenuOpen && (
                <div className="site-account-menu" role="menu">
                  <div className="site-account-summary">
                    <strong>{getUserLabel(user)}</strong>
                    {user.email && <span>{user.email}</span>}
                  </div>

                  <div className="site-account-menu-items">
                    <button type="button" role="menuitem" onClick={closeAccountMenu}>
                      我的记录
                    </button>
                    <button type="button" role="menuitem" onClick={closeAccountMenu}>
                      设置
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsAccountMenuOpen(false)
                        onLogout()
                      }}
                    >
                      退出
                    </button>
                  </div>
                </div>
              )}
            </div>
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
