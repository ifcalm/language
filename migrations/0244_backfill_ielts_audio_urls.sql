-- Fill audio_url once every file is on R2 (verified against
-- scripts/fixtures/ielts-audio.json before applying). Row ids end in
-- "-uk" / "-us"; the rest is the audio file key, e.g. increase-n-uk ->
-- ielts/pronunciations/v1/uk/increase-n.m4a.
UPDATE ielts_pronunciations
SET
  audio_url = 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/'
    || accent || '/' || substr(id, 1, length(id) - 3) || '.m4a',
  updated_at = CURRENT_TIMESTAMP
WHERE audio_url = '';
