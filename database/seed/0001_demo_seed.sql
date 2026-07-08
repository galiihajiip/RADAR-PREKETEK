INSERT INTO profiles(email, full_name, role) VALUES
('citizen@radar.demo','Demo Citizen','citizen'),
('operator@radar.demo','Demo Operator','operator'),
('admin@radar.demo','Demo Admin','admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO disaster_events(name, disaster_type, description, status, center, radius_km, started_at)
VALUES ('Gempa Cianjur Demo Response','earthquake','Seed event for RADAR demo','active', ST_SetSRID(ST_MakePoint(107.079,-6.816),4326)::geography, 35, now())
ON CONFLICT DO NOTHING;
