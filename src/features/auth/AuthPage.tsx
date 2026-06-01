import type { ViewId } from '../../app/routing'
import './auth.css'

type AuthMode = 'login' | 'register'

const authPages = {
  login: {
    title: '登录',
    emailAction: '继续',
    googleAction: '使用 Google 继续',
    githubAction: '使用 GitHub 继续',
    switchText: '还没有账号？',
    switchAction: '注册',
    switchView: 'register' as ViewId,
  },
  register: {
    title: '注册',
    emailAction: '创建账户',
    googleAction: '使用 Google 注册',
    githubAction: '使用 GitHub 注册',
    switchText: '已经有账号？',
    switchAction: '去登录',
    switchView: 'login' as ViewId,
  },
}

interface AuthPageProps {
  mode: AuthMode
  onChangeView: (view: ViewId) => void
}

function AuthPage({ mode, onChangeView }: AuthPageProps) {
  const authPage = authPages[mode]

  return (
    <section className="auth-page" aria-label={authPage.title}>
      <button
        type="button"
        className="auth-logo"
        onClick={() => onChangeView('roadmap')}
        aria-label="返回 English Orbit 首页"
      >
        <img
          src="/brand/beaver-head-128.png"
          alt=""
          width="48"
          height="48"
          decoding="async"
        />
      </button>

      <div className="auth-title">
        <h1>{authPage.title}</h1>
      </div>

      <form className="auth-card" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="auth-email">邮箱</label>
        <input
          id="auth-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="你的邮箱地址"
        />

        <button type="submit" className="auth-primary-button" disabled>
          {authPage.emailAction}
        </button>

        <div className="auth-divider">
          <span>或</span>
        </div>

        <button type="button" className="auth-provider-button" disabled>
          <span aria-hidden="true">G</span>
          {authPage.googleAction}
        </button>
        <button type="button" className="auth-provider-button" disabled>
          <span aria-hidden="true">⌘</span>
          {authPage.githubAction}
        </button>

        <footer className="auth-switch">
          <span>{authPage.switchText}</span>
          <button type="button" onClick={() => onChangeView(authPage.switchView)}>
            {authPage.switchAction}
          </button>
        </footer>
      </form>

      <footer className="auth-legal">
        <button type="button">服务条款</button>
        <span>和</span>
        <button type="button">隐私政策</button>
      </footer>
    </section>
  )
}

export default AuthPage
