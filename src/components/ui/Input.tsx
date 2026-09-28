import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-wbre-primaryGold">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full py-3 rounded-xl bg-wbre-deepNavy/80 border text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors",
              icon ? "pl-10 pr-4" : "px-4",
              error
                ? "border-red-500/50 focus:ring-red-400"
                : "border-wbre-primaryGold/25 focus:ring-wbre-primaryGold",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="text-[11px] text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
