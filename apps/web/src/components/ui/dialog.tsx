import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function DialogOverlay({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fixed inset-0 z-40 bg-radar-navy/40 backdrop-blur-sm", className)} {...props} />;
}

export function DialogContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-radar-border bg-white p-5 shadow-sm", className)} {...props} />;
}
