-- Pronunciation source and asset metadata.
--
-- The first pronunciation table version stored the learner-facing fields only:
-- accent, phonetic, audio_url, and audio_source. These extra columns make each
-- pronunciation row traceable and reproducible when audio is generated and stored
-- in R2.

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN locale TEXT NOT NULL DEFAULT '';

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN phonetic_source TEXT NOT NULL DEFAULT '';

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN phonetic_source_url TEXT NOT NULL DEFAULT '';

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN audio_provider TEXT NOT NULL DEFAULT '';

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN voice_id TEXT NOT NULL DEFAULT '';

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN audio_object_key TEXT NOT NULL DEFAULT '';

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN audio_format TEXT NOT NULL DEFAULT ''
    CHECK (audio_format IN ('', 'mp3', 'wav', 'ogg', 'aac'));

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN license TEXT NOT NULL DEFAULT '';

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN attribution TEXT NOT NULL DEFAULT '';

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN quality_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (
      quality_status IN ('draft', 'generated', 'reviewed', 'needs-review', 'rejected')
    );

ALTER TABLE vocabulary_pronunciations
  ADD COLUMN metadata_json TEXT NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_vocabulary_pronunciations_locale_word
  ON vocabulary_pronunciations (locale, normalized_word, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_pronunciations_audio_object_key
  ON vocabulary_pronunciations (audio_object_key);

CREATE INDEX IF NOT EXISTS idx_vocabulary_pronunciations_quality_status
  ON vocabulary_pronunciations (quality_status, normalized_word);
