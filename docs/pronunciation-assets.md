# Pronunciation asset plan

English Orbit stores public pronunciation audio outside Git in Cloudflare R2.
The database keeps the lookup metadata, while the MP3 files live in R2 and are
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
- `audio_object_key`: R2 object key, such as `pronunciations/us/the.mp3`
- `audio_url`: public URL, such as `https://assets.english.ifcalm.org/pronunciations/us/the.mp3`
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

The current Top 100 bootstrap batch is generated locally with macOS `say`:

- US voice: `Samantha`
- UK voice: `Daniel`
- object format: `.m4a` container with AAC audio
- `audio_provider`: `macos-say`
- `quality_status`: `generated`

This is intentionally marked as generated bootstrap audio. If we later switch to
Amazon Polly, Google TTS, or another dedicated provider, the D1 rows can be
updated and the R2 objects can be replaced.

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
