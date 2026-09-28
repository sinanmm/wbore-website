"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("info@wbore.com");
  const [password, setPassword] = useState("WBRE@Admin2026!");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid institutional credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wbre-deepNavy flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-wbre-royalNavy/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="rounded-3xl bg-wbre-surfaceDark border-2 border-wbre-primaryGold/30 p-8 sm:p-10 shadow-gold-glow space-y-6">
          {/* Emblem & Title */}
          <div className="text-center space-y-3">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <Image
                src="/WBRE.png"
                alt="WBRE Official Emblem"
                width={96}
                height={96}
                className="w-full h-auto object-contain drop-shadow-lg"
                priority
              />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-wbre-lightGold block">
                AUTHENTICATED ACCESS ONLY
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wider mt-1">
                WBRE Secretariat Portal
              </h1>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-wbre-primaryGold" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
                  placeholder="info@wbore.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-wbre-primaryGold" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-wbre-deepNavy font-bold uppercase text-xs tracking-widest transition-all shadow-gold-subtle flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? "AUTHENTICATING..." : "ENTER ADJUDICATION DESK"}</span>
            </button>
          </form>

          {/* Development Hint Box */}
          <div className="p-3.5 rounded-xl bg-wbre-deepNavy/80 border border-white/5 text-center space-y-1 text-[11px] text-slate-400">
            <p className="text-wbre-lightGold font-semibold">Development Credentials Pre-filled</p>
            <p>info@wbore.com / WBRE@Admin2026!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
