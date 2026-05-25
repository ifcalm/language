-- Simplify public vocabulary schema.
--
-- This migration intentionally removes the older public-content subsystem that was
-- designed around broad provenance/review metadata and scenario/sense/collocation
-- expansion. The product now keeps the public vocabulary foundation small and
-- learner-facing:
--
-- - vocab: core word data
-- - vocab_pronunciations: pronunciation/audio rows
-- - vocab_examples: learner examples
--
-- Source, copyright, generation, and review context should live in docs,
-- manifests, migrations, and content_edit_logs instead of the main learning
-- tables.

PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS vocab_examples;
DROP TABLE IF EXISTS vocab_pronunciations;
DROP TABLE IF EXISTS vocab;

CREATE TABLE vocab (
  -- id: Stable word identifier used by examples, pronunciations, and future user data.
  id TEXT PRIMARY KEY,

  -- word: Learner-facing spelling.
  word TEXT NOT NULL,

  -- normalized_word: Lowercase/search-friendly form for lookup and deduplication.
  normalized_word TEXT NOT NULL,

  -- lemma: Optional canonical/base form when it differs from word.
  lemma TEXT,

  -- meaning_zh: Primary Chinese meaning shown to learners.
  meaning_zh TEXT NOT NULL DEFAULT '',

  -- definition_en: Short English definition shown to learners.
  definition_en TEXT NOT NULL DEFAULT '',

  -- frequency_rank: Frequency-based rank. Lower values are shown earlier.
  frequency_rank INTEGER,

  -- phonetic_us: Learner-facing US IPA.
  phonetic_us TEXT NOT NULL DEFAULT '',

  -- phonetic_uk: Learner-facing UK IPA.
  phonetic_uk TEXT NOT NULL DEFAULT '',

  -- created_at: Row creation timestamp.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vocab (
  id,
  word,
  normalized_word,
  lemma,
  meaning_zh,
  definition_en,
  frequency_rank,
  phonetic_us,
  phonetic_uk,
  created_at,
  updated_at
)
SELECT
  id,
  word,
  normalized_word,
  lemma,
  meaning_zh,
  definition_en,
  frequency_rank,
  phonetic_us,
  phonetic_uk,
  created_at,
  updated_at
FROM core_vocabulary;

CREATE TABLE vocab_pronunciations (
  -- id: Stable pronunciation row identifier. Existing ids preserve historical US/UK rows.
  id TEXT PRIMARY KEY,

  -- vocabulary_id: Related vocab.id.
  vocabulary_id TEXT NOT NULL REFERENCES vocab(id) ON DELETE CASCADE,

  -- word: Redundant display word for direct reads and admin convenience.
  word TEXT NOT NULL,

  -- phonetic: IPA or learner-facing phonetic text.
  phonetic TEXT NOT NULL DEFAULT '',

  -- audio_url: Stable audio URL, usually backed by R2.
  audio_url TEXT NOT NULL DEFAULT '',

  -- created_at: Row creation timestamp.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vocab_pronunciations (
  id,
  vocabulary_id,
  word,
  phonetic,
  audio_url,
  created_at,
  updated_at
)
SELECT
  id,
  vocabulary_id,
  word,
  phonetic,
  audio_url,
  created_at,
  updated_at
FROM vocabulary_pronunciations;

CREATE TABLE vocab_examples (
  -- id: Stable example row identifier.
  id TEXT PRIMARY KEY,

  -- vocabulary_id: Related vocab.id.
  vocabulary_id TEXT NOT NULL REFERENCES vocab(id) ON DELETE CASCADE,

  -- word: Redundant display word for direct reads and admin convenience.
  word TEXT NOT NULL,

  -- sentence_en: English example sentence.
  sentence_en TEXT NOT NULL,

  -- sentence_zh: Chinese translation or learner-facing explanation.
  sentence_zh TEXT NOT NULL DEFAULT '',

  -- created_at: Row creation timestamp.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO vocab_examples (
  id,
  vocabulary_id,
  word,
  sentence_en,
  sentence_zh,
  created_at,
  updated_at
)
SELECT
  id,
  vocabulary_id,
  word,
  sentence_en,
  sentence_zh,
  created_at,
  updated_at
FROM vocabulary_examples;

DROP TABLE IF EXISTS vocabulary_scenario_links;
DROP TABLE IF EXISTS vocabulary_scenarios;
DROP TABLE IF EXISTS vocabulary_collocations;
DROP TABLE IF EXISTS vocabulary_senses;
DROP TABLE IF EXISTS vocabulary_examples;
DROP TABLE IF EXISTS vocabulary_pronunciations;
DROP TABLE IF EXISTS core_vocabulary;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS daily_logs;
DROP TABLE IF EXISTS vocabulary_items;

CREATE UNIQUE INDEX idx_vocab_normalized_word
  ON vocab (normalized_word);

CREATE INDEX idx_vocab_frequency_rank
  ON vocab (frequency_rank);

CREATE INDEX idx_vocab_pronunciations_vocabulary
  ON vocab_pronunciations (vocabulary_id);

CREATE INDEX idx_vocab_pronunciations_word
  ON vocab_pronunciations (word);

CREATE INDEX idx_vocab_examples_vocabulary
  ON vocab_examples (vocabulary_id);

CREATE INDEX idx_vocab_examples_word
  ON vocab_examples (word);

PRAGMA foreign_keys = ON;
