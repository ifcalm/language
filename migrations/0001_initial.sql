CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  goal TEXT NOT NULL,
  level TEXT NOT NULL,
  minutes_per_day INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_logs (
  user_id TEXT NOT NULL,
  log_date TEXT NOT NULL,
  completed_task_ids TEXT NOT NULL DEFAULT '[]',
  reflection TEXT NOT NULL DEFAULT '',
  minutes_logged INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id
  ON daily_logs (user_id);

CREATE TABLE IF NOT EXISTS vocabulary_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_items_user_id
  ON vocabulary_items (user_id);
