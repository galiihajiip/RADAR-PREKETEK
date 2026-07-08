"use client";

import { useRouter } from "next/navigation";
import { Building2, Headphones, ShieldCheck, UserRound } from "lucide-react";
import type { Role } from "@radar/shared";
import { AppShell } from "@/components/shell";
import { RoleBadge, SectionHeader } from "@/components/ui";
import { DEMO_USERS, defaultPathForRole, setDemoUser } from "@/lib/demo-auth";

const roleCards: Array<{
  role: Role;
  title: string;
  description: string;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    role: "citizen",
    title: "Pelapor Warga",
    description: "Untuk warga atau relawan lapangan yang mengirim foto, lokasi, dan deskripsi kerusakan.",
    features: ["Kirim laporan kerusakan", "Antrean offline", "Fallback GPS manual"],
    icon: UserRound
  },
  {
    role: "operator",
    title: "Operator Posko",
    description: "Untuk petugas posko yang melihat prioritas, peta, validasi AI, analytics, dan ekspor.",
    features: ["Dashboard", "Validasi AI", "Ekspor GeoJSON/CSV"],
    icon: Headphones
  },
  {
    role: "admin",
    title: "Admin Sistem",
    description: "Untuk pengelola sistem yang menyiapkan role, eskalasi, dan audit demo.",
    features: ["Admin console", "Eskalasi", "Audit trail"],
    icon: ShieldCheck
  }
];

export default function LoginPage() {
  const router = useRouter();

  function login(role: Role) {
    setDemoUser(role);
    router.push(defaultPathForRole(role));
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Pilih Role Demo"
          description="RADAR memakai role-based workflow. Untuk presentasi, pilih salah satu role berikut tanpa password agar alur citizen, operator, dan admin cepat dicoba."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {roleCards.map((card) => {
            const Icon = card.icon;
            const user = DEMO_USERS[card.role];
            return (
              <button
                className="panel group text-left transition hover:border-radar-cyan hover:bg-slate-50"
                key={card.role}
                onClick={() => login(card.role)}
                type="button"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-radar-navy text-radar-cyan">
                    <Icon className="h-6 w-6" />
                  </span>
                  <RoleBadge role={card.role} />
                </div>
                <h2 className="mt-5 text-2xl font-black text-radar-navy">{card.title}</h2>
                <p className="mt-2 min-h-16 text-sm leading-6 text-radar-muted">{card.description}</p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-radar-muted">Akun demo</p>
                  <p className="mt-2 font-bold text-radar-navy">{user.email}</p>
                  <p className="text-sm text-radar-muted">{user.organization}</p>
                </div>
                <ul className="mt-5 grid gap-2">
                  {card.features.map((feature) => (
                    <li className="flex items-center gap-2 text-sm font-bold text-radar-navy" key={feature}>
                      <Building2 className="h-4 w-4 text-radar-cyan" /> {feature}
                    </li>
                  ))}
                </ul>
                <span className="btn-primary mt-6 w-full group-hover:bg-radar-blue">Masuk sebagai {card.role}</span>
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
