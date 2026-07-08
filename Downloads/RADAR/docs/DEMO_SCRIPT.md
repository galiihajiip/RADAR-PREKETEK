# Demo Script: Gempa Cianjur Demo Response

Pre-demo checklist: `.env` copied, `npm run dev` running, `/api/health` ok, AI `/health` ok, browser profiles ready for citizen/operator/admin, DevTools Network tab ready, exports pre-tested.

| # | Click | Say | Judges see | Plan B |
|---:|---|---|---|---|
| 1 | `/` | RADAR mempercepat asesmen kerusakan dengan PWA, AI lokal, dan dashboard operator. | Landing with pitch | Use screenshot/read README |
| 2 | `/report` | Warga bisa melapor dengan bahasa sederhana. | Report form | Use prefilled data |
| 3 | Submit | Laporan punya local id agar tidak duplikat. | Queue message | POST API manually |
| 4 | `/offline` | Ini momen wow: offline bukan gagal, tapi fitur. | Pending item persists | Show stored localStorage |
| 5 | Sinkronkan | Saat online, item masuk alur sinkronisasi. | Synced story | Explain fallback |
| 6 | `/dashboard` | Operator melihat prioritas berbasis severity dan confidence. | Map-style markers | Use report cards |
| 7 | Confirm | AI tidak mengambil keputusan final; manusia memvalidasi. | Buttons visible | Call validate API |
| 8 | `/analytics` | Posko butuh ringkasan dan ekspor. | Metrics | Use API summary |
| 9 | GeoJSON | Data bisa masuk GIS lain. | FeatureCollection | Show file |
| 10 | CSV | Data juga ramah spreadsheet. | CSV download | Copy API output |
| 11 | `/admin` | Admin mensimulasikan eskalasi kritis. | Escalation button | Describe notification |
| 12 | `/brand` | UI konsisten dan aksesibel. | Design system | Skip if short |
| 13 | AI `/model-info` | Kedaulatan data: inferensi lokal, bukan vision API eksternal. | Classes/version | Use docs |
| 14 | Architecture diagram | Sistem punya jalur demo dan produksi. | Mermaid docs | Use README |
| 15 | Closing | RADAR siap demo, jujur soal batasan, dan punya roadmap produksi. | Final checklist | Use final doc |
