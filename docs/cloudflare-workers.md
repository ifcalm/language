# Cloudflare Workers deployment

English Orbit is configured for **Cloudflare Workers + Static Assets**.

## Why this shape

- The app is still a React + Vite SPA today.
- Static assets are served from `dist/`.
- `/api/*` requests are routed through the Worker first, which leaves a clean path
  for dynamic features such as profiles, vocabulary sync, study history,
  and D1-backed persistence.

## Cloudflare dashboard setup

When creating the project from GitHub:

1. Choose **Workers** rather than Pages.
2. Connect the `ifcalm/language` repository.
3. Use `main` as the production branch after this change is merged.
4. Set:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
5. Leave the root directory at the repository root.

The Worker configuration lives in [`wrangler.jsonc`](../wrangler.jsonc).

## Current persistence strategy

For the first release, English Orbit stays intentionally simple:

- the site is publicly accessible
- study progress is stored only in the browser's `localStorage`
- there is no login wall and no cross-device sync yet

The D1 database is already provisioned. The schema is kept in:

- [`migrations/0001_initial.sql`](../migrations/0001_initial.sql) — initial
  profile/log/user vocabulary tables
- [`migrations/0002_core_vocabulary.sql`](../migrations/0002_core_vocabulary.sql)
  — `core_vocabulary`, the public Core 3000 vocabulary master table
- [`migrations/0003_vocabulary_content_tables.sql`](../migrations/0003_vocabulary_content_tables.sql)
  — public vocabulary content tables for pronunciations, senses, examples,
  collocations, and scenarios

The Core 3000 vocabulary is now read from D1 through `/api/vocabulary`.
The large bundled frontend word list has been removed so D1 is the single
source of truth for core vocabulary data.

## Local commands

```bash
npm run cf:types
npm run cf:validate
npm run deploy
```

## Current API surface

- `GET /api/health` — lightweight deployment health check
- `GET /api/vocabulary` — D1-backed Core Vocabulary list endpoint

`/api/vocabulary` supports:

- `band=top-100|top-500|top-1000|top-3000`
- `q=<search text>`
- `level=A1|A2|B1|B2`
- `partOfSpeech=noun|verb|...`
- `limit=<1-500>`
- `offset=<number>`

## Future cloud sync path

When cross-device sync becomes worth the added product weight, the next step is
to add:

1. an identity strategy
2. authenticated `/api/*` routes
3. a migration path from browser-only state to D1-backed state
