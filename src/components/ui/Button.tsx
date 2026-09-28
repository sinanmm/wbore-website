import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "navy" | "outline-gold" | "outline-navy" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "gold",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wbre-primaryGold disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-xs gap-2 tracking-wider",
    lg: "px-7 py-3.5 text-sm gap-2.5 font-semibold tracking-widest",
  };

  const variantStyles = {
    gold: "bg-gold-gradient text-wbre-deepNavy font-semibold hover:bg-gold-gradient-hover shadow-gold-subtle hover:shadow-gold-glow hover:-translate-y-0.5 border border-wbre-lightGold/60",
    navy: "bg-wbre-royalNavy text-white hover:bg-wbre-navyHover border border-wbre-borderGold/30 shadow-navy-depth hover:-translate-y-0.5",
    "outline-gold":
      "border border-wbre-primaryGold/60 text-wbre-lightGold hover:bg-wbre-primaryGold/10 hover:border-wbre-primaryGold hover:shadow-gold-subtle hover:-translate-y-0.5",
    "outline-navy":
      "border border-slate-600 text-slate-200 hover:bg-white/5 hover:border-slate-400",
    ghost: "text-slate-300 hover:text-white hover:bg-white/5",
    danger: "bg-red-900/40 text-red-200 border border-red-500/40 hover:bg-red-800/60",
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}

export default Button;
