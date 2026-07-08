# Judge Q&A

1. Kenapa PWA bukan native? Karena kondisi bencana butuh akses cepat tanpa instalasi berat. PWA bisa dibuka dari tautan, mendukung offline queue, dan tetap bisa dipasang di layar utama.
2. Bagaimana offline sync bekerja? Laporan diberi `local_id`, disimpan lokal, lalu dikirim ketika koneksi kembali. Idempotency mencegah duplikasi.
3. Kenapa MobileNetV3-Small? Model ringan, cocok untuk CPU/edge, dan cukup cepat untuk klasifikasi empat kelas.
4. Bagaimana jika AI salah? Operator wajib validasi dan bisa override; AI hanya prioritas awal.
5. Apa peran PostGIS? Menyimpan titik kerusakan sebagai `geography(Point,4326)` untuk query radius dan peta.
6. Bagaimana privasi data? Foto dianalisis lokal, tidak dikirim ke vision API pihak ketiga.
7. Bisakah skala nasional? Arsitektur bisa dipisah web, AI, dan database; perlu hardening auth, RLS, dan observability.
8. Jika internet mati berhari-hari? Queue tetap menyimpan laporan di perangkat, lalu sinkron saat ada koneksi.
9. Bedanya dengan manual? RADAR mengurangi input ulang, memberi prioritas awal, dan ekspor GIS.
10. Foto palsu? Demo memakai heuristik dan validasi manusia; produksi perlu EXIF, reputasi, dan audit tambahan.
11. Integrasi BNPB? Export GeoJSON/CSV dan PostGIS memudahkan integrasi awal.
12. Kenapa tidak satelit saja? Satelit luas tapi tidak selalu melihat detail bangunan dan tertutup cuaca; laporan warga melengkapi.
13. Keterbatasan? Dataset demo terbatas, peta masih fallback, dan auth produksi belum aktif.
14. Roadmap? Latih model riil, integrasi Supabase/RLS, Leaflet cluster, dan pilot daerah.
15. Bukti yang bisa didemo? `/report`, `/offline`, `/dashboard`, `/analytics`, `/api/export/geojson`, dan Flask `/predict`.
