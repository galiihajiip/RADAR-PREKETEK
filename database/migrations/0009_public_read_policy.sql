-- damage_reports has RLS enabled with zero policies, which silently blocks
-- both anon reads and Supabase Realtime broadcasts (Realtime only sends a
-- change to a subscriber if that subscriber's role could SELECT the row).
-- All writes still go through the server (service role key), so a public
-- read policy here does not open up write access.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'damage_reports' AND policyname = 'public_read_damage_reports'
  ) THEN
    CREATE POLICY public_read_damage_reports ON damage_reports FOR SELECT USING (true);
  END IF;
END $$;
