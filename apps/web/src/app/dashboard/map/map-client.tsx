"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { SeverityBadge } from "@/components/ui";
import { SEVERITY, SEVERITY_COLORS, SEVERITY_LABEL_ID, type DamageReport, type Severity } from "@radar/shared";

const CIANJUR_CENTER: [number, number] = [-6.816, 107.079];

export function MapClient({ reports }: { reports: DamageReport[] }) {
  const [severityFilter, setSeverityFilter] = useState<Severity | "">("");

  const filtered = useMemo(() => {
    const list = severityFilter ? reports.filter((report) => report.severity === severityFilter) : reports;
    return list.slice(0, 500);
  }, [reports, severityFilter]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-2xl border border-radar-border bg-white p-2 shadow-sm">
        <MapContainer center={CIANJUR_CENTER} zoom={12} scrollWheelZoom style={{ height: "min(62vh, 560px)", minHeight: "360px", width: "100%", borderRadius: "0.75rem" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((report) => (
            <CircleMarker
              key={report.id}
              center={[report.latitude, report.longitude]}
              radius={report.severity === "destroyed" ? 9 : report.severity === "major_damage" ? 7 : 5}
              pathOptions={{
                color: SEVERITY_COLORS[report.severity],
                fillColor: SEVERITY_COLORS[report.severity],
                fillOpacity: 0.8
              }}
            >
              <Popup>
                <p className="font-bold">{report.address}</p>
                <p className="mt-1 text-xs">{SEVERITY_LABEL_ID[report.severity]} &middot; {Math.round(report.confidence * 100)}% confidence</p>
                <Link className="mt-2 inline-block text-xs font-bold text-radar-blue" href={`/dashboard/reports/${report.id}`}>
                  Buka detail &rarr;
                </Link>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <aside className="grid h-fit gap-4">
        <div className="panel">
          <h2 className="font-black text-radar-navy">Filter Kerusakan</h2>
          <div className="mt-3 grid gap-2">
            <button
              className={`rounded-xl border px-3 py-2 text-left text-sm font-bold ${severityFilter === "" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-radar-border bg-white text-radar-navy hover:bg-slate-50"}`}
              onClick={() => setSeverityFilter("")}
            >
              Semua severity ({reports.length.toLocaleString("id-ID")})
            </button>
            {SEVERITY.filter((severity) => severity !== "unknown").map((severity) => {
              const count = reports.filter((report) => report.severity === severity).length;
              return (
                <button
                  key={severity}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-bold ${severityFilter === severity ? "border-blue-600 bg-blue-50 text-blue-700" : "border-radar-border bg-white text-radar-navy hover:bg-slate-50"}`}
                  onClick={() => setSeverityFilter(severity)}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[severity] }} aria-hidden="true" />
                    {SEVERITY_LABEL_ID[severity]}
                  </span>
                  <span className="tabular">{count.toLocaleString("id-ID")}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="panel">
          <h2 className="font-black text-radar-navy">Legenda</h2>
          <div className="mt-3 grid gap-2 text-sm">
            {SEVERITY.filter((severity) => severity !== "unknown").map((severity) => (
              <div key={severity} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[severity] }} aria-hidden="true" />
                <SeverityBadge severity={severity} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-radar-muted">
            Menampilkan maksimum 500 titik demo per filter agar peta tetap responsif.
          </p>
        </div>
      </aside>
    </div>
  );
}
