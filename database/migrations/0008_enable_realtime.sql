-- Broadcasts row changes on damage_reports over Supabase Realtime so the
-- crisis map / dashboard can update live instead of only refreshing on
-- navigation. Idempotent: adding a table twice to the publication errors,
-- so guard with a existence check.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'damage_reports'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE damage_reports;
  END IF;
END $$;
