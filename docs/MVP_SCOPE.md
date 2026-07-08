# MVP Scope

## Tujuan

RADAR PREKETEK adalah MVP hackathon untuk menunjukkan alur asesmen kerusakan bangunan pascabencana dari laporan warga sampai keputusan operator. Fokus utama adalah demo yang runnable, jelas, dan jujur terhadap fallback.

## Alur Demo Utama

1. Landing page menjelaskan RADAR dan peran pengguna.
2. Demo login memilih peran warga, operator, atau admin.
3. Warga membuat laporan kerusakan berisi foto, lokasi, deskripsi, dan persetujuan.
4. Jika offline, laporan terlihat masuk antrean lokal.
5. Saat sinkronisasi, laporan masuk ke data demo.
6. Operator melihat laporan di dashboard, peta krisis, dan daftar prioritas.
7. Detail laporan menampilkan panel prediksi AI fallback.
8. Operator memvalidasi, override, menolak, atau meminta informasi tambahan.
9. Laporan kritis memunculkan notifikasi atau eskalasi demo.
10. Analytics menampilkan ringkasan dan export CSV/GeoJSON.
11. Admin melihat pengaturan, status AI, audit log, dan simulasi eskalasi.

## Yang Masuk MVP

- Next.js App Router dengan TypeScript dan Tailwind CSS.
- UI responsif untuk mobile, tablet, dan desktop.
- Copy UI bahasa Indonesia.
- Demo data store lokal atau in-memory.
- Offline queue visual dan status sinkronisasi.
- AI fallback prediction yang diberi label jelas sebagai fallback/demo.
- Dashboard operator dengan peta atau panel peta krisis.
- Detail laporan dan validasi operator.
- Notifikasi atau eskalasi berbasis severity.
- Analytics sederhana.
- Export CSV dan GeoJSON.
- Dokumentasi lokal untuk demo, arsitektur, dan batasan.

## Yang Tidak Wajib Untuk MVP

- Model AI hasil training penuh.
- Deployment produksi.
- Integrasi Supabase penuh.
- PostGIS produksi yang selalu aktif.
- Autentikasi produksi.
- Realtime multi-user yang sempurna.
- Upload storage produksi.
- Map tile yang bergantung penuh pada internet.

## Prinsip Prioritas

- Demo end-to-end lebih penting dari fitur besar yang belum selesai.
- Jangan menyembunyikan fallback.
- Jangan klaim AI sungguhan jika yang berjalan adalah deterministic fallback.
- Jangan menambah dependency kecuali jelas mempercepat MVP.
- Setiap perubahan harus menjaga aplikasi tetap bisa dijalankan.
