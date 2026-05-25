# Pronunciation asset plan

English Orbit stores public pronunciation audio outside Git in Cloudflare R2. D1 stores only the learner-facing lookup fields needed by the app.

## R2 bucket

- Bucket: `english-orbit`
- Public domain: `https://assets.english.ifcalm.org`
- Verification object: `https://assets.english.ifcalm.org/manifests/r2-health.txt`

The bucket is project-scoped. It can hold pronunciation audio first, then later example audio or other public English Orbit assets.

## Object key convention

Use one audio file per vocabulary entry and generated accent variant.

```text
pronunciations/us/{word-slug}.m4a
pronunciations/uk/{word-slug}.m4a
```

Examples:

```text
pronunciations/us/the.m4a
pronunciations/uk/the.m4a
pronunciations/us/take-care-of.m4a
pronunciations/uk/take-care-of.m4a
```

`word-slug` should be derived from `vocab.normalized_word`:

1. lowercase and trim
2. replace every non-letter/non-number run with `-`
3. collapse repeated `-`
4. trim leading/trailing `-`

The database no longer stores `audio_object_key`. For current generated assets, the object key can be derived from the public URL or from the path convention above.

## Database mapping

Pronunciation rows live in `vocab_pronunciations`.

Current fields:

- `id`: stable row id; historical rows usually retain `word-us` / `word-uk` ids
- `vocabulary_id`: stable relation to `vocab.id`
- `word`: redundant display word for direct reads
- `phonetic`: IPA or learner-facing phonetic text
- `audio_url`: public URL, such as `https://assets.english.ifcalm.org/pronunciations/us/the.m4a`

Fields such as accent, locale, provider, voice id, object key, license, attribution, quality status, and metadata JSON are intentionally not part of the business table. Keep that context in data manifests, migration notes, or generation scripts.

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

This is bootstrap audio. If we later switch to a dedicated provider, the R2 objects and `vocab_pronunciations.audio_url` rows can be replaced without changing the learning API shape.

## Generating a frequency-rank range

```bash
PRONUNCIATION_START_PRIORITY=101 \
PRONUNCIATION_END_PRIORITY=200 \
PRONUNCIATION_TOP_N=200 \
npm run pronunciations:generate:top100
```

The command name is kept for compatibility. The range environment variables now map to `vocab.frequency_rank`.

## Coverage check

```bash
npm run pronunciations:coverage:top100
```

The check verifies that each selected word has the required number of pronunciation rows with non-empty `phonetic` and `audio_url`. It no longer checks `accent` or `quality_status`, because those fields were removed from the business table.

## API support

- `GET /api/vocabulary` includes a `pronunciations` array for entries that have pronunciation rows.
- `GET /api/vocabulary/pronunciations?word=the` returns pronunciations for a word.
- `GET /api/vocabulary/pronunciations?vocabularyId=the` returns pronunciations by vocabulary id.
