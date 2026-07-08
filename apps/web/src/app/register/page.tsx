import Link from "next/link";
import { UserPlus } from "lucide-react";
import { AppShell } from "@/components/shell";
import { SectionHeader } from "@/components/ui";

export default function RegisterPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <SectionHeader title="Pendaftaran" description="Demo RADAR belum memerlukan pendaftaran akun baru." />
        <div className="panel text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-cyan-50 text-radar-cyan">
            <UserPlus className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl font-black text-radar-navy">Gunakan akun demo</h2>
          <p className="mt-2 text-sm text-radar-muted">
            Untuk kebutuhan MVP, RADAR memakai pemilihan role demo tanpa password. Silakan masuk sebagai warga,
            operator, atau admin dari halaman login.
          </p>
          <Link className="btn-primary mt-5" href="/login">
            Pilih role demo
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
