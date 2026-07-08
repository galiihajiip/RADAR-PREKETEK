import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-radar-navy text-white hover:bg-radar-blue",
  secondary: "border border-radar-border bg-white text-radar-navy hover:bg-slate-50",
  warning: "bg-radar-orange text-white hover:brightness-95",
  danger: "bg-radar-red text-white hover:brightness-95",
  success: "bg-radar-green text-white hover:brightness-95",
  ghost: "text-radar-navy hover:bg-slate-100"
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-radar-cyan focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
