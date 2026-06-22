# Vocabulary content standard v2

English Orbit's public vocabulary content should stay small, stable, and learner-facing. The current schema intentionally avoids storing source/provenance/review workflow fields in the core learning tables.

## Complete word unit

A vocabulary entry is considered usable when it has the learner-facing content below.

| Content | Storage | Requirement |
|---|---|---|
| Word and normalized word | `vocab.word`, `vocab.normalized_word` | Required |
| Chinese core meaning | `vocab.meaning_zh` | Required |
| English short definition | `vocab.definition_en` | Required |
| Frequency rank | `vocab.frequency_rank` | Required |
| US IPA | `vocab.phonetic_us` | Required |
| UK IPA | `vocab.phonetic_uk` | Required |
| Pronunciation audio | `vocab_pronunciations` | At least two rows for current US/UK historical assets |
| Example | `vocab_examples` | At least one English example |

## Field boundaries

### `vocab`

`vocab` owns the stable, frequently-read summary of a word. `frequency_rank`
drives default ordering and coverage checks, but the public vocabulary API no
longer exposes Top 100 / 500 / 1000 / 3000 learning-band filters.

### `vocab_pronunciations`

The pronunciation table stores only:

- the word relation
- the phonetic text
- the public audio URL

Provider, voice, object key, license, attribution, quality status, and generated metadata belong in batch manifests, generation notes, or scripts.

### `vocab_examples`

Examples should be natural, grammatical, and short enough to learn from. The table stores only the example and optional Chinese explanation. Source and difficulty labels are not part of the business model.

## Removed public-content tables

The following tables were removed to keep the first public data model focused:

- `vocabulary_senses`
- `vocabulary_collocations`
- `vocabulary_scenarios`
- `vocabulary_scenario_links`

If we later build true multi-sense learning, verb patterns, or sentence structures, they should be designed as new focused tables rather than restored as broad placeholder tables.

## Quality practice

Quality still matters, but it should happen before data enters the public business tables or be tracked outside the learner-facing schema:

- data manifests
- generation notes
- Git history
- `content_edit_logs`
- explicit proofreading issues/PRs

## Checks

```bash
npm run vocabulary:coverage:top100
npm run pronunciations:coverage:top100
```

Remote checks should be intentional:

```bash
node scripts/check-vocabulary-content-completeness.mjs --remote
node scripts/check-pronunciation-completeness.mjs --remote
```
