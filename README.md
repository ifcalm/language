# English Orbit

English Orbit 是一个面向中文开发者的技术英语学习应用。它不是通用英语资源合集，而是围绕开发者阅读英文文档、错误信息、代码评审和系统描述时最常遇到的问题来组织学习内容。

核心思路是：先看懂词，再抓住动词，最后把句子结构一点点搭起来。

## 当前功能

- 首页查词：搜索核心技术词汇，查看中文核心义、英文释义、音标、读音和例句。
- 词汇库：D1 驱动的全量词汇列表，支持分页、搜索、详情页、读音播放和上一词/下一词导航。
- 动词学习：围绕开发者常见动词和动词短语展示句子生长动画，从主干句逐步扩展到完整句。
- 句子结构：用树状结构讲解主干、修饰、动作关系等语法概念。
- AI 句子分析：通过 `/api/analyze` 返回句子主干、结构说明、用法说明和关键词解释。
- 资源库：保留经过整理的听说读写、语法和词汇参考资源入口。
- 词汇后台：维护词汇核心释义、音标、读音 URL、例句和编辑日志。
- 认证：支持邮箱验证码登录，以及 GitHub / Google OAuth。

## 技术栈

- Frontend: React 19, Vite, TypeScript
- Backend: Cloudflare Workers
- Data: Cloudflare D1
- Assets: Cloudflare Workers Assets；读音音频 URL 指向公开 R2 域名
- Deploy: Wrangler

## 目录结构

```text
src/
  app/                    # 前端路由工具
  admin/                  # 词汇后台页面
  components/             # 共享 UI 组件
  data/                   # 前端静态类型与资源定义
  features/
    auth/                 # 登录 / 注册页面
    home/                 # 首页查词
    library/              # 资源库
    strategy/             # 学习策略与句子结构展示
    verbs/                # 动词页与句子生长播放器
    vocabulary/           # 词汇页、词汇 API client、读音播放 hook

worker/
  index.ts                # Worker 入口和 API 路由分发
  auth.ts                 # 认证相关 API
  analysis/               # AI 句子分析 API
  shared/                 # Worker 共享响应与参数工具
  verbs/                  # 动词 API
  vocabulary/             # 词汇公开 API、后台 API、D1 repository

migrations/               # Cloudflare D1 迁移
scripts/                  # 数据生成、校验和覆盖率检查脚本
docs/                     # 数据模型、部署、内容标准和句子图规范
```

## 本地开发

安装依赖：

```bash
npm install
```

启动前端开发服务：

```bash
npm run dev
```

Vite 开发服务会把 `/api/*` 代理到线上地址 `https://english.ifcalm.org`。如果要连本地 Worker：

```bash
VITE_API_TARGET=http://127.0.0.1:8787 npm run dev
```

常用检查：

```bash
npm run lint
npm run build
npm run cf:validate
```

部署：

```bash
npm run deploy
```

更新 `wrangler.jsonc` 里的绑定后，重新生成 Worker 类型：

```bash
npm run cf:types
```

## Cloudflare 配置

Worker 配置在 [wrangler.jsonc](wrangler.jsonc)：

- `main`: `./worker/index.ts`
- `assets.directory`: `./dist`
- `assets.run_worker_first`: `/api/*`
- D1 binding: `DB`
- Assets binding: `ASSETS`
- compatibility flag: `nodejs_compat`

部署前需要保证 D1 数据库和必要 secrets 已配置。认证和 AI 分析会读取以下运行时环境变量或 secrets：

- `AUTH_SECRET`
- `RESEND_API_KEY`
- `AUTH_EMAIL_FROM`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DEEPSEEK_API_KEY`

## 数据模型

当前公共学习数据以 D1 为准。前端不再携带大型词库数据。

主要业务表：

- `vocab`：词汇主表，保存单词、规范化查询键、中文核心义、英文释义、频率排序和核心音标。
- `vocab_pronunciations`：读音音标与音频 URL。
- `vocab_examples`：例句与中文解释。
- `verbs`：动词与动词短语主表。
- `verb_paths`：动词句子生长路径，包含主干句、完整句、场景和 `growth_json`。
- `content_edit_logs`：后台编辑日志。
- `auth_*`：认证会话、身份、邮箱验证码和 OAuth state。

词汇列表接口现在只保留分页和搜索；旧的 Top 100 / 500 / 1000 / 3000 band 参数已经移除。`frequency_rank` 仍用于默认排序和数据覆盖率检查。

更多细节见：

- [docs/database-schema.md](docs/database-schema.md)
- [docs/vocabulary-content-standard.md](docs/vocabulary-content-standard.md)
- [docs/verb-sentence-growth-standard.md](docs/verb-sentence-growth-standard.md)
- [docs/sentence-svg-diagram-standard.md](docs/sentence-svg-diagram-standard.md)
- [docs/cloudflare-workers.md](docs/cloudflare-workers.md)

## API

公共与学习接口：

- `GET /api/health`
- `GET /api/vocabulary`
- `GET /api/vocabulary/:lookup`
- `GET /api/vocabulary/pronunciations`
- `GET /api/verbs`
- `GET /api/verbs/:lookup`
- `POST /api/analyze`

后台接口：

- `GET /api/admin/vocabulary`
- `GET /api/admin/vocabulary/:id`
- `PUT /api/admin/vocabulary/:id`

认证接口：

- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/email/start`
- `POST /api/auth/email/verify`
- `GET /api/auth/github/start`
- `GET /api/auth/github/callback`
- `GET /api/auth/google/start`
- `GET /api/auth/google/callback`

## 数据脚本

动词路径：

```bash
npm run verbs:generate
npm run verbs:refresh:v2
npm run verbs:validate
npm run verbs:validate:remote
npm run verbs:validate:v2:remote
```

词汇和读音覆盖率：

```bash
npm run vocabulary:coverage:top100
npm run pronunciations:coverage:top100
```

读音生成：

```bash
npm run pronunciations:generate:top100
npm run pronunciations:check:top100
```

## 当前维护重点

- 继续拆分大型前端组件，尤其是 `SentenceGrowthPlayer`。
- 继续拆分 `worker/auth.ts`。
- 为后台编辑接口补上更明确的权限保护。
- 把 `examples` 路由从占位页推进到正式例句页。
- 继续完善动词句子生长数据和词汇例句质量。
