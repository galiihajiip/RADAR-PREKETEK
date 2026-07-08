import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-4", className)} {...props} />;
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex rounded-xl border border-radar-border bg-slate-50 p-1", className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("rounded-lg px-3 py-2 text-sm font-bold text-radar-muted hover:bg-white hover:text-radar-navy", className)} {...props} />;
}
