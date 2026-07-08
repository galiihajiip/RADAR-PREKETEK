# Demo Script: RADAR PREKETEK — Gempa Cianjur Response

Pre-demo checklist: `.env` copied, `npm run dev` running, `/api/health` ok, AI `/health` ok, browser profiles ready for citizen/operator/admin, DevTools Network tab ready, exports pre-tested.

## Block 1–2: Citizen Report & Offline Queue

| # | Click | Say | Judges see | Plan B |
|---:|---|---|---|---|
| 1 | `/` | RADAR mempercepat asesmen kerusakan dengan PWA, AI lokal, dan dashboard operator. | Landing with pitch | Use screenshot/read README |
| 2 | `/report` | Warga bisa melapor dengan bahasa sederhana. | Report form | Use prefilled data |
| 3 | Submit online | Laporan punya local id dan masuk API demo. | Success screen with report id and AI fallback severity | POST API manually |
| 4 | `/offline` | Jika gagal jaringan, offline bukan gagal, tapi antrean kerja. | Pending/failed/synced queue, retry, delete | Show stored localStorage |
| 5 | Sinkronkan | Saat online, item dikirim ke API demo tanpa kehilangan data. | Synced queue item | Explain fallback |
| 6 | `/dashboard/reports` | Operator melihat daftar laporan real dari API demo. | Table/cards with filters | Use `/dashboard` queue cards |
| 7 | Open detail | Setiap laporan punya panel bukti, lokasi, dan AI. | `/dashboard/reports/[id]` detail | Use first report id from API |
| 8 | Confirm / Override / Reject | AI tidak mengambil keputusan final; manusia memvalidasi. | Status changes in UI | Call validate API |

## Block 3: Command Dashboard, Analytics, Export, Admin, Audit

| # | Click | Say | Judges see | Plan B |
|---:|---|---|---|---|
| 9 | `/dashboard` | Operator punya command center dengan ringkasan prioritas. | Metric cards, escalation banner, latest reports, CTA links, demo badge | Use direct report list |
| 10 | `/dashboard/analytics` | Posko butuh ringkasan dan distribusi severity. | Severity bars, validation stats, 8 metric cards | Use API summary |
| 11 | Export CSV | Data ramah spreadsheet. | CSV download with 10 kolom | Copy API output |
| 12 | Export GeoJSON | Data bisa masuk GIS lain. | FeatureCollection file | Show API response |
| 13 | Export JSON | Format lengkap untuk integrasi sistem. | JSON download | Use `/api/export/json` |
| 14 | `/dashboard/admin` | Admin melihat status AI, kedaulatan data, dan pengaturan sistem. | AI status, sovereignty card, settings preview, demo tools, user roles | Use docs/API |
| 15 | `/dashboard/audit` | Setiap aksi tercatat di audit trail. | Table/cards with actions, actors, timestamps | Explain audit derivation |
| 16 | AI `/model-info` | Kedaulatan data: inferensi lokal/fallback, bukan vision API eksternal. | Classes/version | Use admin page |
| 17 | Closing | RADAR siap demo, jujur soal batasan, dan punya roadmap produksi. | Final checklist | Use final doc |

## Key Talking Points

- **AI Fallback**: Prediksi menggunakan demo-fallback-v1 deterministik. Target produksi: MobileNetV3-Small lokal.
- **Offline Queue**: localStorage-based. Belum Service Worker/IndexedDB.
- **Data**: In-memory demo store. Target produksi: PostgreSQL/PostGIS.
- **Export**: CSV, GeoJSON, JSON dari data demo. Siap diimpor ke QGIS/spreadsheet.
- **Audit**: Diturunkan dari data laporan demo. Produksi: tabel audit persisten.
- **Validasi**: Human-in-the-loop — AI membantu triase, operator memutuskan.
