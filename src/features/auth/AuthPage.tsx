import {
  type FormEvent,
  useState,
} from 'react'
import type { ViewId } from '../../app/routing'
import './auth.css'

type AuthMode = 'login' | 'register'
type AuthStep = 'email' | 'code'

interface AuthApiResponse {
  ok?: boolean
  error?: string
  message?: string
}

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

async function requestAuthApi(path: string, payload: Record<string, string>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const data = (await response.json()) as AuthApiResponse

  if (!response.ok) {
    throw new Error(data.error || '请求失败，请稍后重试')
  }

  return data
}

function getAuthErrorFromUrl() {
  if (typeof window === 'undefined') {
    return ''
  }

  return new URLSearchParams(window.location.search).get('auth_error') ?? ''
}

function AuthPage({ mode, onChangeView }: AuthPageProps) {
  const authPage = authPages[mode]
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<AuthStep>('email')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(getAuthErrorFromUrl)

  const providerRedirect = (provider: 'github' | 'google') => {
    const params = new URLSearchParams({
      mode,
      redirectTo: '/',
    })
    window.location.assign(`/api/auth/${provider}/start?${params.toString()}`)
  }

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      if (step === 'email') {
        const data = await requestAuthApi('/api/auth/email/start', { email })
        setStep('code')
        setMessage(data.message || '验证码已发送，请查看邮箱')
        return
      }

      await requestAuthApi('/api/auth/email/verify', { email, code })
      window.location.assign('/')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '请求失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const changeMode = () => {
    setEmail('')
    setCode('')
    setStep('email')
    setMessage('')
    setError('')
    onChangeView(authPage.switchView)
  }

  const primaryLabel = step === 'code' ? '完成登录' : authPage.emailAction

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

      <form className="auth-card" onSubmit={submitEmail}>
        <label htmlFor="auth-email">邮箱</label>
        <input
          id="auth-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="你的邮箱地址"
          value={email}
          disabled={step === 'code' || isSubmitting}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {step === 'code' && (
          <>
            <label htmlFor="auth-code">验证码</label>
            <input
              id="auth-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="6 位验证码"
              value={code}
              disabled={isSubmitting}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </>
        )}

        {message && <p className="auth-message">{message}</p>}
        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-primary-button" disabled={isSubmitting}>
          {isSubmitting ? '处理中…' : primaryLabel}
        </button>

        {step === 'code' && (
          <button
            type="button"
            className="auth-text-button"
            disabled={isSubmitting}
            onClick={() => {
              setStep('email')
              setCode('')
              setMessage('')
              setError('')
            }}
          >
            换一个邮箱
          </button>
        )}

        <div className="auth-divider">
          <span>或</span>
        </div>

        <button
          type="button"
          className="auth-provider-button"
          disabled={isSubmitting}
          onClick={() => providerRedirect('google')}
        >
          <span aria-hidden="true">G</span>
          {authPage.googleAction}
        </button>
        <button
          type="button"
          className="auth-provider-button"
          disabled={isSubmitting}
          onClick={() => providerRedirect('github')}
        >
          <span aria-hidden="true">⌘</span>
          {authPage.githubAction}
        </button>

        <footer className="auth-switch">
          <span>{authPage.switchText}</span>
          <button type="button" onClick={changeMode}>
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
