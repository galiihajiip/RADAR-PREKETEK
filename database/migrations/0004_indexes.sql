CREATE INDEX IF NOT EXISTS damage_reports_location_gix ON damage_reports USING gist(location);
CREATE INDEX IF NOT EXISTS damage_reports_status_idx ON damage_reports(status);
CREATE INDEX IF NOT EXISTS damage_reports_severity_idx ON damage_reports(severity);
CREATE INDEX IF NOT EXISTS ai_predictions_report_idx ON ai_predictions(report_id);
