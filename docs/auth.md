# 登录与账号体系

English Orbit 第一版采用「系统用户 + 登录身份」模型：

- `users`：系统内部用户。
- `auth_identities`：登录身份，包含 `github`、`google`、`email`。
- `auth_sessions`：登录会话，只保存 session token 的 hash。
- `email_login_codes`：邮箱验证码，只保存验证码 hash。
- `auth_oauth_states`：OAuth 登录过程中的临时 state。

## 账号合并规则

GitHub、Google、邮箱登录不按邮箱自动合并账号。

系统只通过下面的唯一键识别同一个登录身份：

```sql
UNIQUE(provider, provider_user_id)
```

因此，即使 GitHub 和 Google 返回同一个邮箱，也会创建两个独立账号。后续如果要合并，应在用户设置页做显式「绑定账号」流程。

## Cloudflare Secrets

启用对应登录方式前，需要在 Cloudflare Workers 中配置 secrets：

```bash
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put AUTH_SECRET
wrangler secret put AUTH_EMAIL_FROM
```

说明：

- GitHub 登录需要 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET`。
- Google 登录需要 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`。
- 邮箱验证码登录需要 Cloudflare Email Sending binding `EMAIL`、`AUTH_SECRET`、`AUTH_EMAIL_FROM`。
- `AUTH_EMAIL_FROM` 示例：`开发者英语 <login@ifcalm.org>`，需要先在 Cloudflare Email Sending 完成域名验证。

## 邮箱验证码策略

- 验证码为 6 位数字，10 分钟内有效。
- 同一个验证码最多允许尝试 5 次。
- 同一个邮箱 60 秒内只能请求 1 次验证码。
- 同一个邮箱 1 小时内最多请求 5 次验证码。

## 回调地址

生产环境建议配置：

```text
https://english.ifcalm.org/api/auth/github/callback
https://english.ifcalm.org/api/auth/google/callback
```
