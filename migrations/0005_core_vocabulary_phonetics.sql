-- Core vocabulary learner-facing phonetics.
--
-- The pronunciation table keeps accent-specific audio and provenance details.
-- These core_vocabulary fields intentionally cache the primary learner-facing
-- US/UK IPA strings so list pages, study cards, and completeness checks can read
-- the essential phonetic data without joining pronunciation assets every time.

ALTER TABLE core_vocabulary
  ADD COLUMN phonetic_us TEXT NOT NULL DEFAULT '';

ALTER TABLE core_vocabulary
  ADD COLUMN phonetic_uk TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_phonetic_us
  ON core_vocabulary (phonetic_us);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_phonetic_uk
  ON core_vocabulary (phonetic_uk);
