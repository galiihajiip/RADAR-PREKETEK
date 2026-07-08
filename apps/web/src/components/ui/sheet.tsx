import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Sheet({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("fixed inset-0 z-40 bg-radar-navy/30 backdrop-blur-sm", className)} {...props} />;
}

export function SheetContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ml-auto min-h-full w-full max-w-sm border-l border-radar-border bg-white p-4 shadow-sm", className)} {...props} />;
}
