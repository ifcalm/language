-- Rebuild vocab_pronunciations from vocab plus the R2 audio key convention.
--
-- R2 audio coverage is complete (5536 words x us/uk at -r 90, verified
-- 2026-06-10), so every row gets a working audio_url. The phonetic column is
-- intentionally carried over from vocab as-is: filled for the 83 words added
-- by 0233, empty for the rest, pending a dedicated IPA backfill.
--
-- The slug expression mirrors scripts' slugify(); verified to agree with it
-- for every current normalized_word (only apostrophes and spaces need
-- replacing, e.g. o'clock -> o-clock).

INSERT INTO vocab_pronunciations (id, vocabulary_id, word, phonetic, audio_url)
SELECT
  replace(replace(normalized_word, '''', '-'), ' ', '-') || '-us',
  id,
  word,
  phonetic_us,
  'https://assets.english.ifcalm.org/pronunciations/us/'
    || replace(replace(normalized_word, '''', '-'), ' ', '-') || '.m4a'
FROM vocab;

INSERT INTO vocab_pronunciations (id, vocabulary_id, word, phonetic, audio_url)
SELECT
  replace(replace(normalized_word, '''', '-'), ' ', '-') || '-uk',
  id,
  word,
  phonetic_uk,
  'https://assets.english.ifcalm.org/pronunciations/uk/'
    || replace(replace(normalized_word, '''', '-'), ' ', '-') || '.m4a'
FROM vocab;
