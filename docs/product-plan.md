# English Orbit MVP Plan

## Product goal

Build a small-scope English learning workspace for self-study and a handful of users. The first release should help someone answer three questions every day:

1. What should I study today?
2. Where should I practice it?
3. What did I actually complete and retain?

## MVP scope

- Daily plan across listening, speaking, reading, and writing
- Structured resource library derived from the original README collection
- Personal study profile: goal, level, and daily duration
- Daily completion tracking and short reflection
- Lightweight vocabulary capture
- Weekly review with streak, completed tasks, study minutes, and core resources

## Design principles

- Prefer one clear daily loop over many shallow features
- Keep the first version local-first and simple
- Promote only a curated subset of resources into the default learning path
- Let vocabulary and review emerge from actual study activity

## Current technical direction

- React + Vite + TypeScript
- Local state persisted in `localStorage`
- No backend in the first iteration
- Single-page navigation for speed and low maintenance

## Next likely iterations

1. Expand the resource schema and import more of the README list
2. Add richer history and calendar review
3. Export vocabulary to Anki-compatible CSV
4. Add writing history and reusable speaking prompts
5. Introduce AI feedback as an optional enhancement layer
