-- Drop the never-populated vocab.lemma column.
--
-- It was NULL for all 5536 rows, no query filtered on it, and the only UI
-- consumer was a detail-page row that never rendered. Inflection-to-entry
-- lookup (the feature lemma hinted at) needs a one-to-many mapping table
-- (e.g. word_forms) rather than a single canonical-form column, so the
-- column stays redundant even in that future.

ALTER TABLE vocab DROP COLUMN lemma;
