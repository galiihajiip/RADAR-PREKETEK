# RADAR UI Design

RADAR memakai arah visual portal publik kedaruratan Indonesia: ringan, resmi, mudah dipindai, dan tidak terasa seperti dashboard SaaS gelap.

## Arah Visual

- Latar aplikasi memakai `bg-slate-50` / `#F8FAFC`.
- Konten utama memakai kartu putih dengan `border border-slate-200`.
- Shadow dibatasi ke `shadow-sm`; hindari `shadow-xl`, `shadow-2xl`, dan panel gelap berlebihan.
- Warna identitas: navy, biru, cyan. Merah/oranye hanya untuk prioritas dan peringatan.
- Copy UI memakai Bahasa Indonesia dan menjelaskan batas demo secara jujur.

## Struktur Portal

- Top status bar menampilkan tanggal, waktu Indonesia, waktu UTC, dan status koneksi.
- Navbar meniru pola portal publik: logo kiri, navigasi tengah, tombol contact/posko kanan.
- Landing page memakai pola BMKG-like: judul besar, tab periode, banner peringatan dini, dan kartu status wilayah.
- Footer berisi ringkasan RADAR, akses cepat, dan status sistem.

## Komponen

Primitive shadcn-style tersedia di `apps/web/src/components/ui/`, termasuk `button`, `card`, `badge`, `alert`, `separator`, `table`, `tabs`, `input`, `label`, `textarea`, `select`, `sheet`, `dialog`, `dropdown-menu`, `progress`, `skeleton`, dan `tooltip`.

Komponen RADAR lama tetap tersedia di `apps/web/src/components/ui.tsx` untuk `SeverityBadge`, `MetricCard`, `SectionHeader`, `EmptyState`, `LoadingState`, dan state badge demo.

## Badge Severity

- Tidak Rusak: hijau.
- Rusak Ringan: kuning.
- Rusak Berat: oranye.
- Hancur Total: merah.
- Badge memakai background tipis dan border, bukan blok warna berat.

## Responsif

- Landing card status menjadi grid 1 kolom di mobile, 2 kolom tablet, 5 kolom desktop.
- Tabel operator tetap punya versi kartu mobile.
- Map Leaflet dibatasi minimum 360px dan maksimum sekitar 62vh agar tidak overflow di layar kecil.
