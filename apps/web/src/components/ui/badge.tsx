import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tones = {
  slate: "bg-slate-100 text-radar-navy",
  cyan: "bg-cyan-50 text-radar-cyan",
  green: "bg-green-50 text-radar-green",
  orange: "bg-orange-50 text-radar-orange",
  red: "bg-red-50 text-radar-red",
  navy: "bg-radar-navy text-white"
};

export function Badge({
  className,
  tone = "slate",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black", tones[tone], className)}
      {...props}
    />
  );
}
