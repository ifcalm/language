-- Original example sentences for IELTS entries. target is the exact form
-- of the entry as it appears in sentence_en (raise -> raised), used to
-- blank it out in fill-in practice. id is {word_id}-{n}; n is never reused.
CREATE TABLE ielts_examples (
  id TEXT PRIMARY KEY,
  word_id TEXT NOT NULL REFERENCES ielts_words(id) ON DELETE CASCADE,
  sentence_en TEXT NOT NULL,
  sentence_zh TEXT NOT NULL,
  target TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ielts_examples_word
ON ielts_examples(word_id);
