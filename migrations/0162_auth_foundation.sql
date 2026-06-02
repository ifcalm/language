-- English Orbit authentication foundation.
-- 设计原则：GitHub、Google、邮箱登录不按邮箱自动合并账号；只按 provider + provider_user_id 识别同一身份。

PRAGMA foreign_keys = ON;

-- 系统用户表：保存 English Orbit 自己关心的用户信息。
CREATE TABLE IF NOT EXISTS users (
  -- 系统内部用户 ID，与第三方平台 ID 无关。
  id TEXT PRIMARY KEY,
  -- 用户主邮箱；允许重复，避免 GitHub / Google / 邮箱登录被自动合并。
  email TEXT,
  -- 主邮箱是否经过当前登录方式验证。
  email_verified INTEGER NOT NULL DEFAULT 0,
  -- 页面展示名称，可来自 GitHub / Google / 邮箱前缀，后续也可由用户自行修改。
  display_name TEXT,
  -- 用户头像 URL，可来自第三方平台。
  avatar_url TEXT,
  -- 用户角色：user / admin 等。
  role TEXT NOT NULL DEFAULT 'user',
  -- 创建时间。
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 更新时间。
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 最近一次登录时间。
  last_login_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 登录身份表：一个 user 可以绑定一个或多个身份，但第一版不做自动合并。
CREATE TABLE IF NOT EXISTS auth_identities (
  -- 身份记录 ID。
  id TEXT PRIMARY KEY,
  -- 关联的系统用户 ID。
  user_id TEXT NOT NULL,
  -- 登录来源：github / google / email。
  provider TEXT NOT NULL,
  -- 第三方平台稳定用户 ID；邮箱登录时为规范化后的邮箱。
  provider_user_id TEXT NOT NULL,
  -- 第三方平台用户名，例如 GitHub login。
  provider_username TEXT,
  -- 该身份返回或验证过的邮箱。
  email TEXT,
  -- 该身份下邮箱是否已验证。
  email_verified INTEGER NOT NULL DEFAULT 0,
  -- 该身份返回的头像。
  avatar_url TEXT,
  -- 创建时间。
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 更新时间。
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_auth_identities_user_id ON auth_identities(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_identities_email ON auth_identities(email);

-- 登录会话表：只保存 token hash，不保存明文 session token。
CREATE TABLE IF NOT EXISTS auth_sessions (
  -- 会话 ID。
  id TEXT PRIMARY KEY,
  -- 关联的系统用户 ID。
  user_id TEXT NOT NULL,
  -- session token 的 SHA-256 hash。
  token_hash TEXT NOT NULL UNIQUE,
  -- 会话过期时间。
  expires_at TEXT NOT NULL,
  -- 创建时间。
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- 最近使用时间；第一版可不频繁更新，避免额外 D1 写入。
  last_seen_at TEXT,
  -- 创建会话时的 User-Agent，便于后续安全审计。
  user_agent TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);

-- 邮箱验证码表：验证码只保存 hash，不保存明文。
CREATE TABLE IF NOT EXISTS email_login_codes (
  -- 验证码记录 ID。
  id TEXT PRIMARY KEY,
  -- 规范化后的邮箱。
  email TEXT NOT NULL,
  -- 验证码 hash。
  code_hash TEXT NOT NULL,
  -- 验证码过期时间。
  expires_at TEXT NOT NULL,
  -- 已消费时间；非空表示验证码已使用。
  consumed_at TEXT,
  -- 验证失败次数。
  attempts INTEGER NOT NULL DEFAULT 0,
  -- 创建时间。
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_login_codes_email ON email_login_codes(email);
CREATE INDEX IF NOT EXISTS idx_email_login_codes_expires_at ON email_login_codes(expires_at);

-- OAuth state 表：用于防止 OAuth 回调被伪造。
CREATE TABLE IF NOT EXISTS auth_oauth_states (
  -- state 记录 ID。
  id TEXT PRIMARY KEY,
  -- 登录来源：github / google。
  provider TEXT NOT NULL,
  -- state 的 SHA-256 hash。
  state_hash TEXT NOT NULL UNIQUE,
  -- 登录完成后允许跳转的站内路径。
  redirect_to TEXT NOT NULL DEFAULT '/',
  -- 过期时间。
  expires_at TEXT NOT NULL,
  -- 消费时间；非空表示 state 已使用。
  consumed_at TEXT,
  -- 创建时间。
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_auth_oauth_states_provider ON auth_oauth_states(provider);
CREATE INDEX IF NOT EXISTS idx_auth_oauth_states_expires_at ON auth_oauth_states(expires_at);
