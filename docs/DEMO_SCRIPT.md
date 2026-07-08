# Demo Script (Final) — RADAR PREKETEK

**Duration target: 5 minutes. Scenario: Gempa Cianjur.**

Pre-demo checklist: `.env` copied, `npm run dev:web` running, `/` loads, browser zoomed so text is readable on
projector, DevTools Network tab ready to demo offline, exports pre-tested once.

## Opening (30s)

> "RADAR — Rapid Artificial Intelligence Damage Assessment and Response — mempercepat asesmen kerusakan
> bangunan pascabencana. Warga melapor lewat browser, AI memberi estimasi awal, dan operator memvalidasi
> sebelum bantuan diprioritaskan."

Screen: `/` — point at the alert banner and the 5-step flow section.

## Citizen Flow (60s)

| Click | Say | Must be visible |
|---|---|---|
| `/report` | "Warga bisa melapor dengan form sederhana: foto, GPS, deskripsi." | Report form, GPS button |
| Submit (online) | "Laporan langsung masuk API demo dan diberi ID." | Success screen with report ID + AI severity |
| `/offline` | "Kalau jaringan putus, laporan tidak hilang — masuk antrean lokal dan bisa disinkronkan ulang." | Pending/failed/synced counts, retry/sync/delete buttons |

**Fallback if network demo fails:** explain verbally that offline uses `localStorage` and show the queue item counts instead of live-toggling network.

## Operator Flow (2 min)

| Click | Say | Must be visible |
|---|---|---|
| `/dashboard` | "Operator punya command center: metrik ringkas dan eskalasi kritis." | Metric cards, escalation banner, demo badge |
| `/dashboard/reports` | "Semua laporan bisa difilter berdasarkan severity, status, confidence." | Table (desktop) / cards (mobile), filters |
| Open a report detail | "Setiap laporan punya bukti, lokasi, dan panel AI." | Evidence card, probability bars, model version |
| Confirm AI / Override / Reject | "AI tidak mengambil keputusan final — manusia yang memvalidasi." | Status changes, success message |
| `/dashboard/map` | "Peta krisis menunjukkan sebaran laporan berdasarkan severity." | Leaflet map with colored markers, severity filter |

## Data & Trust (90s)

| Click | Say | Must be visible |
|---|---|---|
| `/dashboard/analytics` | "Distribusi severity dan status validasi bisa dipantau di sini." | Severity bars, validation stats |
| Export CSV / GeoJSON / JSON | "Data bisa diekspor untuk GIS, spreadsheet, atau sistem lain." | File downloads, format explanation text |
| `/dashboard/admin` | "Kami transparan soal AI dan data: fallback jujur, kedaulatan data jelas." | AI status card, data sovereignty card, demo tools marked planned |
| `/dashboard/audit` | "Setiap aksi tercatat untuk audit trail." | Table/cards with action, actor, timestamp |

## Closing (30s)

> "RADAR sudah membuktikan alur end-to-end dari laporan warga sampai validasi operator. Yang jujur harus
> disebutkan: AI ini masih fallback deterministik, antrean offline masih `localStorage`, dan data masih
> in-memory demo. Roadmap produksi kami: model MobileNetV3-Small lokal, database PostgreSQL/PostGIS, Service
> Worker untuk offline sungguhan, dan notifikasi resmi. Untuk MVP kompetisi ini, fokus kami adalah membuktikan
> alur yang benar dan jujur soal batasannya."

## If Something Breaks (Plan B)

- **API/report submit fails on stage:** show `/offline` queue instead — the point (no data loss) still lands.
- **Map tiles don't load (no internet):** say tiles need OpenStreetMap connectivity; fall back to `/dashboard/reports` to show the same locations as text/coordinates.
- **Export download blocked by browser:** open the export URL directly in a new tab and show the raw response.
- **Any page crashes:** navigate back to `/dashboard` — it doesn't depend on the broken state.

## Key Talking Points (for Q&A, see also `docs/JURY_QA.md`)

- **AI Fallback**: `mock-fallback-v1`, deterministic. Target produksi: MobileNetV3-Small lokal.
- **Offline Queue**: `localStorage`-based. Belum Service Worker/IndexedDB.
- **Map**: Leaflet + OpenStreetMap tiles, data demo in-memory. Belum clustering/PostGIS layer.
- **Data**: In-memory demo store. Target produksi: PostgreSQL/PostGIS.
- **Export**: CSV, GeoJSON, JSON dari data demo, siap diimpor ke QGIS/spreadsheet.
- **Audit**: Diturunkan dari data laporan demo. Produksi: tabel audit persisten.
- **Validasi**: Human-in-the-loop — AI membantu triase, operator memutuskan.
