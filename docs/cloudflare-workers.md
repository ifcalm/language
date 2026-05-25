# Cloudflare Workers deployment

English Orbit is configured for **Cloudflare Workers + Static Assets**.

## Why this shape

- The app is still a React + Vite SPA today.
- Static assets are served from `dist/`.
- `/api/*` requests are routed through the Worker first.
- D1 stores the shared public vocabulary foundation.

## Cloudflare dashboard setup

When creating the project from GitHub:

1. Choose **Workers** rather than Pages.
2. Connect the `ifcalm/language` repository.
3. Use `main` as the production branch.
4. Set:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
5. Leave the root directory at the repository root.

The Worker configuration lives in [`wrangler.jsonc`](../wrangler.jsonc).

## Current persistence strategy

For the current release, English Orbit stays intentionally simple:

- the site is publicly accessible
- personal study progress is stored only in the browser's `localStorage`
- there is no login wall and no cross-device sync yet
- D1 stores only public vocabulary content

The simplified public schema is introduced by:

- [`migrations/0161_simplify_vocab_schema.sql`](../migrations/0161_simplify_vocab_schema.sql)

Current public tables:

- `vocab`
- `vocab_pronunciations`
- `vocab_examples`
- `content_edit_logs`

The Core 3000 vocabulary is read from D1 through `/api/vocabulary`. The large bundled frontend word list has been removed so D1 is the single source of truth for public vocabulary data.

## Public pronunciation assets

Pronunciation audio is stored in Cloudflare R2 rather than Git:

- R2 bucket: `english-orbit`
- public domain: `https://assets.english.ifcalm.org`
- path convention: `pronunciations/us/{word-slug}.m4a` and `pronunciations/uk/{word-slug}.m4a`

The Worker does not need an R2 binding for playback. Public audio URLs are stored in `vocab_pronunciations.audio_url` and served directly from the R2 custom domain.

See [`docs/pronunciation-assets.md`](./pronunciation-assets.md) for the detailed storage notes.

## Local commands

```bash
npm run cf:types
npm run cf:validate
npm run deploy
npm run vocabulary:coverage:top100
npm run pronunciations:coverage:top100
# Remote checks are intentionally explicit:
# node scripts/check-vocabulary-content-completeness.mjs --remote
# node scripts/check-pronunciation-completeness.mjs --remote
```

## Current API surface

- `GET /api/health` — lightweight deployment health check
- `GET /api/vocabulary` — D1-backed vocabulary list endpoint
- `GET /api/vocabulary/pronunciations` — pronunciation lookup by `word` or `vocabularyId`
- `GET /api/admin/vocabulary` — admin vocabulary list
- `GET /api/admin/vocabulary/:id` — admin vocabulary detail
- `PUT /api/admin/vocabulary/:id` — admin vocabulary update

`/api/vocabulary` supports:

- `band=top-100|top-500|top-1000|top-3000`，internally mapped to `frequency_rank <= N`
- `q=<search text>`
- `limit=<1-500>`
- `offset=<number>`

## Future cloud sync path

When cross-device sync becomes worth the added product weight, the next step is to design new user tables with clearer names instead of reviving the old `profiles` / `daily_logs` / `vocabulary_items` tables as-is.
