import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "interactive";
  bordered?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = "default",
  bordered = true,
  className,
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl transition-all duration-300";

  const variantStyles = {
    default: "bg-wbre-surfaceDark/80 shadow-premium-card",
    elevated: "bg-wbre-surfaceDark shadow-gold-glow",
    interactive:
      "bg-wbre-surfaceDark/70 hover:bg-wbre-surfaceDark shadow-premium-card hover:shadow-gold-subtle hover:-translate-y-1 cursor-pointer",
  };

  const borderStyles = bordered
    ? "border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/50"
    : "";

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], borderStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-3 border-b border-white/5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-3 border-t border-white/5", className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
