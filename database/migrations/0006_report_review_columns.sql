-- Adds operator-review fields needed by the validation workflow
-- (confirm / override / reject) that the app writes on top of the
-- AI-assigned severity.
ALTER TABLE damage_reports
  ADD COLUMN IF NOT EXISTS severity_final severity_level,
  ADD COLUMN IF NOT EXISTS validation_note text,
  ADD COLUMN IF NOT EXISTS validated_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz;
