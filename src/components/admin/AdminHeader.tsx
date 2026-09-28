"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, ShieldCheck } from "lucide-react";

export interface AdminHeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="h-16 bg-wbre-surfaceDark border-b border-wbre-primaryGold/20 px-6 flex items-center justify-between z-30">
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
          Adjudication System
        </span>
        <span className="text-xs text-wbre-primaryGold font-bold">•</span>
        <span className="text-xs text-slate-300 font-medium">Official Registry Active</span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3 pr-4 border-r border-white/10">
            <div className="w-8 h-8 rounded-full bg-wbre-royalNavy border border-wbre-primaryGold/30 flex items-center justify-center text-wbre-lightGold text-xs font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-white leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-wbre-lightGold uppercase tracking-wider font-semibold">
                {user.role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-200 text-xs uppercase tracking-wider font-semibold transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </header>
  );
}
