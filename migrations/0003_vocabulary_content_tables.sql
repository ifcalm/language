-- Vocabulary public content tables.
--
-- These tables extend core_vocabulary with shared learner-facing content:
-- pronunciations, senses, examples, collocations, and scenario tags.
--
-- Each word-level child table keeps both vocabulary_id and redundant word fields:
-- - vocabulary_id keeps a stable normalized relation to core_vocabulary(id).
-- - word preserves the learner-facing spelling for direct reads and debugging.
-- - normalized_word supports direct case-insensitive lookup without always joining
--   core_vocabulary first.

CREATE TABLE IF NOT EXISTS vocabulary_pronunciations (
  -- id: Stable pronunciation row identifier.
  id TEXT PRIMARY KEY,

  -- vocabulary_id: Related core vocabulary id. Keeps the normalized parent link.
  vocabulary_id TEXT NOT NULL
    REFERENCES core_vocabulary(id) ON DELETE CASCADE,

  -- word: Redundant display word copied from core_vocabulary.word for direct reads.
  word TEXT NOT NULL,

  -- normalized_word: Redundant search key copied from core_vocabulary.normalized_word.
  normalized_word TEXT NOT NULL,

  -- accent: Pronunciation accent or variant.
  accent TEXT NOT NULL DEFAULT 'global'
    CHECK (accent IN ('global', 'us', 'uk', 'other')),

  -- phonetic: IPA or learner-facing phonetic text, such as /ðə/.
  phonetic TEXT NOT NULL DEFAULT '',

  -- audio_url: Optional stable audio URL, preferably from R2 when self-managed.
  audio_url TEXT NOT NULL DEFAULT '',

  -- audio_source: How this pronunciation/audio was produced or collected.
  audio_source TEXT NOT NULL DEFAULT 'none'
    CHECK (audio_source IN ('none', 'tts', 'manual', 'external')),

  -- sort_order: Display order when a word has multiple pronunciations.
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- publish_status: Learner-facing visibility state.
  publish_status TEXT NOT NULL DEFAULT 'active'
    CHECK (publish_status IN ('active', 'archived')),

  -- created_at: Row creation timestamp in ISO-like text form.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp in ISO-like text form.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- reviewed_at: Optional manual review timestamp; empty means not reviewed yet.
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_pronunciations_vocabulary_order
  ON vocabulary_pronunciations (vocabulary_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_pronunciations_word_accent
  ON vocabulary_pronunciations (normalized_word, accent, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_pronunciations_publish_status
  ON vocabulary_pronunciations (publish_status, sort_order);

CREATE TABLE IF NOT EXISTS vocabulary_senses (
  -- id: Stable sense row identifier.
  id TEXT PRIMARY KEY,

  -- vocabulary_id: Related core vocabulary id. A word can have many senses.
  vocabulary_id TEXT NOT NULL
    REFERENCES core_vocabulary(id) ON DELETE CASCADE,

  -- word: Redundant display word copied from core_vocabulary.word for direct reads.
  word TEXT NOT NULL,

  -- normalized_word: Redundant search key copied from core_vocabulary.normalized_word.
  normalized_word TEXT NOT NULL,

  -- part_of_speech: Part of speech for this specific sense.
  part_of_speech TEXT NOT NULL
    CHECK (
      part_of_speech IN (
        'noun', 'verb', 'adjective', 'adverb', 'phrase', 'pronoun',
        'preposition', 'conjunction', 'determiner', 'modal',
        'interjection', 'number'
      )
    ),

  -- meaning_zh: Chinese meaning for this sense.
  meaning_zh TEXT NOT NULL DEFAULT '',

  -- definition_en: English definition for this sense.
  definition_en TEXT NOT NULL DEFAULT '',

  -- usage_note: Short learner-facing usage note for this sense.
  usage_note TEXT NOT NULL DEFAULT '',

  -- sense_order: Display order among senses of the same word.
  sense_order INTEGER NOT NULL DEFAULT 0,

  -- level: Optional learning level for this sense when it differs from the word.
  level TEXT
    CHECK (level IS NULL OR level IN ('A1', 'A2', 'B1', 'B2')),

  -- publish_status: Learner-facing visibility state.
  publish_status TEXT NOT NULL DEFAULT 'active'
    CHECK (publish_status IN ('active', 'archived')),

  -- created_at: Row creation timestamp in ISO-like text form.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp in ISO-like text form.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- reviewed_at: Optional manual review timestamp; empty means not reviewed yet.
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_senses_vocabulary_order
  ON vocabulary_senses (vocabulary_id, sense_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_senses_word_order
  ON vocabulary_senses (normalized_word, sense_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_senses_part_of_speech
  ON vocabulary_senses (part_of_speech, sense_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_senses_level
  ON vocabulary_senses (level, sense_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_senses_publish_status
  ON vocabulary_senses (publish_status, sense_order);

CREATE TABLE IF NOT EXISTS vocabulary_examples (
  -- id: Stable example row identifier.
  id TEXT PRIMARY KEY,

  -- vocabulary_id: Related core vocabulary id. Keeps examples queryable by word.
  vocabulary_id TEXT NOT NULL
    REFERENCES core_vocabulary(id) ON DELETE CASCADE,

  -- word: Redundant display word copied from core_vocabulary.word for direct reads.
  word TEXT NOT NULL,

  -- normalized_word: Redundant search key copied from core_vocabulary.normalized_word.
  normalized_word TEXT NOT NULL,

  -- sense_id: Optional related sense. Null means the example applies generally.
  sense_id TEXT
    REFERENCES vocabulary_senses(id) ON DELETE SET NULL,

  -- sentence_en: English example sentence.
  sentence_en TEXT NOT NULL,

  -- sentence_zh: Chinese translation or learner-facing explanation.
  sentence_zh TEXT NOT NULL DEFAULT '',

  -- source_type: How this example was created or collected.
  source_type TEXT NOT NULL DEFAULT 'manual'
    CHECK (source_type IN ('manual', 'generated', 'imported')),

  -- source_ref: Optional source note, import batch id, or review reference.
  source_ref TEXT NOT NULL DEFAULT '',

  -- difficulty: Optional example difficulty band.
  difficulty TEXT
    CHECK (difficulty IS NULL OR difficulty IN ('easy', 'medium', 'hard')),

  -- example_order: Display order among examples of the same word.
  example_order INTEGER NOT NULL DEFAULT 0,

  -- publish_status: Learner-facing visibility state.
  publish_status TEXT NOT NULL DEFAULT 'active'
    CHECK (publish_status IN ('active', 'archived')),

  -- created_at: Row creation timestamp in ISO-like text form.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp in ISO-like text form.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- reviewed_at: Optional manual review timestamp; empty means not reviewed yet.
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_examples_vocabulary_order
  ON vocabulary_examples (vocabulary_id, example_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_examples_word_order
  ON vocabulary_examples (normalized_word, example_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_examples_sense_order
  ON vocabulary_examples (sense_id, example_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_examples_difficulty
  ON vocabulary_examples (difficulty, example_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_examples_publish_status
  ON vocabulary_examples (publish_status, example_order);

CREATE TABLE IF NOT EXISTS vocabulary_collocations (
  -- id: Stable collocation row identifier.
  id TEXT PRIMARY KEY,

  -- vocabulary_id: Related core vocabulary id. Keeps collocations queryable by word.
  vocabulary_id TEXT NOT NULL
    REFERENCES core_vocabulary(id) ON DELETE CASCADE,

  -- word: Redundant display word copied from core_vocabulary.word for direct reads.
  word TEXT NOT NULL,

  -- normalized_word: Redundant search key copied from core_vocabulary.normalized_word.
  normalized_word TEXT NOT NULL,

  -- sense_id: Optional related sense. Null means the collocation applies generally.
  sense_id TEXT
    REFERENCES vocabulary_senses(id) ON DELETE SET NULL,

  -- phrase: Learner-facing phrase, pattern, or fixed expression.
  phrase TEXT NOT NULL,

  -- normalized_phrase: Lowercase/search-friendly phrase for lookup and dedupe.
  normalized_phrase TEXT NOT NULL,

  -- meaning_zh: Chinese meaning for this phrase or pattern.
  meaning_zh TEXT NOT NULL DEFAULT '',

  -- example_en: Optional English example using the collocation.
  example_en TEXT NOT NULL DEFAULT '',

  -- example_zh: Optional Chinese translation for example_en.
  example_zh TEXT NOT NULL DEFAULT '',

  -- collocation_type: Content category for this expression.
  collocation_type TEXT NOT NULL DEFAULT 'phrase'
    CHECK (
      collocation_type IN (
        'phrase', 'pattern', 'fixed-expression', 'phrasal-verb', 'idiom'
      )
    ),

  -- sort_order: Display order among collocations of the same word.
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- publish_status: Learner-facing visibility state.
  publish_status TEXT NOT NULL DEFAULT 'active'
    CHECK (publish_status IN ('active', 'archived')),

  -- created_at: Row creation timestamp in ISO-like text form.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp in ISO-like text form.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- reviewed_at: Optional manual review timestamp; empty means not reviewed yet.
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_collocations_vocabulary_order
  ON vocabulary_collocations (vocabulary_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_collocations_word_order
  ON vocabulary_collocations (normalized_word, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_collocations_phrase
  ON vocabulary_collocations (normalized_phrase);

CREATE INDEX IF NOT EXISTS idx_vocabulary_collocations_sense_order
  ON vocabulary_collocations (sense_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_collocations_type
  ON vocabulary_collocations (collocation_type, sort_order);

CREATE INDEX IF NOT EXISTS idx_vocabulary_collocations_publish_status
  ON vocabulary_collocations (publish_status, sort_order);

CREATE TABLE IF NOT EXISTS vocabulary_scenarios (
  -- id: Stable scenario identifier, such as daily, work, or study.
  id TEXT PRIMARY KEY,

  -- name_zh: Learner-facing Chinese scenario name.
  name_zh TEXT NOT NULL,

  -- name_en: English scenario name for internal display or future i18n.
  name_en TEXT NOT NULL,

  -- description: Short explanation of what this scenario covers.
  description TEXT NOT NULL DEFAULT '',

  -- sort_order: Display order in filters and scenario lists.
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- publish_status: Learner-facing visibility state.
  publish_status TEXT NOT NULL DEFAULT 'active'
    CHECK (publish_status IN ('active', 'archived')),

  -- created_at: Row creation timestamp in ISO-like text form.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- updated_at: Last content update timestamp in ISO-like text form.
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_scenarios_order
  ON vocabulary_scenarios (publish_status, sort_order);

CREATE TABLE IF NOT EXISTS vocabulary_scenario_links (
  -- vocabulary_id: Related core vocabulary id.
  vocabulary_id TEXT NOT NULL
    REFERENCES core_vocabulary(id) ON DELETE CASCADE,

  -- word: Redundant display word copied from core_vocabulary.word for direct reads.
  word TEXT NOT NULL,

  -- normalized_word: Redundant search key copied from core_vocabulary.normalized_word.
  normalized_word TEXT NOT NULL,

  -- scenario_id: Related vocabulary scenario id.
  scenario_id TEXT NOT NULL
    REFERENCES vocabulary_scenarios(id) ON DELETE CASCADE,

  -- relevance: How strongly this word belongs to the scenario, from 0 to 100.
  relevance INTEGER NOT NULL DEFAULT 50
    CHECK (relevance >= 0 AND relevance <= 100),

  -- created_at: Row creation timestamp in ISO-like text form.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (vocabulary_id, scenario_id)
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_scenario_links_scenario_relevance
  ON vocabulary_scenario_links (scenario_id, relevance DESC, normalized_word);

CREATE INDEX IF NOT EXISTS idx_vocabulary_scenario_links_word
  ON vocabulary_scenario_links (normalized_word, scenario_id);
