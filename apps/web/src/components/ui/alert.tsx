import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tones = {
  info: "border-cyan-200 bg-cyan-50 text-radar-blue",
  warning: "border-orange-200 bg-orange-50 text-radar-orange",
  danger: "border-red-200 bg-red-50 text-radar-red",
  success: "border-green-200 bg-green-50 text-radar-green"
};

export function Alert({
  className,
  tone = "info",
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: keyof typeof tones }) {
  return <div className={cn("rounded-2xl border p-4 text-sm", tones[tone], className)} {...props} />;
}
