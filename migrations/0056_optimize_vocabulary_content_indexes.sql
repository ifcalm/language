-- Optimize vocabulary public-content reads.
--
-- These composite indexes keep batch coverage checks and public vocabulary reads
-- anchored by vocabulary_id first, instead of letting SQLite/D1 scan all active
-- child rows through broad publish_status-only indexes.

CREATE INDEX IF NOT EXISTS idx_vocabulary_pronunciations_vocabulary_status_accent_order
  ON vocabulary_pronunciations (vocabulary_id, publish_status, accent, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_pronunciations_word_status_order
  ON vocabulary_pronunciations (normalized_word, publish_status, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_senses_vocabulary_status_order
  ON vocabulary_senses (vocabulary_id, publish_status, sense_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_examples_vocabulary_status_order
  ON vocabulary_examples (vocabulary_id, publish_status, example_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_collocations_vocabulary_status_order
  ON vocabulary_collocations (vocabulary_id, publish_status, sort_order);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_status_level_priority
  ON core_vocabulary (publish_status, level, learning_priority);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_status_part_priority
  ON core_vocabulary (publish_status, primary_part_of_speech, learning_priority);
