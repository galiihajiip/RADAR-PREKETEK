# RADAR — Rapid Artificial Intelligence Damage Assessment and Response

Sistem pelaporan kerusakan bangunan pascabencana: warga melapor dengan foto + koordinat GPS, AI memberi
estimasi awal tingkat kerusakan, operator memvalidasi/override/menolak sebelum bantuan diprioritaskan.

**Konteks kompetisi:** Tim PREKETEK, FIT Competition 2026, Track I — Bencana Alam (Website Development).

## Status Nyata (bukan cuma demo statis)

- **Database asli** — Supabase PostgreSQL + PostGIS, bukan data in-memory.
- **AI asli** — MobileNetV3-Small hasil training sungguhan (proof-of-concept, baru 2 dari 4 kelas: `destroyed`
  dan `minor_damage`, karena dataset foto yang tersedia masih terbatas). Fallback otomatis ke prediksi
  deterministik kalau model/AI service tidak aktif.
- **Realtime** — peta krisis & daftar laporan operator update otomatis tanpa refresh (Supabase Realtime).
- **Storage asli** — foto yang diunggah lewat jalur online tersimpan di Supabase Storage.

## Prasyarat

- Node.js 18+ dan npm
- Python 3.10+ (dites terakhir pakai 3.14)
- Git
- File `.env.local` (isi kredensial Supabase) — **minta dari ketua tim**, tidak ada di GitHub karena sengaja
  di-gitignore demi keamanan. Taruh di root folder project (sejajar dengan `package.json`).

## Setup dari Nol (laptop baru)

### 1. Clone & install dependency web

```bash
git clone https://github.com/galiihajiip/RADAR-PREKETEK.git
cd RADAR-PREKETEK
npm install
```

### 2. Taruh file `.env.local`

Minta file `.env.local` dari ketua tim (isinya URL Supabase, anon key, service role key, dll — lihat
`.env.example` untuk daftar lengkap variabelnya), lalu taruh persis di root folder project.

### 3. Setup AI service (Flask + PyTorch)

```powershell
cd apps/ai-service
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

> Mac/Linux: `python3 -m venv .venv && source .venv/bin/activate` lalu `pip install -r requirements.txt`.

Bobot model AI (`ml/models/radar_mobilenetv3_small.pt`) sudah ikut ter-clone dari GitHub — tidak perlu
training ulang.

Pastikan `apps/ai-service/.env` ada isinya (kalau belum ada, buat manual):

```
DEMO_AI_FALLBACK=false
MODEL_PATH=../../ml/models/radar_mobilenetv3_small.pt
CORS_ORIGINS=http://localhost:3000
```

### 4. Jalankan aplikasi

**Penting:** buka 2 terminal terpisah supaya venv Python tetap aktif khusus untuk AI service.

Terminal 1 (AI service — pastikan venv masih aktif dari langkah 3):

```powershell
cd apps/ai-service
.venv\Scripts\Activate.ps1
flask --app app run --host 0.0.0.0 --port 5001
```

Terminal 2 (Web app, dari root folder project):

```bash
npm run dev:web
```

Buka `http://localhost:3000`.

### 5. Cek semua nyala benar

```bash
curl http://localhost:3000/api/health
# harus: "demoMode":false, "aiServiceUrl":"http://localhost:5001"

curl http://localhost:5001/health
# harus: "model_loaded":true
```

Kalau `demoMode` masih `true`, cek lagi file `.env.local` sudah ada di root folder (bukan di `apps/web/`).

## Login Demo (tanpa password)

Pilih role dari `/login`:

| Role | Landing page | Bisa lihat apa |
|---|---|---|
| Warga (citizen) | `/report` | Form lapor kerusakan saja — tidak bisa lihat dashboard/daftar laporan (seperti Google Form) |
| Operator | `/dashboard` | Dashboard, daftar laporan, peta, validasi |
| Admin | `/dashboard/admin` | Semua akses operator + admin console, audit log |

## Alur Demo yang Disarankan

1. `/` — perkenalan RADAR.
2. Login sebagai **citizen** → `/report` → isi form, **upload foto asli** (pakai foto gedung rusak apa saja),
   submit → tunjukkan pesan sukses (tanpa link dashboard, sesuai role).
3. Logout, login sebagai **operator** → `/dashboard` → tunjukkan laporan yang baru masuk (real-time, muncul
   paling atas).
4. `/dashboard/reports/[id]` laporan yang baru dibuat → tunjukkan **foto asli** + **prediksi AI asli** (severity
   + confidence + nama model, bukan `demo-fallback`).
5. `/dashboard/map` — tunjukkan badge **"Live (Realtime)"**, titik baru muncul otomatis.
6. `/dashboard/audit` — tunjukkan riwayat aktivitas asli (laporan dibuat → AI selesai → validasi).
7. `/dashboard/analytics` — export CSV/GeoJSON/JSON.
8. Tutup dengan jujur soal keterbatasan (lihat bawah) + roadmap produksi.

## Keterbatasan yang Harus Disampaikan Jujur ke Juri

- **AI baru proof-of-concept 2 kelas** (`destroyed`, `minor_damage`) — dataset foto training masih sangat
  terbatas (83 gambar). Target proposal (4 kelas, akurasi 85%+) butuh dataset lengkap seperti xBD.
- **PWA offline-first belum penuh** — antrean laporan offline masih pakai `localStorage`, bukan Service
  Worker + IndexedDB seperti diklaim proposal. Kalau koneksi putus di tengah pengisian form, laporan tetap
  aman tersimpan & tersinkron otomatis saat online lagi — tapi app tidak bisa dibuka dari nol tanpa internet
  sama sekali (belum ada app-shell caching).
- **Eskalasi kritis otomatis belum ada** — yang ada baru banner visual di dashboard, bukan sistem deteksi
  konsentrasi kerusakan per-kelurahan dengan push notification seperti di proposal.
- **Foto pada laporan yang disinkron dari antrean offline** masih pakai placeholder, bukan foto asli (hanya
  submit langsung saat online yang memakai foto & AI asli sepenuhnya).
- RLS Supabase baru kebijakan baca publik (read-only); belum granular per-role.

## Troubleshooting

- **`demoMode: true` terus padahal `.env.local` sudah ada** — pastikan filenya di **root folder**
  (`RADAR-PREKETEK/.env.local`), bukan di `apps/web/.env.local`. Next.js baca env root lewat
  `apps/web/next.config.mjs`.
- **Port 3000/5001 sudah dipakai** — matikan proses lama (`taskkill /PID <pid> /F` di Windows) lalu jalankan
  ulang.
- **AI service jalan tapi selalu fallback (`modelVersion: demo-fallback`)** — cek `apps/ai-service/.env` ada
  dan `DEMO_AI_FALLBACK=false`, lalu restart Flask.
- **Habis re-seed database dari nol, laporan baru "hilang" dari daftar** — data seed (`database/seed/0002_dummy_10000_reports.sql`)
  punya timestamp hardcoded yang bisa menjorok ke masa depan relatif terhadap tanggal hari ini, sehingga
  mengalahkan urutan laporan asli. Jalankan:
  ```sql
  UPDATE damage_reports SET created_at = created_at - interval '10 days', updated_at = updated_at - interval '10 days' WHERE local_id LIKE 'local-cianjur-%';
  UPDATE ai_predictions SET created_at = created_at - interval '10 days' WHERE report_id IN (SELECT id FROM damage_reports WHERE local_id LIKE 'local-cianjur-%');
  UPDATE report_images SET created_at = created_at - interval '10 days' WHERE report_id IN (SELECT id FROM damage_reports WHERE local_id LIKE 'local-cianjur-%');
  UPDATE validation_reviews SET created_at = created_at - interval '10 days' WHERE report_id IN (SELECT id FROM damage_reports WHERE local_id LIKE 'local-cianjur-%');
  ```

## Struktur Monorepo

- `apps/web` — Next.js App Router (halaman, API routes, dashboard).
- `apps/ai-service` — Flask AI service (MobileNetV3-Small + fallback).
- `packages/shared` — tipe TypeScript bersama (severity, role, report, dll).
- `database` — migration SQL Supabase (jalankan via `npm run db:migrate`).
- `ml` — dataset, script training (`ml:prepare`, `ml:train`), dan bobot model.
- `scripts/db` — script Node untuk migrasi/seed/storage bucket ke Supabase asli.

## Verifikasi Cepat

```bash
npm run typecheck
npm run build:web
```
