# English Orbit Product Plan

## Product Goal

Build a focused English-learning workspace for Chinese-speaking developers who
need to read technical English with less friction. The product should help users
move from isolated words to complete technical sentences.

The core learning question is:

> How does this English sentence become understandable from words, verbs, and
> structure?

## Current Scope

- Core vocabulary lookup and browsing.
- Vocabulary detail pages with phonetics, pronunciation audio, examples, and
  previous/next navigation.
- Verb pages that explain common developer verbs and verb phrases through
  sentence-growth animations.
- Sentence structure learning through tree-style grammar concepts.
- AI-assisted sentence analysis for backbone, structure, usage, and keywords.
- Searchable reference/resource library.
- Vocabulary admin console for maintaining D1-backed public content.
- Auth endpoints for email verification login plus GitHub/Google OAuth.

## Product Principles

- Prefer technical reading comprehension over a generic study checklist.
- Teach from real developer scenarios: docs, errors, code review, deployment,
  debugging, and system design.
- Show sentence formation visually when structure matters.
- Keep learner-facing data compact: core meaning, examples, pronunciation, and
  sentence paths first.
- Keep workflow/provenance details out of public learning tables unless they are
  directly useful to learners.

## Current Technical Shape

- React + Vite + TypeScript frontend.
- Cloudflare Workers API and static asset serving.
- Cloudflare D1 as the source of truth for public vocabulary and verb data.
- Worker routes split by feature area:
  - `worker/vocabulary`
  - `worker/verbs`
  - `worker/analysis`
  - `worker/auth.ts`
- Public vocabulary lists are full searchable lists ordered by `frequency_rank`;
  the old Top 100 / 500 / 1000 / 3000 band filter is no longer part of the API.

## Next Likely Iterations

1. Split `worker/auth.ts` into smaller auth modules.
2. Split the large sentence-growth player into data modeling, animation, and
   control-panel pieces.
3. Add first-class example pages instead of keeping the route as a placeholder.
4. Add safer admin permissions around content-edit routes.
5. Add richer sentence-analysis history only after the core learning loop feels
   useful without it.
