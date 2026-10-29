-- IELTS vocabulary, independent of the COCA `vocab` table.
-- `id` is a stable slug assigned once on first import and never changed,
-- so spelling or meaning edits keep audio files and learner progress intact.
CREATE TABLE ielts_words (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  normalized_word TEXT NOT NULL,
  spelling_us TEXT,
  meaning_zh TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_ielts_words_normalized_word
ON ielts_words(normalized_word);
