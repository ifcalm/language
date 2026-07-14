CREATE TABLE vocab_visuals (
  id TEXT PRIMARY KEY,
  vocabulary_id TEXT NOT NULL UNIQUE REFERENCES vocab(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  example_id TEXT REFERENCES vocab_examples(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vocab_visuals_vocabulary
ON vocab_visuals(vocabulary_id);

