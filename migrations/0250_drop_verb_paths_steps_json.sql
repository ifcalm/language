-- growth_json.steps is the only sentence-growth step source.
-- Keeping steps_json would require duplicate writes and consistency checks.

ALTER TABLE verb_paths DROP COLUMN steps_json;
