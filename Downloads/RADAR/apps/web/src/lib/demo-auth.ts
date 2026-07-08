"use client";

import type { Role } from "@radar/shared";

export interface DemoUser {
  role: Role;
  email: string;
  name: string;
  organization: string;
}

export const DEMO_USERS: Record<Role, DemoUser> = {
  citizen: {
    role: "citizen",
    email: "citizen@radar.demo",
    name: "Demo Citizen",
    organization: "Warga Cianjur"
  },
  operator: {
    role: "operator",
    email: "operator@radar.demo",
    name: "Demo Operator",
    organization: "RADAR Command Center"
  },
  admin: {
    role: "admin",
    email: "admin@radar.demo",
    name: "Demo Admin",
    organization: "RADAR System Admin"
  }
};

const STORAGE_KEY = "radar-demo-user";

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DemoUser;
    return parsed.role in DEMO_USERS ? parsed : null;
  } catch {
    return null;
  }
}

export function setDemoUser(role: Role) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS[role]));
}

export function clearDemoUser() {
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function defaultPathForRole(role: Role) {
  if (role === "citizen") return "/report";
  if (role === "operator") return "/dashboard";
  return "/admin";
}
