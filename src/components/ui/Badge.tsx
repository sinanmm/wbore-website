import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  variant?: "gold" | "active" | "broken" | "revoked" | "under_review" | "demo" | "category" | "outline";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = "gold",
  size = "md",
  className,
  children,
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] tracking-wider",
    md: "px-2.5 py-1 text-xs tracking-widest",
  };

  const variantStyles = {
    gold: "bg-wbre-primaryGold/10 text-wbre-lightGold border border-wbre-primaryGold/30",
    active: "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40",
    broken: "bg-amber-950/60 text-amber-300 border border-amber-500/40",
    revoked: "bg-red-950/60 text-red-300 border border-red-500/40",
    under_review: "bg-sky-950/60 text-sky-300 border border-sky-500/40",
    demo: "bg-amber-400/15 text-amber-300 border border-amber-400/50 font-bold",
    category: "bg-wbre-royalNavy/70 text-slate-200 border border-wbre-borderGold/20",
    outline: "border border-slate-600 text-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full uppercase tracking-wider",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
