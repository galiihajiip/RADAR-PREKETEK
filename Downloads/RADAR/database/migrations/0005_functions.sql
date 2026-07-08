CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS damage_reports_updated_at ON damage_reports;
CREATE TRIGGER damage_reports_updated_at BEFORE UPDATE ON damage_reports FOR EACH ROW EXECUTE FUNCTION set_updated_at();
