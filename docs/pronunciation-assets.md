# Pronunciation asset plan

English Orbit stores public pronunciation audio outside Git in Cloudflare R2.
The database keeps the lookup metadata, while the audio files live in R2 and are
served through a custom domain.

## R2 bucket

- Bucket: `english-orbit`
- Public domain: `https://assets.english.ifcalm.org`
- Verification object: `https://assets.english.ifcalm.org/manifests/r2-health.txt`

The bucket is project-scoped. It can hold pronunciation audio first, then later
example audio or other public English Orbit assets.

## Object key convention

Use one audio file per vocabulary entry and accent.

```text
pronunciations/us/{word-slug}.{extension}
pronunciations/uk/{word-slug}.{extension}
```

Examples:

```text
pronunciations/us/the.m4a
pronunciations/uk/the.m4a
pronunciations/us/take-care-of.m4a
pronunciations/uk/take-care-of.m4a
```

`word-slug` should be derived from `core_vocabulary.normalized_word`:

1. lowercase and trim
2. replace every non-letter/non-number run with `-`
3. collapse repeated `-`
4. trim leading/trailing `-`

The generated object key should still be saved explicitly in
`vocabulary_pronunciations.audio_object_key`; that column is the durable source
for playback.

## Database mapping

Pronunciation rows live in `vocabulary_pronunciations`.

Important fields:

- `vocabulary_id`: stable relation to `core_vocabulary.id`
- `word`: redundant display word for direct reads
- `normalized_word`: redundant search key for direct lookup
- `accent`: `us` or `uk`
- `locale`: usually `en-US` or `en-GB`
- `phonetic`: IPA or learner-facing phonetic text
- `phonetic_source`: source of the phonetic text, such as `cmudict`, `wiktionary`, or `manual`
- `audio_source`: broad source type, usually `tts`
- `audio_provider`: concrete provider, such as `amazon-polly`, `google-tts`, or `openai-tts`
- `voice_id`: provider voice name/id
- `audio_object_key`: R2 object key, such as `pronunciations/us/the.m4a`
- `audio_url`: public URL, such as `https://assets.english.ifcalm.org/pronunciations/us/the.m4a`
- `license`: license or usage note for the pronunciation/audio source
- `attribution`: required attribution text when applicable
- `quality_status`: `draft`, `generated`, `reviewed`, `needs-review`, or `rejected`

## Upload command

For generated audio, upload to the remote R2 bucket:

```bash
wrangler r2 object put english-orbit/pronunciations/us/the.m4a \
  --remote \
  --file ./tmp/pronunciations/us/the.m4a \
  --content-type audio/mp4 \
  --cache-control 'public, max-age=31536000, immutable'
```

The current bootstrap pronunciation batches are generated locally with macOS `say`:

- US voice: `Samantha`
- UK voice: `Daniel`
- object format: `.m4a` container with AAC audio
- `audio_provider`: `macos-say`
- `phonetic_source`: `manual-curation-pending-review`
- `quality_status`: `generated`

This is intentionally marked as generated bootstrap audio. If we later switch to
Amazon Polly, Google TTS, or another dedicated provider, the D1 rows can be
updated and the R2 objects can be replaced.


### Generating a priority range

The pronunciation generator can target a learning-priority range, which lets us
extend audio in reviewable batches instead of regenerating the whole list:

```bash
PRONUNCIATION_START_PRIORITY=101 \
PRONUNCIATION_END_PRIORITY=200 \
PRONUNCIATION_TOP_N=200 \
npm run pronunciations:generate:top100

# Current Top 3000 extension, words 1001-3000:
PRONUNCIATION_START_PRIORITY=1001 \
PRONUNCIATION_END_PRIORITY=3000 \
PRONUNCIATION_TOP_N=3000 \
PRONUNCIATION_UPLOAD_CONCURRENCY=2 \
PRONUNCIATION_UPLOAD_TIMEOUT_MS=120000 \
PRONUNCIATION_UPLOAD_ATTEMPTS=8 \
npm run pronunciations:generate:top100
```

The command name is kept for compatibility, but the range environment variables
control which vocabulary rows are generated. For large R2 batches, keep upload
concurrency low; Cloudflare can return `429 Too Many Requests` if thousands of
objects are pushed too aggressively.

## Quality review workflow

Pronunciation rows should move through a simple quality path:

```text
generated -> reviewed
generated -> needs-review -> reviewed
generated -> rejected
```

Guidelines:

- Use `generated` for automatically created bootstrap audio that has not been
  manually checked.
- Use `reviewed` only after someone has listened to the word and confirmed the
  accent is acceptable for learning.
- Use `needs-review` when the audio plays but sounds questionable.
- Use `rejected` when the audio should not be shown to learners.

Before expanding to a larger batch, run the local D1 coverage check:

```bash
npm run pronunciations:coverage:top100
```

Expected output after the Top 3000 pronunciation batch:

```text
Pronunciation coverage (remote D1): 3000/3000 words, 6000/6000 required rows present.
Quality status breakdown:
- uk generated: 3000
- us generated: 3000
```

The script defaults to local D1 and exits with a non-zero status if any checked Top N word is missing either US or UK pronunciation rows. Add `--remote` only for final verification against production D1.

## Read pattern

For direct word pronunciation lookup, the Worker can query without joining the
main vocabulary table:

```sql
SELECT
  accent,
  locale,
  phonetic,
  audio_url,
  audio_object_key,
  quality_status
FROM vocabulary_pronunciations
WHERE normalized_word = ?
  AND publish_status = 'active'
ORDER BY sort_order;
```

The vocabulary detail API can still join through `vocabulary_id` when it needs to
assemble full word details with senses, examples, collocations, and scenarios.

Current API support:

- `GET /api/vocabulary` includes a `pronunciations` array for entries that have
  active pronunciation rows.
- `GET /api/vocabulary/pronunciations?word=the` returns active pronunciations
  for a word without joining `core_vocabulary`.
- `GET /api/vocabulary/pronunciations?vocabularyId=the` returns active
  pronunciations by vocabulary id.

Each pronunciation response includes playback fields plus provenance fields such
as `audioProvider`, `voiceId`, and `qualityStatus`.
