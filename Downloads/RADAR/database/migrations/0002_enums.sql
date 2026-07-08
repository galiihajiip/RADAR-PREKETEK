DO $$ BEGIN CREATE TYPE user_role AS ENUM ('citizen','operator','admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE event_status AS ENUM ('draft','active','resolved','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE severity_level AS ENUM ('no_damage','minor_damage','major_damage','destroyed','unknown'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE report_status AS ENUM ('draft','queued','submitted','ai_pending','ai_completed','validated','rejected','escalated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE sync_status AS ENUM ('online','offline_queued','synced','failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE validation_action AS ENUM ('confirm_ai','override_severity','reject_report','request_more_info'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
