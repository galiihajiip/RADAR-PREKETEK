import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function TooltipContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg bg-radar-navy px-3 py-2 text-xs font-bold text-white shadow-sm", className)} {...props} />;
}
