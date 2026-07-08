-- Unifies report creation, AI prediction, and operator validation history
-- into one timeline for the Audit Log page, instead of the app having to
-- run three separate queries and merge/sort them client-side.
CREATE OR REPLACE FUNCTION report_audit_log(p_limit int DEFAULT 150)
RETURNS TABLE (
  id text,
  action text,
  actor text,
  role text,
  report_id uuid,
  report_title text,
  ts timestamptz,
  note text
)
LANGUAGE sql
STABLE
AS $$
  WITH combined AS (
    (
      SELECT
        'created-' || dr.id::text AS id,
        'report_created' AS action,
        dr.reporter_name AS actor,
        'citizen' AS role,
        dr.id AS report_id,
        dr.address AS report_title,
        dr.created_at AS ts,
        left(dr.description, 80) AS note
      FROM damage_reports dr
      ORDER BY dr.created_at DESC
      LIMIT p_limit
    )
    UNION ALL
    (
      SELECT
        'ai-' || ai.id::text,
        'ai_completed',
        'RADAR AI',
        'system',
        ai.report_id,
        dr.address,
        ai.created_at,
        'Severity: ' || ai.severity || ', Confidence: ' || round(ai.confidence * 100) || '%'
      FROM ai_predictions ai
      JOIN damage_reports dr ON dr.id = ai.report_id
      ORDER BY ai.created_at DESC
      LIMIT p_limit
    )
    UNION ALL
    (
      SELECT
        'review-' || vr.id::text,
        CASE vr.action
          WHEN 'reject_report' THEN 'rejected'
          WHEN 'override_severity' THEN 'overridden'
          ELSE 'validated'
        END,
        'Operator',
        'operator',
        vr.report_id,
        dr.address,
        vr.created_at,
        vr.note
      FROM validation_reviews vr
      JOIN damage_reports dr ON dr.id = vr.report_id
      ORDER BY vr.created_at DESC
      LIMIT p_limit
    )
  )
  SELECT * FROM combined
  ORDER BY ts DESC
  LIMIT p_limit;
$$;
