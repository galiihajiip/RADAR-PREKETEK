# RADAR Frontend Design Guidelines

> Project: **RADAR — Rapid Artificial Intelligence Damage Assessment and Response**  
> Team: **PREKETEK**  
> Context: Web Development MVP for post-disaster damage reporting, AI-assisted assessment, geospatial command dashboard, validation workflow, escalation, analytics, export, and data sovereignty.

---

## 1. Design Goals

RADAR must feel like a public emergency response portal and an operational command dashboard, not a generic SaaS landing page.

Main goals:

- **Humanitarian**: prioritize clarity, empathy, and speed for citizens reporting disaster damage.
- **Trustworthy**: use an official, calm, public-service visual language.
- **Command-center ready**: operators should immediately understand report priority, severity, validation status, and escalation risk.
- **Mobile-first for citizens**: `/report` and `/offline` must be easy to use on small screens during unstable conditions.
- **Desktop-first for operators**: `/dashboard`, `/dashboard/map`, `/dashboard/reports`, analytics, admin, and audit must work well on wider screens.
- **Honest demo mode**: clearly show which parts are demo fallback, especially AI and storage limitations.
- **Consistent frontend system**: all pages must use the same card, badge, spacing, color, and status logic.

---

## 2. Visual Direction

RADAR uses a **public emergency portal style** inspired by Indonesian government/public-service websites and disaster information portals, but must not copy any specific institution branding, logo, exact layout, menu text, icon, or visual asset.

The interface should feel:

- official,
- clean,
- calm,
- operational,
- credible,
- fast to scan,
- useful during emergency response.

Visual characteristics:

- white or near-white page background,
- large readable headings,
- calm navy/blue/cyan identity,
- clear orange/red warning states,
- rounded information cards,
- soft borders and subtle shadows,
- spacious layout,
- severity-based visual hierarchy,
- no excessive gradients, animations, or decorative effects.

Do not design RADAR like a flashy startup website. RADAR should look like a **post-disaster assessment and response portal**.

---

## 3. Color System

| Token | Hex | Usage |
|---|---:|---|
| Primary Navy | `#0B1F3A` | Main brand color, headings, navbar text, dashboard sidebar, serious command tone |
| Command Blue | `#0F4C81` | Primary CTA, active navigation, dashboard highlights |
| Radar Cyan | `#00A8CC` | Secondary accent, sync indicators, map/radar UI details |
| Disaster Red | `#D62828` | Critical/destroyed severity, urgent escalation, destructive actions |
| Warning Orange | `#F77F00` | Warning banner, major damage, pending attention |
| Safe Green | `#2A9D8F` | Safe/no damage, success, synced state |
| Alert Yellow | `#F4D35E` | Minor warning, needs review, low-level alert |
| Cloud White | `#F8FAFC` | Page background and soft card surfaces |
| Slate Text | `#1E293B` | Main readable text |
| Muted Gray | `#64748B` | Helper text, metadata, secondary labels |
| Border Soft | `#E2E8F0` | Borders, dividers, card outlines |
| Dark Surface | `#071A2E` | Dark sidebar, footer, command center sections |

Rules:

- Use **Primary Navy** for RADAR identity and serious command information.
- Use **Command Blue** for primary actions like `Laporkan Kerusakan`, `Masuk Dashboard`, and active tabs.
- Use **Radar Cyan** sparingly for system indicators like online/sync status.
- Use **Disaster Red** only for critical information or destructive actions.
- Use **Warning Orange** for warning banners and high-priority review states.
- Use **Safe Green** for success, safe status, and synced data.
- Do not use severity colors decoratively. Severity colors must always carry meaning.

---

## 4. Severity Design

Severity is one of the most important visual systems in RADAR. It must be consistent across badges, cards, tables, map markers, filters, analytics, and detail pages.

| Severity | Indonesian Label | Color | Icon Suggestion | Badge Behavior | Map Marker Behavior | Priority Meaning |
|---|---|---:|---|---|---|---|
| `no_damage` | Aman / Tidak Rusak | Safe Green `#2A9D8F` | shield, check-circle | soft green badge | small green marker | no immediate damage response needed |
| `minor_damage` | Rusak Ringan | Alert Yellow `#F4D35E` | alert-circle | yellow badge with dark text | small yellow marker | monitor and verify when possible |
| `major_damage` | Rusak Berat | Warning Orange `#F77F00` | triangle-alert | orange badge | medium orange marker | high priority validation |
| `destroyed` | Hancur Total | Disaster Red `#D62828` | siren, flame, alert-octagon | strong red badge | larger red marker with pulse optional | critical response priority |
| `unknown` | Belum Diketahui | Muted Gray `#64748B` | help-circle | gray badge | neutral gray marker | requires review or insufficient evidence |

Severity rules:

- `destroyed` must be visually dominant but not visually chaotic.
- `unknown` must never look safe.
- `major_damage` and `destroyed` should be easy to distinguish.
- Use text label + color together. Never rely only on color.
- Probability/confidence must appear near AI-generated severity when possible.

---

## 5. Typography

Use the current project font or system font. Do not require a new custom font unless already available.

Recommended font stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Typography rules:

- **Page headings**: large, bold, clear. Example: `Peta Kerusakan Pascabencana`.
- **Section headings**: medium-bold and short.
- **Body text**: readable, not too dense.
- **Labels**: small, semibold, muted color.
- **Metric numbers**: large, bold, high contrast.
- **Helper text**: muted gray, short, practical.
- **Validation warnings**: bold enough to notice, but not alarmist unless critical.

Example hierarchy:

```text
H1: 40-48px desktop, 30-34px mobile
H2: 28-32px desktop, 24-28px mobile
H3/Card Title: 18-22px
Body: 14-16px
Label/Meta: 12-14px
Metric Number: 32-48px
```

---

## 6. Layout Principles

### Public Layout

Used by `/`, `/login`, `/register`, `/unauthorized`.

- Clean white background.
- Top status bar for date/time/demo/sync.
- Main navbar with RADAR identity and primary CTA.
- Large hero or page heading.
- Cards with soft border and rounded corners.
- Footer with project context and demo limitation note.

### Citizen Mobile Flow

Used by `/report` and `/offline`.

- Mobile-first layout.
- One-column form.
- Large tap targets.
- Clear step-by-step guidance.
- Sticky bottom action when useful.
- Offline/sync status must be visible.
- Avoid complex tables.

### Operator Dashboard Layout

Used by `/dashboard`, `/dashboard/map`, `/dashboard/reports`, `/dashboard/reports/[id]`, `/dashboard/analytics`.

Desktop:

- Sidebar navigation.
- Topbar with page title, online status, notification bell, demo badge.
- Metric cards at the top.
- Main content grid.
- Tables and map/list split views.

Mobile:

- Stack cards vertically.
- Use mobile bottom navigation if already present.
- Tables should become cards.
- Validation actions can become sticky bottom buttons.

### Admin Layout

Used by `/dashboard/admin`, `/dashboard/audit`, `/settings`.

- Clear system cards.
- Demo Mode badge visible.
- Settings are grouped by purpose.
- Audit log must be readable on desktop and mobile.

### Spacing

Recommended spacing:

- Page container: `px-4` mobile, `px-6` tablet, `px-8` desktop.
- Card padding: `p-4` mobile, `p-6` desktop.
- Section gap: `gap-6` to `gap-8`.
- Card radius: `rounded-xl` or `rounded-2xl` for key cards.
- Border: `border border-slate-200` or project token equivalent.

---

## 7. Navigation and Mega Menu

RADAR may use a public emergency portal navigation pattern.

### Top Status Bar

Purpose: show operational context.

Recommended content:

```text
RABU, 8 JULI 2026                                      WAKTU SISTEM 14:20:36 / LAST SYNC 07:20 UTC / DEMO MODE
```

Can include:

- current date,
- system time,
- UTC sync time,
- online/offline state,
- demo mode badge.

### Main Navbar

Recommended items:

```text
[RADAR Logo]  Beranda  Lapor Kerusakan  Peta Krisis  Dashboard  Data & Ekspor  Tentang  [Laporkan Kerusakan]
```

Rules:

- Active navigation can use a rounded soft blue background.
- Primary CTA should be visible.
- Do not overload the navbar with too many links.
- Dashboard pages may simplify the navbar and rely on sidebar/topbar.

### Mega Menu Groups

Use mega menu only on desktop/tablet. On mobile, use drawer navigation.

Left card:

```text
RADAR
Rapid Artificial Intelligence Damage Assessment and Response

Sistem pelaporan, pemetaan, dan validasi kerusakan pascabencana berbasis AI dan geospasial.

Mode Demo: beberapa fitur menggunakan data simulasi dan AI fallback.
```

Group 1 — Laporan Warga:

- Buat Laporan Kerusakan
- Cek Status Laporan
- Panduan Pelaporan
- Offline Queue

Group 2 — Command Center:

- Dashboard Operator
- Peta Krisis
- Laporan Masuk
- Validasi AI

Group 3 — Data & Respons:

- Analytics
- Export CSV
- Export GeoJSON
- Audit Log
- Data Sovereignty

Rules:

- Do not use hover-only interactions on mobile.
- Each menu item should have a clear label and short optional description.
- Do not copy any existing public institution menu text exactly.

---

## 8. Component Rules

### Card

Base card should be used everywhere for consistency:

- rounded corners,
- soft border,
- white or cloud background,
- subtle shadow,
- clear header/content/footer separation.

Use cards for:

- feature cards,
- metric cards,
- report cards,
- AI analysis panel,
- offline queue item,
- admin settings,
- audit summary.

### MetricCard

Should include:

- label,
- large value,
- optional delta/helper text,
- optional icon,
- optional severity/status accent.

Example labels:

- `Total Laporan`
- `Hancur Total`
- `Menunggu Validasi`
- `Tersinkron Offline`
- `Rata-rata Confidence AI`

### SeverityBadge

Must include:

- text label,
- severity color,
- accessible contrast,
- optional icon.

Never show color without label.

### StatusBadge

Use consistent labels:

- `Draft`
- `Dalam Antrean`
- `Terkirim`
- `AI Pending`
- `AI Selesai`
- `Tervalidasi`
- `Ditolak`
- `Terekskalasi`

### RoleBadge

Labels:

- `Warga`
- `Operator`
- `Admin`

Use role badges in dashboard topbar, admin overview, and settings.

### ReportCard

Used on mobile and dashboard previews.

Must show:

- report title,
- location/address,
- severity badge,
- status badge,
- confidence,
- reported time,
- CTA: `Lihat Detail`.

### ReportTable

Desktop only. Must support:

- title,
- severity,
- confidence,
- status,
- sync state,
- location,
- reported time,
- action.

Mobile must use ReportCard instead.

### ValidationActionPanel

Must show safe operator actions:

- `Confirm AI`
- `Override Severity`
- `Reject Report`
- `Request More Info` if supported

Rules:

- destructive action must have confirmation or clear warning.
- after action, show success/error feedback.
- show audit log note when relevant.

### OfflineQueueCard

Must show:

- local id,
- report title,
- queue status,
- attempts,
- last error if failed,
- actions: `Sync Now`, `Retry`, `Delete`.

Copy example:

```text
Data laporan tetap aman di perangkat sampai koneksi kembali tersedia.
```

### AIAnalysisPanel

Must show:

- predicted severity,
- confidence,
- probability bars,
- model name,
- model version,
- processing time,
- AI fallback notice,
- sovereignty note.

Must not overclaim real AI.

### ExportPanel

Buttons:

- `Export CSV`
- `Export GeoJSON`
- `Export JSON` if available

Export descriptions must explain what each format is for.

### AuditLogTable

Desktop:

- table with time, action, actor, target report, note.

Mobile:

- card list.

Audit actions should use readable Indonesian labels where possible.

### NotificationBell

Must show:

- unread count,
- critical items visually prioritized,
- notification list,
- link to related report when available.

---

## 9. Page-by-Page UX

### `/` — Landing Page

Purpose: introduce RADAR and guide users to report or dashboard demo.  
Primary user: judges, citizens, operators.

Key sections:

- top status bar,
- public navbar,
- hero,
- alert/escalation banner,
- feature cards,
- report flow explanation,
- impact metrics,
- demo accounts teaser,
- footer.

Empty state: not applicable.  
Error state: show simple fallback copy if demo data unavailable.  
Mobile behavior: hero and cards stack vertically, CTA visible near top.

Example copy:

```text
RADAR: Pemetaan Kerusakan Pascabencana Berbasis AI dan Geospasial
Laporkan kerusakan lewat browser, tetap aman saat offline, dan bantu operator memprioritaskan bantuan secara real-time.
```

---

### `/login`

Purpose: allow demo role access.  
Primary user: citizen, operator, admin, judges.

Key sections:

- login card,
- email/password fields,
- demo role buttons,
- demo mode note.

Empty state: not applicable.  
Error state: invalid account/password message.  
Mobile behavior: centered single card.

---

### `/report`

Purpose: citizen submits disaster damage report.  
Primary user: citizen.

Key sections:

- event selector,
- photo/mock image input,
- GPS capture,
- manual address fallback,
- title,
- description,
- severity guess,
- contact optional,
- consent checkbox,
- submit button,
- offline/draft notice.

Empty state: blank form with helpful guidance.  
Error state: validation errors per field.  
Mobile behavior: one-column form, large buttons, sticky submit if useful.

---

### `/offline`

Purpose: show local offline queue and sync controls.  
Primary user: citizen and demo operator.

Key sections:

- sync summary cards,
- queue list,
- retry/sync/delete actions,
- reassurance copy.

Empty state:

```text
Tidak ada laporan dalam antrean offline.
```

Error state: show failed sync reason and retry button.  
Mobile behavior: queue items as cards.

---

### `/dashboard`

Purpose: operator command center overview.  
Primary user: operator/admin.

Key sections:

- metric cards,
- critical escalation banner,
- map preview or placeholder,
- latest reports panel,
- live incident feed,
- CTAs to reports, analytics, admin.

Empty state: show no reports yet with demo seed CTA if available.  
Error state: show data load error card.  
Mobile behavior: stacked cards, no dense tables.

---

### `/dashboard/map`

Purpose: geospatial overview of damage reports.  
Primary user: operator/admin.

Key sections:

- map or map-like placeholder,
- severity legend,
- filters severity/status/confidence,
- selected report preview,
- link to detail.

Empty state: show empty map state.  
Error state: if Leaflet/map fails, show map placeholder fallback.  
Mobile behavior: filters collapse, selected report below map.

---

### `/dashboard/reports`

Purpose: report management list.  
Primary user: operator/admin.

Key sections:

- search,
- filters,
- report table desktop,
- report cards mobile,
- detail CTA.

Empty state:

```text
Belum ada laporan yang sesuai filter.
```

Error state: data load error with retry.  
Mobile behavior: cards instead of table.

---

### `/dashboard/reports/[id]`

Purpose: inspect one report and validate AI result.  
Primary user: operator/admin.

Key sections:

- report header,
- evidence image panel,
- metadata,
- location panel,
- AI analysis panel,
- probability bars,
- validation action panel,
- timeline/audit preview.

Empty state: report not found.  
Error state: validation action failed.  
Mobile behavior: stacked content with sticky validation actions if useful.

---

### `/dashboard/analytics`

Purpose: summarize reports and provide export tools.  
Primary user: operator/admin/judges.

Key sections:

- summary metric cards,
- severity distribution,
- validation stats,
- offline synced count,
- export panel,
- SDG impact cards if present.

Empty state: no reports yet.  
Error state: export failed or analytics unavailable.  
Mobile behavior: cards and simple bars.

---

### `/dashboard/admin`

Purpose: demo system administration and settings preview.  
Primary user: admin/judges.

Key sections:

- demo mode badge,
- AI service status,
- data sovereignty card,
- system settings preview,
- demo tools,
- user role overview.

Empty state: settings unavailable.  
Error state: demo action failed.  
Mobile behavior: stacked cards.

---

### `/dashboard/audit`

Purpose: show traceability of system actions.  
Primary user: admin/operator/judges.

Key sections:

- audit summary,
- action filters if available,
- audit table desktop,
- audit cards mobile.

Empty state:

```text
Belum ada aktivitas audit.
```

Error state: audit data unavailable.  
Mobile behavior: card timeline.

---

### `/settings`

Purpose: user/profile/app mode settings.  
Primary user: logged-in demo user.

Key sections:

- profile card,
- role badge,
- app mode,
- offline queue status,
- logout button.

Empty state: not applicable.  
Error state: user session unavailable.  
Mobile behavior: simple cards.

---

### `/unauthorized`

Purpose: explain wrong-role/no-access state.  
Primary user: any user.

Key sections:

- clear message,
- current role if available,
- CTA back to login or dashboard.

Example copy:

```text
Akses tidak tersedia untuk peran Anda.
Silakan masuk dengan akun yang sesuai untuk membuka halaman ini.
```

Mobile behavior: centered card.

---

## 10. Interaction States

### Loading

Use skeleton/card placeholders for dashboard and reports.

Copy:

```text
Memuat data laporan...
```

### Empty

State must explain what happened and what user can do next.

Example:

```text
Belum ada laporan masuk. Coba buat laporan demo dari halaman Lapor Kerusakan.
```

### Success

Use green/safe visual cue.

Example:

```text
Laporan berhasil dikirim dan siap diproses.
```

### Error

Use clear short error message and recovery action.

Example:

```text
Gagal memuat laporan. Periksa koneksi lalu coba lagi.
```

### Offline

Use calm warning, not panic.

Example:

```text
Anda sedang offline. Laporan akan disimpan di perangkat dan disinkronkan saat koneksi kembali.
```

### Syncing

Example:

```text
Menyinkronkan laporan...
```

### Failed Sync

Example:

```text
Sinkronisasi gagal. Data tetap tersimpan dan dapat dicoba ulang.
```

### Validation Success

Example:

```text
Validasi berhasil disimpan dan tercatat di audit log.
```

### Rejected Report

Use warning/destructive styling but keep explanation clear.

Example:

```text
Laporan ditolak. Status dan alasan penolakan tercatat di audit log.
```

### AI Fallback Notice

Must be visible in AI-related panels.

Example:

```text
Mode demo: prediksi menggunakan mock-fallback-v1. Target produksi menggunakan inferensi lokal MobileNetV3-Small.
```

### Demo Mode Notice

Dashboard/admin pages should show demo mode.

Example:

```text
RADAR Demo Mode — data dan sebagian layanan menggunakan simulasi untuk kebutuhan MVP.
```

---

## 11. Accessibility Rules

- Every input must have a visible label.
- Icon-only buttons must include `aria-label`.
- Evidence images must include meaningful alt text.
- Interactive elements must be reachable by keyboard.
- Use visible focus ring.
- Do not communicate status using color only.
- Tap target should be at least 44px on mobile.
- Text contrast must be readable on white and dark surfaces.
- Error messages should be placed near the related field.
- Avoid excessive animation.
- Respect reduced motion preferences.
- Table data must remain readable when converted to cards on mobile.
- Critical actions should be confirmable or clearly described.

---

## 12. Data Honesty and Demo Mode

RADAR must be transparent about its MVP limitations.

Rules:

- Never claim the fallback is a real trained AI model.
- Show `model_version: mock-fallback-v1` where relevant.
- Explain that production target uses local MobileNetV3-Small inference.
- If map is placeholder, do not call it a full GIS implementation.
- If storage is demo/in-memory/localStorage, explain it as MVP limitation.
- Data sovereignty explanation must be clear and not overclaiming.
- Operator validation must be framed as human-in-the-loop decision support.

Good copy:

```text
AI membantu triase awal, tetapi keputusan akhir tetap divalidasi operator.
```

Good sovereignty copy:

```text
Target produksi RADAR menggunakan inferensi lokal dan database yang dikelola sendiri agar data laporan kebencanaan tetap berada dalam kendali sistem.
```

Avoid:

```text
AI kami 100% akurat.
Sistem ini sudah production-ready.
Data selalu aman tanpa risiko.
```

---

## 13. Frontend Implementation Checklist

Before finishing any frontend change, check:

- [ ] Page follows RADAR public emergency portal style.
- [ ] UI copy is in Indonesian.
- [ ] Mobile layout works at around 390px width.
- [ ] Tablet layout works at around 834px width.
- [ ] Desktop layout works at around 1440px width.
- [ ] Cards, badges, and buttons are visually consistent.
- [ ] Severity colors are consistent.
- [ ] Loading state exists if data is fetched.
- [ ] Empty state exists if data can be empty.
- [ ] Error state exists if action/data can fail.
- [ ] Offline/sync state is visible where relevant.
- [ ] AI fallback notice is visible where relevant.
- [ ] Demo limitation is not hidden.
- [ ] Validation actions are clear and safe.
- [ ] Export buttons explain CSV/GeoJSON purpose.
- [ ] Icon buttons have `aria-label`.
- [ ] Form fields have labels and errors.
- [ ] Tables have mobile card alternatives.
- [ ] No copied branding/assets from any existing institution.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build:web`.
- [ ] Run `npm run test` when relevant.

---

## 14. Suggested Future Polish

After Block 3, frontend polish should focus on:

1. consistent public navbar + dashboard shell,
2. stronger alert/escalation banner,
3. better mobile report form flow,
4. map placeholder visual improvement or Leaflet upgrade,
5. dashboard card spacing and responsive grids,
6. better audit log readability,
7. final demo script alignment with UI labels.

Keep polish realistic. Do not introduce risky dependencies close to presentation unless the existing MVP is already stable.
