-- Read-friendly view over damage_reports: exposes the PostGIS geography
-- column as plain latitude/longitude floats and folds in each report's
-- latest AI prediction and image, so the app can select one row per
-- report instead of joining three tables on every request.
CREATE OR REPLACE VIEW damage_reports_view AS
SELECT
  dr.id,
  dr.local_id,
  dr.event_id,
  dr.reporter_id,
  dr.reporter_name,
  dr.address,
  dr.description,
  ST_Y(dr.location::geometry) AS latitude,
  ST_X(dr.location::geometry) AS longitude,
  dr.severity,
  dr.severity_final,
  dr.status,
  dr.sync_status,
  dr.confidence,
  dr.validation_note,
  dr.validated_at,
  dr.rejected_at,
  dr.created_at,
  dr.updated_at,
  ai.severity AS ai_severity,
  ai.confidence AS ai_confidence,
  ai.probabilities AS ai_probabilities,
  ai.model_version AS ai_model_version,
  ai.inference_ms AS ai_inference_ms,
  img.id AS image_id,
  img.storage_path AS image_storage_path,
  img.content_type AS image_content_type
FROM damage_reports dr
LEFT JOIN LATERAL (
  SELECT * FROM ai_predictions
  WHERE report_id = dr.id
  ORDER BY created_at DESC
  LIMIT 1
) ai ON true
LEFT JOIN LATERAL (
  SELECT * FROM report_images
  WHERE report_id = dr.id
  ORDER BY created_at DESC
  LIMIT 1
) img ON true;

-- Inserts a damage report from plain lat/lng (building the PostGIS point
-- server-side) and returns the fully joined view row, so the API layer
-- never has to construct geography literals itself.
CREATE OR REPLACE FUNCTION create_damage_report(
  p_local_id text,
  p_reporter_name text,
  p_address text,
  p_description text,
  p_latitude double precision,
  p_longitude double precision,
  p_severity severity_level DEFAULT 'unknown',
  p_status report_status DEFAULT 'submitted',
  p_confidence numeric DEFAULT 0
) RETURNS SETOF damage_reports_view
LANGUAGE plpgsql
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO damage_reports (
    local_id, reporter_name, address, description, location, severity, status, confidence
  ) VALUES (
    p_local_id,
    p_reporter_name,
    p_address,
    p_description,
    ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::geography,
    p_severity,
    p_status,
    p_confidence
  )
  ON CONFLICT (local_id) DO UPDATE SET updated_at = now()
  RETURNING id INTO new_id;

  RETURN QUERY SELECT * FROM damage_reports_view WHERE id = new_id;
END;
$$;

-- Single round-trip aggregate for the analytics/summary endpoint instead
-- of pulling every row down to the app to count client-side.
CREATE OR REPLACE FUNCTION report_summary()
RETURNS TABLE (
  total bigint,
  destroyed bigint,
  major_damage bigint,
  minor_damage bigint,
  no_damage bigint,
  unknown_count bigint,
  avg_confidence numeric,
  pending_validation bigint,
  validated bigint,
  rejected bigint,
  escalated bigint,
  offline_synced bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    count(*) AS total,
    count(*) FILTER (WHERE severity = 'destroyed') AS destroyed,
    count(*) FILTER (WHERE severity = 'major_damage') AS major_damage,
    count(*) FILTER (WHERE severity = 'minor_damage') AS minor_damage,
    count(*) FILTER (WHERE severity = 'no_damage') AS no_damage,
    count(*) FILTER (WHERE severity = 'unknown') AS unknown_count,
    coalesce(avg(confidence), 0) AS avg_confidence,
    count(*) FILTER (WHERE status NOT IN ('validated', 'rejected')) AS pending_validation,
    count(*) FILTER (WHERE status = 'validated') AS validated,
    count(*) FILTER (WHERE status = 'rejected') AS rejected,
    count(*) FILTER (WHERE status = 'escalated') AS escalated,
    count(*) FILTER (WHERE sync_status = 'synced') AS offline_synced
  FROM damage_reports;
$$;
