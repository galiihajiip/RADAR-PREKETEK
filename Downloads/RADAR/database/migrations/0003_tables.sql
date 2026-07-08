CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'citizen',
  organization text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS disaster_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  disaster_type text NOT NULL,
  description text,
  status event_status DEFAULT 'draft',
  center geography(Point,4326) NOT NULL,
  radius_km numeric,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS damage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id text UNIQUE,
  event_id uuid REFERENCES disaster_events(id),
  reporter_id uuid REFERENCES profiles(id),
  reporter_name text NOT NULL,
  address text NOT NULL,
  description text NOT NULL,
  location geography(Point,4326) NOT NULL,
  severity severity_level DEFAULT 'unknown',
  status report_status DEFAULT 'submitted',
  sync_status sync_status DEFAULT 'synced',
  confidence numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS report_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES damage_reports(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  content_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES damage_reports(id) ON DELETE CASCADE,
  severity severity_level NOT NULL,
  confidence numeric NOT NULL,
  probabilities jsonb NOT NULL,
  model_version text NOT NULL,
  inference_ms numeric,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS validation_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES damage_reports(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES profiles(id),
  action validation_action NOT NULL,
  previous_severity severity_level,
  new_severity severity_level,
  note text,
  created_at timestamptz DEFAULT now()
);
