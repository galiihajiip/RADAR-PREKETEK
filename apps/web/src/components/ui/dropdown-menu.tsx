import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function DropdownMenuContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-radar-border bg-white p-2 shadow-sm", className)} {...props} />;
}

export function DropdownMenuItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg px-3 py-2 text-sm font-bold text-radar-navy hover:bg-slate-50", className)} {...props} />;
}
