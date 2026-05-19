-- Core vocabulary master table.
-- This table stores only stable, shared vocabulary metadata used by the learning path.
-- Pronunciations, examples, senses, collocations, user sentences, and review records
-- should live in separate related tables and reference core_vocabulary(id).

CREATE TABLE IF NOT EXISTS core_vocabulary (
  -- id: Stable vocabulary entry identifier. Child tables should reference this value.
  id TEXT PRIMARY KEY,

  -- word: Display text for the word or phrase, preserving the learner-facing spelling.
  word TEXT NOT NULL,

  -- normalized_word: Lowercase/search-friendly form used for deduplication and lookup.
  normalized_word TEXT NOT NULL,

  -- entry_type: Entry category. Use 'word' for single words and 'phrase' for multi-word entries.
  entry_type TEXT NOT NULL DEFAULT 'word'
    CHECK (entry_type IN ('word', 'phrase')),

  -- lemma: Optional base form or canonical form, such as 'child' for 'children'.
  lemma TEXT,

  -- meaning_zh: Primary Chinese meaning shown to learners.
  meaning_zh TEXT NOT NULL DEFAULT '',

  -- definition_en: Primary English definition when Chinese meaning is not yet curated.
  definition_en TEXT NOT NULL DEFAULT '',

  -- primary_part_of_speech: Main part of speech used for list filtering, such as noun or verb.
  primary_part_of_speech TEXT NOT NULL,

  -- level: Learning difficulty band used by the app, currently A1/A2/B1/B2.
  level TEXT NOT NULL
    CHECK (level IN ('A1', 'A2', 'B1', 'B2')),

  -- frequency_rank: Objective-ish rank from the vocabulary frequency ordering.
  frequency_rank INTEGER,

  -- frequency_band: Learning frequency bucket, such as top-100, top-500, top-1000, top-3000.
  frequency_band TEXT
    CHECK (
      frequency_band IS NULL OR
      frequency_band IN ('top-100', 'top-500', 'top-1000', 'top-3000')
    ),

  -- learning_priority: App-specific study order. Lower values should appear earlier.
  learning_priority INTEGER NOT NULL,

  -- publish_status: Visibility state for learner-facing surfaces.
  publish_status TEXT NOT NULL DEFAULT 'active'
    CHECK (publish_status IN ('active', 'archived')),

  -- note: Short learner-facing note or internal transition note until richer tables are added.
  note TEXT NOT NULL DEFAULT '',

  -- created_at: Row creation timestamp in ISO-like text form.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp in ISO-like text form.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- reviewed_at: Optional manual review timestamp; empty means not reviewed yet.
  reviewed_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_core_vocabulary_normalized_word
  ON core_vocabulary (normalized_word);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_learning_priority
  ON core_vocabulary (learning_priority);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_frequency_rank
  ON core_vocabulary (frequency_rank);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_frequency_band_priority
  ON core_vocabulary (frequency_band, learning_priority);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_level_priority
  ON core_vocabulary (level, learning_priority);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_part_of_speech_priority
  ON core_vocabulary (primary_part_of_speech, learning_priority);

CREATE INDEX IF NOT EXISTS idx_core_vocabulary_publish_status_priority
  ON core_vocabulary (publish_status, learning_priority);
