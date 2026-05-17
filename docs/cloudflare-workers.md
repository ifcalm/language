# Cloudflare Workers deployment

English Orbit is configured for **Cloudflare Workers + Static Assets**.

## Why this shape

- The app is still a React + Vite SPA today.
- Static assets are served from `dist/`.
- `/api/*` requests are routed through the Worker first, which leaves a clean path
  for future dynamic features such as profiles, vocabulary sync, study history,
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

## Local commands

```bash
npm run cf:types
npm run cf:validate
npm run deploy
```

## Current API surface

- `GET /api/health` — lightweight deployment health check

## Future expansion points

When the app becomes dynamic, the next additions should be:

1. D1 binding in `wrangler.jsonc`
2. API routes under `/api/*`
3. Auth/session strategy
4. Migration from browser-only persistence to synced persistence
