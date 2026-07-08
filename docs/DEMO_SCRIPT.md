# Demo Script: Gempa Cianjur Demo Response

Pre-demo checklist: `.env` copied, `npm run dev` running, `/api/health` ok, AI `/health` ok, browser profiles ready for citizen/operator/admin, DevTools Network tab ready, exports pre-tested.

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
| 9 | `/dashboard` | Operator melihat prioritas berbasis severity dan confidence. | Map-style markers | Use report cards |
| 10 | `/analytics` | Posko butuh ringkasan dan ekspor. | Metrics | Use API summary |
| 11 | GeoJSON | Data bisa masuk GIS lain. | FeatureCollection | Show file |
| 12 | CSV | Data juga ramah spreadsheet. | CSV download | Copy API output |
| 13 | `/admin` | Admin mensimulasikan eskalasi kritis. | Escalation button | Describe notification |
| 14 | AI `/model-info` | Kedaulatan data: inferensi lokal/fallback, bukan vision API eksternal. | Classes/version | Use docs |
| 15 | Closing | RADAR siap demo, jujur soal batasan, dan punya roadmap produksi. | Final checklist | Use final doc |
