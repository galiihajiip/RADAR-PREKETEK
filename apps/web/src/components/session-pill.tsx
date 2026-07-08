"use client";

import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { clearDemoUser, getDemoUser, type DemoUser } from "@/lib/demo-auth";
import { RoleBadge } from "./ui";

export function SessionPill() {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    setUser(getDemoUser());
  }, []);

  if (!user) {
    return (
      <Link className="inline-flex h-9 items-center gap-2 rounded-lg bg-radar-navy px-3 text-xs font-black text-white" href="/login">
        <LogIn className="h-4 w-4" /> Login
      </Link>
    );
  }

  return (
    <button
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-radar-border bg-white px-3 text-xs font-black text-radar-navy"
      onClick={() => {
        clearDemoUser();
        setUser(null);
        window.location.href = "/login";
      }}
      type="button"
    >
      <RoleBadge role={user.role} /> <LogOut className="h-4 w-4" />
    </button>
  );
}
