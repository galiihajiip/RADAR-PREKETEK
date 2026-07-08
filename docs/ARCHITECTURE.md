# Architecture

## Ringkasan

RADAR PREKETEK memakai arsitektur single app MVP berbasis Next.js App Router. Untuk kebutuhan hackathon, sistem mengutamakan jalur demo lokal dengan fallback agar presentasi tetap berjalan walau database, service AI, atau koneksi internet tidak tersedia.

## Komponen Utama

- Web App: Next.js App Router, TypeScript, Tailwind CSS.
- UI Warga: form laporan, status laporan, dan antrean offline.
- UI Operator: dashboard, peta/list krisis, detail laporan, dan validasi.
- UI Admin: konfigurasi demo, status AI, eskalasi, dan audit log.
- API Layer: route handlers untuk laporan, validasi, analytics, dan export.
- Demo Store: data lokal/in-memory untuk menjalankan MVP tanpa database produksi.
- AI Fallback: prediksi severity demo saat model lokal tidak tersedia.
- Export: endpoint CSV dan GeoJSON untuk kebutuhan posko atau GIS.

## Alur Data MVP

1. Warga mengisi laporan kerusakan.
2. Browser menyimpan laporan sebagai draft/queue jika offline.
3. Saat online atau saat tombol sinkronisasi dipakai, laporan dikirim ke API demo.
4. API menyimpan laporan ke demo store.
5. API meminta prediksi ke AI service atau memakai fallback demo.
6. Operator membaca laporan dari dashboard dan detail page.
7. Operator melakukan validasi atau override severity.
8. Sistem mencatat aksi operator di audit log demo.
9. Analytics dan export membaca data dari store yang sama.

## Format Respons API

Success:

```ts
{
  success: true,
  data: unknown
}
```

Error:

```ts
{
  success: false,
  error: {
    code: string,
    message: string
  }
}
```

## Severity

- `no_damage`
- `minor_damage`
- `major_damage`
- `destroyed`
- `unknown`

## Mode Demo

Mode demo harus eksplisit di UI dan dokumentasi. Jika `DEMO_MODE=true`, aplikasi boleh memakai data lokal, AI fallback, dan simulasi eskalasi. Label fallback harus terlihat agar juri tidak salah mengira bahwa model produksi atau infrastruktur penuh sudah berjalan.

## Target Produksi Setelah MVP

- PostgreSQL + PostGIS untuk data spasial.
- Supabase-compatible schema dan storage.
- AI service lokal dengan model yang benar-benar dilatih.
- Autentikasi dan role-based access control produksi.
- Audit log persisten.
- Realtime update untuk dashboard operator.
