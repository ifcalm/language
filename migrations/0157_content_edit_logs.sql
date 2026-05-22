-- Public content edit audit log.
--
-- The data management console edits shared vocabulary content directly in D1.
-- This table keeps a lightweight trail for each admin-side change so we can
-- review what changed, who initiated it, and recover context if a correction
-- needs to be revisited.

CREATE TABLE IF NOT EXISTS content_edit_logs (
  -- id: Stable edit-log identifier.
  id TEXT PRIMARY KEY,

  -- vocabulary_id: Related core vocabulary id when the edit belongs to a word.
  vocabulary_id TEXT,

  -- entity_type: Edited entity category, such as core_vocabulary or vocabulary_bundle.
  entity_type TEXT NOT NULL,

  -- entity_id: Edited entity id. For bundle saves this can equal vocabulary_id.
  entity_id TEXT NOT NULL,

  -- action: Human-readable edit action, such as update or archive.
  action TEXT NOT NULL,

  -- editor: Operator label supplied by the admin UI. No authentication is enforced yet.
  editor TEXT NOT NULL DEFAULT 'unknown',

  -- before_json: Snapshot before the edit, serialized as JSON text.
  before_json TEXT NOT NULL DEFAULT '{}',

  -- after_json: Snapshot after the edit, serialized as JSON text.
  after_json TEXT NOT NULL DEFAULT '{}',

  -- created_at: Edit timestamp in ISO-like text form.
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_edit_logs_vocabulary_time
  ON content_edit_logs (vocabulary_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_edit_logs_entity_time
  ON content_edit_logs (entity_type, entity_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_edit_logs_editor_time
  ON content_edit_logs (editor, created_at DESC);
