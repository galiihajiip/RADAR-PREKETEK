# Demo Scope

1. Open `/` and give the one-sentence RADAR pitch.
2. Open `/report`, submit the prefilled Cianjur report.
3. Simulate offline by explaining the browser queue and opening `/offline`.
4. Press `Sinkronkan` to show recovery.
5. Open `/dashboard`, point to severity markers and confidence.
6. Confirm/override a report as operator.
7. Open `/analytics` and export GeoJSON/CSV.
8. Open `/admin` and show escalation simulation.

Fallbacks: if AI fails, reports remain `ai_pending`; if internet fails, offline queue is the feature; if Supabase is absent, demo data runs locally; if map tiles fail, the CSS map panel remains visible.
