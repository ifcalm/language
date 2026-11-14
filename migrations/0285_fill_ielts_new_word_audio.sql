-- Audio for the 300 entries added in 0282 and 0283 is on R2 (610 files, checked against scripts/fixtures/ielts-audio.json). Row ids end in "-uk" / "-us"; the rest is the audio file key.
UPDATE ielts_pronunciations
SET
  audio_url = 'https://assets.english.ifcalm.org/ielts/pronunciations/v1/' || accent || '/' || substr(id, 1, length(id) - 3) || '.m4a',
  updated_at = CURRENT_TIMESTAMP
WHERE audio_url = '';
