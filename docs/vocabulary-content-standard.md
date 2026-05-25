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
| Top 1000 | Expanded usable set. Complete hard required fields; defer low-value conditional collocations. |
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

Top 100 proofreading v1 is stored in:

- `0158_top_100_proofread_v1.sql`

This proofreading pass marks Top 100 core fields, first-pass senses, and examples
as reviewed; corrects selected part-of-speech mismatches for common function
words; and normalizes selected US/UK IPA strings. It intentionally keeps
generated pronunciation audio rows in `generated` quality status because
listening review is handled separately.


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

## Top 500 public content v1 status

The Top 500 extension fills words 201-500 in one batch-oriented PR instead of
submitting each 100-word slice separately. It is stored as D1 data migrations:

- `0016_top_500_public_content_001.sql`
- `0017_top_500_public_content_002.sql`
- `0018_top_500_public_content_003.sql`
- `0019_top_500_public_content_004.sql`
- `0020_top_500_public_content_005.sql`
- `0021_top_500_public_content_006.sql`
- `0022_top_500_public_content_007.sql`
- `0023_top_500_public_content_008.sql`
- `0024_top_500_public_content_009.sql`
- `0025_top_500_public_content_010.sql`
- `0026_top_500_public_content_011.sql`
- `0027_top_500_public_content_012.sql`
- `0028_top_500_public_content_013.sql`
- `0029_top_500_public_content_014.sql`
- `0030_top_500_public_content_015.sql`

This batch keeps the copyright-safe approach:

- English definitions and example sentences are self-authored.
- Each word gets one learner sense and one simple example.
- Common collocations are included where they are learner-useful.
- Scenario links are filled for filtering and future learning flows.
- US/UK IPA values are populated as bootstrap learner-facing data, with manual
  phonetic review tracked separately.

Top 500 proofreading v1 is stored in:

- `0159_top_500_proofread_v1.sql`

Top 500 proofreading v1 covers words 101-500. It marks core fields,
first-pass senses, and examples as reviewed; corrects selected learner-facing
part-of-speech, meaning, definition, and example issues; and normalizes selected
obvious US/UK IPA strings. It intentionally keeps generated pronunciation audio
rows in `generated` quality status because listening review is handled
separately.

Run the Top 500 checks with:

```bash
PRONUNCIATION_TOP_N=500 npm run pronunciations:coverage:top100
VOCABULARY_CONTENT_TOP_N=500 npm run vocabulary:coverage:top100
```

## Top 1000 public content v1 status

The Top 1000 extension fills words 501-1000. It is stored as D1 data
migrations:

- `0031_top_1000_public_content_001.sql`
- `0032_top_1000_public_content_002.sql`
- `0033_top_1000_public_content_003.sql`
- `0034_top_1000_public_content_004.sql`
- `0035_top_1000_public_content_005.sql`
- `0036_top_1000_public_content_006.sql`
- `0037_top_1000_public_content_007.sql`
- `0038_top_1000_public_content_008.sql`
- `0039_top_1000_public_content_009.sql`
- `0040_top_1000_public_content_010.sql`
- `0041_top_1000_public_content_011.sql`
- `0042_top_1000_public_content_012.sql`
- `0043_top_1000_public_content_013.sql`
- `0044_top_1000_public_content_014.sql`
- `0045_top_1000_public_content_015.sql`
- `0046_top_1000_public_content_016.sql`
- `0047_top_1000_public_content_017.sql`
- `0048_top_1000_public_content_018.sql`
- `0049_top_1000_public_content_019.sql`
- `0050_top_1000_public_content_020.sql`
- `0051_top_1000_public_content_021.sql`
- `0052_top_1000_public_content_022.sql`
- `0053_top_1000_public_content_023.sql`
- `0054_top_1000_public_content_024.sql`
- `0055_top_1000_public_content_025.sql`

This batch keeps the same copyright-safe data policy:

- English definitions and example sentences are self-authored, not copied from
  dictionary entries.
- Each word gets one active learner sense and one original example sentence.
- Scenario links are filled to keep future filtering and learning flows usable.
- US/UK IPA values are populated as bootstrap learner-facing data and remain
  pending manual phonetic review.
- Pronunciation audio is generated through the project TTS/R2 pipeline and marked
  as generated.
- New collocations are intentionally not expanded in this pass unless they add
  clear learner value; collocation enrichment can be handled as a separate
  quality pass.

Run the Top 1000 checks against local D1 with:

```bash
PRONUNCIATION_TOP_N=1000 npm run pronunciations:coverage:top100
VOCABULARY_CONTENT_TOP_N=1000 npm run vocabulary:coverage:top100
```

Run the same checks against remote D1 only for final verification:

```bash
PRONUNCIATION_TOP_N=1000 node scripts/check-pronunciation-completeness.mjs --remote
VOCABULARY_CONTENT_TOP_N=1000 node scripts/check-vocabulary-content-completeness.mjs --remote
```


## Top 3000 public content v1 status

The Top 3000 extension fills words 1001-3000. It is intentionally split into
small D1 migrations so Cloudflare D1 accepts each file safely:

- `0057_top_3000_public_content_001.sql` through
  `0156_top_3000_public_content_100.sql`

This batch uses a broader-coverage, reviewable bootstrap standard:

- Core learner fields are filled for all Top 3000 words: Chinese meaning,
  English short definition, part of speech, level, frequency rank/band, learning
  priority, and US/UK IPA.
- Each word gets one active learner sense, one active example sentence, and at
  least one usage-scenario link.
- Definitions and imported example candidates are WordNet-assisted under the
  WordNet license; examples are used only when the target word is visible and the
  sentence is short enough for learning.
- When WordNet is unsuitable or too noisy, the batch uses generated learner
  examples and manual overrides for high-risk items such as heteronyms,
  technical terms, and noisy Chinese glosses.
- Pronunciation audio is generated through the existing macOS `say` -> R2
  pipeline and marked as `generated` for later listening review.
- New collocations are not expanded in this pass. They remain conditional
  learning content and should be handled as a separate quality pass.

Important quality boundary: this is a broad bootstrap dataset, not a final
human-reviewed dictionary. The rows are usable for product coverage and review,
but IPA, nuanced senses, example translations, and collocations should continue
to move through dedicated quality passes.

Run the Top 3000 checks against local D1 with:

```bash
PRONUNCIATION_TOP_N=3000 node scripts/check-pronunciation-completeness.mjs
VOCABULARY_CONTENT_TOP_N=3000 node scripts/check-vocabulary-content-completeness.mjs
```

Run the same checks against remote D1 only for final verification:

```bash
PRONUNCIATION_TOP_N=3000 node scripts/check-pronunciation-completeness.mjs --remote
VOCABULARY_CONTENT_TOP_N=3000 node scripts/check-vocabulary-content-completeness.mjs --remote
```

Final remote verification for the 2026-05-22 batch:

- required core fields: `3000/3000`
- pronunciation rows with audio URLs: `us 3000/3000`, `uk 3000/3000`
- active senses: `3000/3000`
- active examples: `3000/3000`
- scenario links: `3000/3000`
- generated pronunciation quality rows: `us 3000`, `uk 3000`
- conditional collocations currently present for `474/3000` words

## Completeness check

Run the Top 100 content coverage check against local D1 with:

```bash
npm run vocabulary:coverage:top100
```

The coverage scripts default to local D1. Add `--remote` only for final, intentional remote verification so routine checks do not consume D1 production read quota.

The check fails when any Top N word is missing a required core field, US/UK audio,
at least one active sense, or at least one active example. Collocations and
scenarios are reported as coverage metrics but are not hard failures because they
are conditional by word.
