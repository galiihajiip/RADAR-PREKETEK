-- Fixed UUIDs must match database/seed/0002_dummy_10000_reports.sql, which
-- references these same profile/event ids as foreign keys.
INSERT INTO profiles(id, email, full_name, role) VALUES
('02cd1cf1-6166-5910-aa9e-7b48d101ec80','citizen@radar.demo','Demo Citizen','citizen'),
('2246e11f-a571-544b-8620-6a6823b0b61b','operator@radar.demo','Demo Operator','operator'),
('b3cc1fbb-0c51-5d5b-9c97-815fd6868232','admin@radar.demo','Demo Admin','admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO disaster_events(id, name, disaster_type, description, status, center, radius_km, started_at, created_by)
VALUES ('f78247a8-b595-5d3f-bbc1-c7c0d05872fe','Gempa Cianjur Demo Response','earthquake','Seed event for RADAR demo','active', ST_SetSRID(ST_MakePoint(107.079,-6.816),4326)::geography, 35, now(), 'b3cc1fbb-0c51-5d5b-9c97-815fd6868232')
ON CONFLICT (id) DO NOTHING;
