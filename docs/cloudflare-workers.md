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

The D1 database is already provisioned and the initial schema is kept in
[`migrations/0001_initial.sql`](../migrations/0001_initial.sql) so the project
has a clean upgrade path later. It is **not** used by the current UI.

## Local commands

```bash
npm run cf:types
npm run cf:validate
npm run deploy
```

## Current API surface

- `GET /api/health` — lightweight deployment health check

## Future cloud sync path

When cross-device sync becomes worth the added product weight, the next step is
to add:

1. an identity strategy
2. authenticated `/api/*` routes
3. a migration path from browser-only state to D1-backed state
