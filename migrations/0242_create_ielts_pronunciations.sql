-- UK/US IPA and audio for IELTS entries. One row per accent; words whose
-- reading changes with part of speech (increase n./v.) get one row per
-- part of speech and accent. phonetic is empty only for pattern phrases
-- (convert A into B); audio_url stays empty until the file is on R2.
CREATE TABLE ielts_pronunciations (
  id TEXT PRIMARY KEY,
  word_id TEXT NOT NULL REFERENCES ielts_words(id) ON DELETE CASCADE,
  accent TEXT NOT NULL CHECK (accent IN ('uk', 'us')),
  pos TEXT,
  phonetic TEXT NOT NULL DEFAULT '',
  audio_url TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ielts_pronunciations_word
ON ielts_pronunciations(word_id);
