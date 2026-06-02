type AuthProvider = 'github' | 'google' | 'email'

type AuthMode = 'login' | 'register'

interface AuthEnv extends Env {
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  RESEND_API_KEY?: string
  AUTH_EMAIL_FROM?: string
  AUTH_SECRET?: string
}

interface UserRow {
  id: string
  email: string | null
  email_verified: number
  display_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
  last_login_at: string | null
}

interface AuthIdentityRow {
  id: string
  user_id: string
  provider: AuthProvider
  provider_user_id: string
  provider_username: string | null
  email: string | null
  email_verified: number
  avatar_url: string | null
  created_at: string
  updated_at: string
}

interface SessionUserRow extends UserRow {
  session_id: string
  session_expires_at: string
}

interface EmailLoginCodeRow {
  id: string
  email: string
  code_hash: string
  expires_at: string
  consumed_at: string | null
  attempts: number
  created_at: string
}

interface OAuthStateRow {
  id: string
  provider: AuthProvider
  state_hash: string
  redirect_to: string
  expires_at: string
  consumed_at: string | null
  created_at: string
}

interface ProviderProfile {
  provider: Exclude<AuthProvider, 'email'>
  providerUserId: string
  providerUsername?: string
  email?: string
  emailVerified: boolean
  displayName?: string
  avatarUrl?: string
}

interface EmailProviderProfile {
  provider: 'email'
  providerUserId: string
  providerUsername?: string
  email: string
  emailVerified: true
  displayName: string
  avatarUrl?: string
}

interface GitHubUserResponse {
  id?: number
  login?: string
  name?: string | null
  email?: string | null
  avatar_url?: string | null
}

interface GitHubEmailResponse {
  email?: string
  primary?: boolean
  verified?: boolean
}

interface GoogleTokenInfoResponse {
  sub?: string
  aud?: string
  email?: string
  email_verified?: string | boolean
  name?: string
  picture?: string
  exp?: string
  iss?: string
}

const sessionCookieName = 'eo_session'
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30
const emailCodeMaxAgeSeconds = 60 * 10
const oauthStateMaxAgeSeconds = 60 * 10
const maxEmailCodeAttempts = 5

const jsonHeaders = {
  'Cache-Control': 'no-store',
}

const makeAuthJsonResponse = (payload: unknown, init?: ResponseInit) =>
  Response.json(payload, {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init?.headers ?? {}),
    },
  })

const makeAuthErrorResponse = (message: string, status = 400) =>
  makeAuthJsonResponse({ error: message }, { status })

const nowIso = () => new Date().toISOString()

const addSeconds = (seconds: number) =>
  new Date(Date.now() + seconds * 1000).toISOString()

const textEncoder = new TextEncoder()

function normalizeEmail(email: unknown) {
  if (typeof email !== 'string') {
    return ''
  }

  return email.trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getOrigin(request: Request) {
  return new URL(request.url).origin
}

function getSafeRedirectTo(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/'
  }

  return value
}

function getMode(value: string | null): AuthMode {
  return value === 'register' ? 'register' : 'login'
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function randomToken(byteLength = 32) {
  const bytes = new Uint8Array(byteLength)
  crypto.getRandomValues(bytes)
  return toBase64Url(bytes)
}

function randomNumericCode(length = 6) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => String(byte % 10)).join('')
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(value))
  return toBase64Url(new Uint8Array(digest))
}

async function hashEmailCode(env: AuthEnv, email: string, code: string) {
  const secret = env.AUTH_SECRET

  if (!secret) {
    throw new Error('AUTH_SECRET is required for email login')
  }

  return sha256(`${email}:${code}:${secret}`)
}

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get('Cookie') ?? ''
  const pairs = cookie.split(';')

  for (const pair of pairs) {
    const [rawKey, ...rawValue] = pair.trim().split('=')

    if (rawKey === name) {
      return decodeURIComponent(rawValue.join('='))
    }
  }

  return ''
}

function makeSessionCookie(request: Request, token: string) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${sessionCookieName}=${encodeURIComponent(token)}; Max-Age=${sessionMaxAgeSeconds}; Path=/; HttpOnly; SameSite=Lax${secure}`
}

function makeExpiredSessionCookie(request: Request) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${sessionCookieName}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`
}

function mapUser(row: UserRow) {
  return {
    id: row.id,
    email: row.email,
    emailVerified: Boolean(row.email_verified),
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
  }
}

async function createSession(request: Request, env: AuthEnv, userId: string) {
  const token = randomToken(32)
  const tokenHash = await sha256(token)
  const createdAt = nowIso()
  const expiresAt = addSeconds(sessionMaxAgeSeconds)

  await env.DB.prepare(
    `INSERT INTO auth_sessions (
      id,
      user_id,
      token_hash,
      expires_at,
      created_at,
      last_seen_at,
      user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      crypto.randomUUID(),
      userId,
      tokenHash,
      expiresAt,
      createdAt,
      createdAt,
      request.headers.get('User-Agent') ?? null,
    )
    .run()

  return token
}

async function getSessionUser(request: Request, env: AuthEnv) {
  const token = readCookie(request, sessionCookieName)

  if (!token) {
    return null
  }

  const tokenHash = await sha256(token)
  const row = await env.DB.prepare(
    `SELECT
      users.id,
      users.email,
      users.email_verified,
      users.display_name,
      users.avatar_url,
      users.role,
      users.created_at,
      users.updated_at,
      users.last_login_at,
      auth_sessions.id AS session_id,
      auth_sessions.expires_at AS session_expires_at
    FROM auth_sessions
    INNER JOIN users ON users.id = auth_sessions.user_id
    WHERE auth_sessions.token_hash = ?
      AND auth_sessions.expires_at > ?
    LIMIT 1`,
  )
    .bind(tokenHash, nowIso())
    .first<SessionUserRow>()

  return row
}

async function createOAuthState(
  env: AuthEnv,
  provider: Exclude<AuthProvider, 'email'>,
  redirectTo: string,
) {
  const state = randomToken(32)
  const stateHash = await sha256(state)

  await env.DB.prepare(
    `INSERT INTO auth_oauth_states (
      id,
      provider,
      state_hash,
      redirect_to,
      expires_at,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      crypto.randomUUID(),
      provider,
      stateHash,
      redirectTo,
      addSeconds(oauthStateMaxAgeSeconds),
      nowIso(),
    )
    .run()

  return state
}

async function consumeOAuthState(
  env: AuthEnv,
  provider: Exclude<AuthProvider, 'email'>,
  state: string,
) {
  const stateHash = await sha256(state)
  const row = await env.DB.prepare(
    `SELECT id, provider, state_hash, redirect_to, expires_at, consumed_at, created_at
    FROM auth_oauth_states
    WHERE provider = ?
      AND state_hash = ?
      AND expires_at > ?
      AND consumed_at IS NULL
    LIMIT 1`,
  )
    .bind(provider, stateHash, nowIso())
    .first<OAuthStateRow>()

  if (!row) {
    return null
  }

  await env.DB.prepare(
    `UPDATE auth_oauth_states
    SET consumed_at = ?
    WHERE id = ?`,
  )
    .bind(nowIso(), row.id)
    .run()

  return row
}

async function createOrUpdateUserForProvider(
  env: AuthEnv,
  profile: ProviderProfile | EmailProviderProfile,
) {
  const existingIdentity = await env.DB.prepare(
    `SELECT
      id,
      user_id,
      provider,
      provider_user_id,
      provider_username,
      email,
      email_verified,
      avatar_url,
      created_at,
      updated_at
    FROM auth_identities
    WHERE provider = ?
      AND provider_user_id = ?
    LIMIT 1`,
  )
    .bind(profile.provider, profile.providerUserId)
    .first<AuthIdentityRow>()

  const updatedAt = nowIso()
  const email = profile.email ?? null
  const emailVerified = profile.emailVerified ? 1 : 0
  const displayName = profile.displayName || profile.providerUsername || email || null
  const avatarUrl = profile.avatarUrl ?? null
  const providerUsername = profile.providerUsername ?? null

  if (existingIdentity) {
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE auth_identities
        SET provider_username = ?,
            email = ?,
            email_verified = ?,
            avatar_url = ?,
            updated_at = ?
        WHERE id = ?`,
      ).bind(
        providerUsername,
        email,
        emailVerified,
        avatarUrl,
        updatedAt,
        existingIdentity.id,
      ),
      env.DB.prepare(
        `UPDATE users
        SET email = COALESCE(?, email),
            email_verified = CASE WHEN ? = 1 THEN 1 ELSE email_verified END,
            display_name = COALESCE(?, display_name),
            avatar_url = COALESCE(?, avatar_url),
            updated_at = ?,
            last_login_at = ?
        WHERE id = ?`,
      ).bind(
        email,
        emailVerified,
        displayName,
        avatarUrl,
        updatedAt,
        updatedAt,
        existingIdentity.user_id,
      ),
    ])

    const user = await env.DB.prepare(
      `SELECT id, email, email_verified, display_name, avatar_url, role, created_at, updated_at, last_login_at
      FROM users
      WHERE id = ?`,
    )
      .bind(existingIdentity.user_id)
      .first<UserRow>()

    if (!user) {
      throw new Error('User not found for existing identity')
    }

    return user
  }

  const userId = crypto.randomUUID()
  const identityId = crypto.randomUUID()

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO users (
        id,
        email,
        email_verified,
        display_name,
        avatar_url,
        role,
        created_at,
        updated_at,
        last_login_at
      ) VALUES (?, ?, ?, ?, ?, 'user', ?, ?, ?)`,
    ).bind(
      userId,
      email,
      emailVerified,
      displayName,
      avatarUrl,
      updatedAt,
      updatedAt,
      updatedAt,
    ),
    env.DB.prepare(
      `INSERT INTO auth_identities (
        id,
        user_id,
        provider,
        provider_user_id,
        provider_username,
        email,
        email_verified,
        avatar_url,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      identityId,
      userId,
      profile.provider,
      profile.providerUserId,
      providerUsername,
      email,
      emailVerified,
      avatarUrl,
      updatedAt,
      updatedAt,
    ),
  ])

  const user = await env.DB.prepare(
    `SELECT id, email, email_verified, display_name, avatar_url, role, created_at, updated_at, last_login_at
    FROM users
    WHERE id = ?`,
  )
    .bind(userId)
    .first<UserRow>()

  if (!user) {
    throw new Error('User was not created')
  }

  return user
}

async function exchangeOAuthCode(
  tokenUrl: string,
  body: Record<string, string>,
) {
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body),
  })

  if (!response.ok) {
    throw new Error(`OAuth token exchange failed with ${response.status}`)
  }

  const payload = (await response.json()) as { access_token?: string; id_token?: string }

  if (!payload.access_token && !payload.id_token) {
    throw new Error('OAuth token response is missing token')
  }

  return payload
}

async function getGitHubProfile(accessToken: string): Promise<ProviderProfile> {
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'English-Orbit',
    },
  })

  if (!userResponse.ok) {
    throw new Error(`GitHub user API failed with ${userResponse.status}`)
  }

  const user = (await userResponse.json()) as GitHubUserResponse

  if (!user.id) {
    throw new Error('GitHub profile is missing id')
  }

  let email = user.email ?? undefined
  let emailVerified = Boolean(email)

  const emailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'English-Orbit',
    },
  })

  if (emailResponse.ok) {
    const emails = (await emailResponse.json()) as GitHubEmailResponse[]
    const primaryVerifiedEmail = emails.find((item) => item.primary && item.verified)
    const firstVerifiedEmail = emails.find((item) => item.verified)
    const selectedEmail = primaryVerifiedEmail ?? firstVerifiedEmail

    if (selectedEmail?.email) {
      email = selectedEmail.email
      emailVerified = true
    }
  }

  return {
    provider: 'github',
    providerUserId: String(user.id),
    providerUsername: user.login,
    email,
    emailVerified,
    displayName: user.name ?? user.login,
    avatarUrl: user.avatar_url ?? undefined,
  }
}

async function getGoogleProfile(
  env: AuthEnv,
  idToken: string,
): Promise<ProviderProfile> {
  const tokenInfoResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
  )

  if (!tokenInfoResponse.ok) {
    throw new Error(`Google tokeninfo API failed with ${tokenInfoResponse.status}`)
  }

  const tokenInfo = (await tokenInfoResponse.json()) as GoogleTokenInfoResponse
  const expiresAt = Number(tokenInfo.exp ?? 0) * 1000

  if (!tokenInfo.sub) {
    throw new Error('Google token is missing sub')
  }

  if (tokenInfo.aud !== env.GOOGLE_CLIENT_ID) {
    throw new Error('Google token audience mismatch')
  }

  if (expiresAt && expiresAt < Date.now()) {
    throw new Error('Google token is expired')
  }

  return {
    provider: 'google',
    providerUserId: tokenInfo.sub,
    email: tokenInfo.email,
    emailVerified: tokenInfo.email_verified === true || tokenInfo.email_verified === 'true',
    displayName: tokenInfo.name ?? tokenInfo.email,
    avatarUrl: tokenInfo.picture,
  }
}

async function redirectWithSession(
  request: Request,
  env: AuthEnv,
  user: UserRow,
  redirectTo: string,
) {
  const token = await createSession(request, env, user.id)
  return new Response(null, {
    status: 302,
    headers: {
      'Location': `${getOrigin(request)}${getSafeRedirectTo(redirectTo)}`,
      'Set-Cookie': makeSessionCookie(request, token),
    },
  })
}

function redirectToAuthError(request: Request, mode: AuthMode, message: string) {
  const path = mode === 'register' ? '/register' : '/login'
  const url = new URL(path, getOrigin(request))
  url.searchParams.set('auth_error', message)
  return Response.redirect(url.toString(), 302)
}

async function handleOAuthStart(
  request: Request,
  env: AuthEnv,
  provider: Exclude<AuthProvider, 'email'>,
) {
  const url = new URL(request.url)
  const redirectTo = getSafeRedirectTo(url.searchParams.get('redirectTo'))

  if (provider === 'github' && (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET)) {
    return makeAuthErrorResponse('GitHub 登录暂未配置', 503)
  }

  if (provider === 'google' && (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)) {
    return makeAuthErrorResponse('Google 登录暂未配置', 503)
  }

  const state = await createOAuthState(env, provider, redirectTo)
  const redirectUri = `${getOrigin(request)}/api/auth/${provider}/callback`

  if (provider === 'github') {
    const clientId = env.GITHUB_CLIENT_ID ?? ''
    const authUrl = new URL('https://github.com/login/oauth/authorize')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('scope', 'read:user user:email')

    return Response.redirect(authUrl.toString(), 302)
  }

  const googleClientId = env.GOOGLE_CLIENT_ID ?? ''
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', googleClientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'select_account')

  return Response.redirect(authUrl.toString(), 302)
}

async function handleOAuthCallback(
  request: Request,
  env: AuthEnv,
  provider: Exclude<AuthProvider, 'email'>,
) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  const mode = getMode(url.searchParams.get('mode'))

  if (error) {
    return redirectToAuthError(request, mode, '第三方登录已取消')
  }

  if (!code || !state) {
    return redirectToAuthError(request, mode, '第三方登录参数不完整')
  }

  const stateRow = await consumeOAuthState(env, provider, state)

  if (!stateRow) {
    return redirectToAuthError(request, mode, '登录状态已过期，请重试')
  }

  try {
    const redirectUri = `${getOrigin(request)}/api/auth/${provider}/callback`

    if (provider === 'github') {
      if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
        return redirectToAuthError(request, mode, 'GitHub 登录暂未配置')
      }

      const tokenPayload = await exchangeOAuthCode(
        'https://github.com/login/oauth/access_token',
        {
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
          state,
        },
      )

      if (!tokenPayload.access_token) {
        throw new Error('GitHub token response is missing access token')
      }

      const profile = await getGitHubProfile(tokenPayload.access_token)
      const user = await createOrUpdateUserForProvider(env, profile)
      return redirectWithSession(request, env, user, stateRow.redirect_to)
    }

    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      return redirectToAuthError(request, mode, 'Google 登录暂未配置')
    }

    const tokenPayload = await exchangeOAuthCode(
      'https://oauth2.googleapis.com/token',
      {
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
    )

    if (!tokenPayload.id_token) {
      throw new Error('Google token response is missing id token')
    }

    const profile = await getGoogleProfile(env, tokenPayload.id_token)
    const user = await createOrUpdateUserForProvider(env, profile)
    return redirectWithSession(request, env, user, stateRow.redirect_to)
  } catch (error) {
    console.error(error)
    return redirectToAuthError(request, mode, '登录失败，请稍后重试')
  }
}

async function sendLoginCode(env: AuthEnv, email: string, code: string) {
  if (!env.RESEND_API_KEY || !env.AUTH_EMAIL_FROM) {
    throw new Error('Email service is not configured')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.AUTH_EMAIL_FROM,
      to: email,
      subject: 'English Orbit 登录验证码',
      text: `你的 English Orbit 登录验证码是：${code}。验证码 10 分钟内有效。`,
      html: `<p>你的 English Orbit 登录验证码是：</p><p style="font-size:24px;font-weight:700;letter-spacing:4px;">${code}</p><p>验证码 10 分钟内有效。</p>`,
    }),
  })

  if (!response.ok) {
    throw new Error(`Email provider failed with ${response.status}`)
  }
}

async function readJsonObject(request: Request) {
  try {
    const payload = await request.json()

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return null
    }

    return payload as Record<string, unknown>
  } catch {
    return null
  }
}

async function handleEmailStart(request: Request, env: AuthEnv) {
  const payload = await readJsonObject(request)
  const email = normalizeEmail(payload?.email)

  if (!isValidEmail(email)) {
    return makeAuthErrorResponse('请输入有效邮箱')
  }

  if (!env.AUTH_SECRET) {
    return makeAuthErrorResponse('邮箱登录暂未配置 AUTH_SECRET', 503)
  }

  if (!env.RESEND_API_KEY || !env.AUTH_EMAIL_FROM) {
    return makeAuthErrorResponse('邮箱登录暂未配置邮件服务', 503)
  }

  const code = randomNumericCode(6)
  const codeHash = await hashEmailCode(env, email, code)
  const createdAt = nowIso()

  await env.DB.prepare(
    `INSERT INTO email_login_codes (
      id,
      email,
      code_hash,
      expires_at,
      attempts,
      created_at
    ) VALUES (?, ?, ?, ?, 0, ?)`,
  )
    .bind(
      crypto.randomUUID(),
      email,
      codeHash,
      addSeconds(emailCodeMaxAgeSeconds),
      createdAt,
    )
    .run()

  try {
    await sendLoginCode(env, email, code)
  } catch (error) {
    console.error(error)
    return makeAuthErrorResponse('验证码发送失败，请稍后重试', 502)
  }

  return makeAuthJsonResponse({ ok: true, message: '验证码已发送' })
}

async function handleEmailVerify(request: Request, env: AuthEnv) {
  const payload = await readJsonObject(request)
  const email = normalizeEmail(payload?.email)
  const code = typeof payload?.code === 'string' ? payload.code.trim() : ''

  if (!isValidEmail(email) || !/^\d{6}$/.test(code)) {
    return makeAuthErrorResponse('邮箱或验证码格式不正确')
  }

  let codeHash: string

  try {
    codeHash = await hashEmailCode(env, email, code)
  } catch {
    return makeAuthErrorResponse('邮箱登录暂未配置 AUTH_SECRET', 503)
  }

  const row = await env.DB.prepare(
    `SELECT id, email, code_hash, expires_at, consumed_at, attempts, created_at
    FROM email_login_codes
    WHERE email = ?
      AND expires_at > ?
      AND consumed_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1`,
  )
    .bind(email, nowIso())
    .first<EmailLoginCodeRow>()

  if (!row) {
    return makeAuthErrorResponse('验证码已过期，请重新获取')
  }

  if (row.attempts >= maxEmailCodeAttempts) {
    return makeAuthErrorResponse('验证码错误次数过多，请重新获取', 429)
  }

  if (row.code_hash !== codeHash) {
    await env.DB.prepare(
      `UPDATE email_login_codes
      SET attempts = attempts + 1
      WHERE id = ?`,
    )
      .bind(row.id)
      .run()

    return makeAuthErrorResponse('验证码不正确')
  }

  await env.DB.prepare(
    `UPDATE email_login_codes
    SET consumed_at = ?
    WHERE id = ?`,
  )
    .bind(nowIso(), row.id)
    .run()

  const user = await createOrUpdateUserForProvider(env, {
    provider: 'email',
    providerUserId: email,
    email,
    emailVerified: true,
    displayName: email.split('@')[0],
  })
  const token = await createSession(request, env, user.id)

  return makeAuthJsonResponse(
    { ok: true, user: mapUser(user) },
    {
      headers: {
        'Set-Cookie': makeSessionCookie(request, token),
      },
    },
  )
}

async function handleMe(request: Request, env: AuthEnv) {
  const user = await getSessionUser(request, env)

  return makeAuthJsonResponse({ user: user ? mapUser(user) : null })
}

async function handleLogout(request: Request, env: AuthEnv) {
  const token = readCookie(request, sessionCookieName)

  if (token) {
    const tokenHash = await sha256(token)
    await env.DB.prepare(
      `DELETE FROM auth_sessions
      WHERE token_hash = ?`,
    )
      .bind(tokenHash)
      .run()
  }

  return makeAuthJsonResponse(
    { ok: true },
    {
      headers: {
        'Set-Cookie': makeExpiredSessionCookie(request),
      },
    },
  )
}

export async function handleAuthRequest(request: Request, env: AuthEnv) {
  const url = new URL(request.url)

  if (url.pathname === '/api/auth/me' && request.method === 'GET') {
    return handleMe(request, env)
  }

  if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
    return handleLogout(request, env)
  }

  if (url.pathname === '/api/auth/email/start' && request.method === 'POST') {
    return handleEmailStart(request, env)
  }

  if (url.pathname === '/api/auth/email/verify' && request.method === 'POST') {
    return handleEmailVerify(request, env)
  }

  if (url.pathname === '/api/auth/github/start' && request.method === 'GET') {
    return handleOAuthStart(request, env, 'github')
  }

  if (url.pathname === '/api/auth/github/callback' && request.method === 'GET') {
    return handleOAuthCallback(request, env, 'github')
  }

  if (url.pathname === '/api/auth/google/start' && request.method === 'GET') {
    return handleOAuthStart(request, env, 'google')
  }

  if (url.pathname === '/api/auth/google/callback' && request.method === 'GET') {
    return handleOAuthCallback(request, env, 'google')
  }

  return makeAuthJsonResponse({ error: 'Not Found' }, { status: 404 })
}
