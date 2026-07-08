# Limitations

## Status MVP

RADAR PREKETEK saat ini ditargetkan sebagai MVP hackathon. Sistem dibuat untuk membuktikan alur demo end-to-end, bukan untuk dipakai langsung sebagai sistem produksi penanganan bencana.

## Batasan Utama

- Data demo dapat berjalan lokal atau in-memory, sehingga belum selalu persisten seperti database produksi.
- AI prediction dapat menggunakan fallback deterministik jika model atau service AI belum tersedia.
- Fallback AI bukan bukti model sudah dilatih pada dataset bencana nyata.
- Offline queue pada MVP dapat berupa simulasi visual/local browser storage, belum tentu background sync produksi.
- Autentikasi demo tidak setara dengan keamanan produksi.
- Peta dapat menggunakan panel fallback jika map tile atau koneksi internet bermasalah.
- Export CSV/GeoJSON ditujukan untuk demo interoperabilitas, belum mencakup semua kebutuhan operasional posko.
- Eskalasi dan notifikasi dapat berupa simulasi UI, bukan integrasi SMS, WhatsApp, email, atau radio dispatch sungguhan.
- Audit log demo bisa belum persisten lintas restart jika belum memakai database produksi.

## Yang Harus Dijelaskan Saat Demo

- Jika AI fallback aktif, sebutkan bahwa prediksi adalah fallback demo.
- Jika data memakai demo store, sebutkan bahwa target produksi adalah PostgreSQL/PostGIS.
- Jika peta memakai tampilan fallback, sebutkan bahwa integrasi produksi memakai Leaflet/OpenStreetMap atau GIS lain.
- Jika login memakai demo role, sebutkan bahwa autentikasi produksi masih roadmap.

## Risiko Jika Dipakai Di Luar Demo

- Keputusan bantuan tidak boleh bergantung penuh pada prediksi otomatis.
- Operator manusia tetap harus memvalidasi laporan kritis.
- Foto, lokasi, dan data warga membutuhkan kebijakan privasi dan keamanan yang lebih ketat.
- Sistem produksi membutuhkan monitoring, backup, rate limit, dan prosedur incident response.

## Roadmap Setelah Hackathon

- Persistensi database penuh dengan PostGIS.
- Upload storage produksi untuk bukti foto.
- Model AI lokal yang dilatih dan dievaluasi secara transparan.
- Validasi lapangan dan verifikasi multi-sumber.
- Realtime dashboard untuk banyak operator.
- Integrasi notifikasi resmi.
- Pengujian aksesibilitas, performa, dan keamanan.
