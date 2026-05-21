# Vocabulary content standard v1

English Orbit's public vocabulary content should be reliable before we build more
personalized learning behavior on top of it. The goal is to make every core word
a stable learning unit: the app can read it, show it, review it, and later attach
user progress without rethinking the underlying content model.

## Complete word unit

A core vocabulary entry is considered complete when it has the learner-facing
content below.

| Content | Storage | Requirement |
| --- | --- | --- |
| Word and normalized word | `core_vocabulary.word`, `core_vocabulary.normalized_word` | Required |
| Chinese core meaning | `core_vocabulary.meaning_zh` | Required |
| English short definition | `core_vocabulary.definition_en` | Required |
| Main part of speech | `core_vocabulary.primary_part_of_speech` | Required |
| CEFR-like level | `core_vocabulary.level` | Required |
| Frequency rank | `core_vocabulary.frequency_rank` | Required |
| Frequency band | `core_vocabulary.frequency_band` | Required |
| Learning priority | `core_vocabulary.learning_priority` | Required |
| US IPA | `core_vocabulary.phonetic_us` | Required |
| UK IPA | `core_vocabulary.phonetic_uk` | Required |
| US pronunciation audio | `vocabulary_pronunciations` with `accent = 'us'` | Required |
| UK pronunciation audio | `vocabulary_pronunciations` with `accent = 'uk'` | Required |
| Common senses | `vocabulary_senses` | At least one active sense |
| High-quality example | `vocabulary_examples` | At least one active example |
| Common collocations | `vocabulary_collocations` | Required when the word has common learner-useful collocations |
| Usage scenarios | `vocabulary_scenario_links` | Required when the word has clear scenario affinity |

## Field boundaries

### Core vocabulary

`core_vocabulary` owns the stable, frequently-read summary of a word. It should
stay compact and learner-facing.

Important distinction:

- `frequency_rank` is a mostly objective occurrence-frequency ordering.
- `learning_priority` is our product-specific study order.

They should not be collapsed into one field. Very frequent grammar words can
rank high by occurrence but may not always be the best first study item.

### Phonetics and pronunciation assets

US/UK IPA is intentionally duplicated at two levels:

- `core_vocabulary.phonetic_us` and `core_vocabulary.phonetic_uk` are the primary
  learner-facing IPA strings used in lists and study cards.
- `vocabulary_pronunciations.phonetic` remains available for accent-specific
  pronunciation rows, especially when audio assets, providers, voices, licenses,
  or future variants differ.

When both exist, the core table is the quick display source; the pronunciation
table is the asset/provenance source.

### Senses

A sense should represent a common learner-useful meaning, not every dictionary
meaning. For the first content pass, prefer one to three senses per word.

A valid active sense should have:

- `meaning_zh`
- `definition_en`
- `part_of_speech`
- `sense_order`

### Examples

A valid example should be natural, grammatical, and short enough to learn from.
For Top 100 and Top 500 content, prefer simple examples that show the core sense
clearly instead of clever or literary sentences.

A valid active example should have:

- `sentence_en`
- preferably `sentence_zh`
- optionally `sense_id` when it clearly demonstrates one sense

### Collocations

Collocations are conditional content. They are valuable for words like `make`,
`take`, `get`, `work`, `need`, and `go`, but not every grammar word needs them.
Avoid adding low-value phrases only to satisfy a count.

Good collocations are common, reusable, and learner-actionable, such as:

- `make a decision`
- `take time`
- `work on something`
- `need help`

### Scenarios

Scenario links are also conditional. They should be used when a word naturally
belongs to a clear learning context such as daily life, work, study, emotion,
time, communication, or problem solving.

## Batch standards

| Batch | Target standard |
| --- | --- |
| Top 100 | Golden sample. Complete all required fields and manually review quality. |
| Top 500 | Usable learning set. Complete all required fields; review in batches. |
| Top 3000 | Broad coverage. Core fields first, then fill pronunciations, senses, and examples progressively. |


## Top 100 public content v1 status

The first Top 100 public-content batch is stored as D1 data migrations:

- `0006_top_100_public_content_001.sql`
- `0007_top_100_public_content_002.sql`
- `0008_top_100_public_content_003.sql`
- `0009_top_100_public_content_004.sql`
- `0010_top_100_public_content_005.sql`

This batch fills the required hard-standard fields for the first 100 words:

- core Chinese meaning and English short definition
- US and UK IPA in `core_vocabulary`
- accent-specific IPA copied to `vocabulary_pronunciations`
- one active learner sense per word
- one original easy example per word
- useful collocations when they add learning value
- scenario links for filtering and future learning flows


## Top 200 public content v1 status

The second public-content batch extends the hard-standard coverage from Top 100
to Top 200. It is stored as D1 data migrations:

- `0011_top_200_public_content_001.sql`
- `0012_top_200_public_content_002.sql`
- `0013_top_200_public_content_003.sql`
- `0014_top_200_public_content_004.sql`
- `0015_top_200_public_content_005.sql`

This batch follows the copyright-safe content approach:

- English short definitions are self-authored for learning use.
- Example sentences are self-authored and intentionally simple.
- Collocations are included only when they add learner value.
- US/UK IPA is filled in the core table and copied to pronunciation rows.
- Pronunciation audio is generated through the project TTS/R2 pipeline and marked
  as generated.

Run the Top 200 checks with:

```bash
PRONUNCIATION_TOP_N=200 npm run pronunciations:coverage:top100
VOCABULARY_CONTENT_TOP_N=200 npm run vocabulary:coverage:top100
```

## Completeness check

Run the Top 100 content coverage check with:

```bash
npm run vocabulary:coverage:top100
```

Use local D1 during development:

```bash
node scripts/check-vocabulary-content-completeness.mjs --local
```

The check fails when any Top N word is missing a required core field, US/UK audio,
at least one active sense, or at least one active example. Collocations and
scenarios are reported as coverage metrics but are not hard failures because they
are conditional by word.
