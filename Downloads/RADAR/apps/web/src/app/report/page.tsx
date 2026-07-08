"use client";

import { useState } from "react";
import { Camera, CheckCircle2, LocateFixed, Send, WifiOff } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { AppShell } from "@/components/shell";
import { OnlineStatusBadge, SectionHeader } from "@/components/ui";

export default function ReportPage() {
  const [queued, setQueued] = useState(false);
  const [lat, setLat] = useState("-6.816");
  const [lng, setLng] = useState("107.079");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  function handleGetLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation tidak didukung di browser ini.");
      return;
    }
    setIsLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLng(position.coords.longitude.toFixed(6));
        setIsLocating(false);
      },
      (error) => {
        setLocationError("Gagal mendapatkan lokasi. Pastikan izin GPS diizinkan.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  }

  function submit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    localStorage.setItem("radar-last-report", JSON.stringify({ ...payload, localId: `local-${Date.now()}`, status: "offline_queued" }));
    setQueued(true);
  }

  return (
    <AppShell>
      <AuthGuard allowed={["citizen", "operator", "admin"]}>
      <SectionHeader title="Laporan Warga" description="Form besar dan ringkas untuk kondisi darurat. Jika offline, laporan masuk queue dan disinkronkan saat jaringan kembali." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form action={submit} className="panel grid gap-5">
          <div className="rounded-2xl bg-radar-navy p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-radar-cyan">Citizen intake</p>
            <h2 className="mt-2 text-2xl font-black">Laporkan kondisi bangunan</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Data disimpan dulu di perangkat saat koneksi buruk, lalu disinkronkan otomatis ketika jaringan kembali.</p>
          </div>
          <label className="grid gap-1 text-sm font-bold">Nama pelapor<input name="reporterName" required className="field" defaultValue="Demo Citizen" /></label>
          <label className="grid gap-1 text-sm font-bold">Alamat/lokasi<input name="address" required className="field" defaultValue="Cugenang, Cianjur" /></label>
          <label className="grid gap-1 text-sm font-bold">Deskripsi<textarea name="description" required rows={5} className="field resize-none" defaultValue="Bangunan retak parah, penghuni membutuhkan bantuan pemeriksaan struktur." /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold">Latitude<input name="latitude" required className="field" value={lat} onChange={(e) => setLat(e.target.value)} /></label>
            <label className="grid gap-1 text-sm font-bold">Longitude<input name="longitude" required className="field" value={lng} onChange={(e) => setLng(e.target.value)} /></label>
          </div>
          <div>
            <button 
              type="button" 
              onClick={handleGetLocation} 
              disabled={isLocating}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-radar-border bg-slate-50 px-4 py-2.5 text-sm font-bold text-radar-navy transition hover:bg-slate-100 disabled:opacity-50"
            >
              <LocateFixed className="h-4 w-4 text-radar-cyan" /> 
              {isLocating ? "Mendeteksi lokasi..." : "Gunakan lokasi saya saat ini"}
            </button>
            {locationError && <p className="mt-2 text-xs font-bold text-radar-red">{locationError}</p>}
          </div>
          <label className="grid gap-2 text-sm font-bold">
            Foto kerusakan
            <span className="flex min-h-28 items-center justify-center gap-3 rounded-2xl border border-dashed border-radar-cyan bg-cyan-50/60 p-4 text-radar-blue">
              <Camera className="h-5 w-5" /> Upload image
              <input name="image" type="file" accept="image/*" className="sr-only" />
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm"><input name="consent" required type="checkbox" defaultChecked className="mt-1" /> Saya setuju foto dan lokasi digunakan untuk respons bencana.</label>
          <button className="btn-primary w-full" type="submit"><Send className="h-4 w-4" /> Kirim laporan</button>
        </form>
        <aside className="grid h-fit gap-4">
        <div className="panel">
          <OnlineStatusBadge online={!queued} />
          <h2 className="mt-4 text-lg font-black text-radar-navy">{queued ? "Laporan masuk queue" : "Siap dikirim"}</h2>
          <p className="mt-2 text-sm text-radar-muted">
            {queued ? "Buka /offline untuk melihat status. Saat online, API demo menerima laporan dan AI fallback memberi status ai_pending bila layanan mati." : "Matikan Network di DevTools untuk memperagakan offline-first."}
          </p>
        </div>
        <div className="panel grid gap-3">
          <p className="flex items-center gap-2 text-sm font-bold text-radar-navy"><LocateFixed className="h-4 w-4 text-radar-cyan" /> GPS/manual coordinate ready</p>
          <p className="flex items-center gap-2 text-sm font-bold text-radar-navy"><WifiOff className="h-4 w-4 text-radar-orange" /> Offline queue enabled</p>
          <p className="flex items-center gap-2 text-sm font-bold text-radar-navy"><CheckCircle2 className="h-4 w-4 text-radar-green" /> Human validation required</p>
        </div>
        </aside>
      </div>
      </AuthGuard>
    </AppShell>
  );
}
