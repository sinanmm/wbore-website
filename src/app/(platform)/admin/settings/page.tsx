import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Settings, Save, ShieldCheck } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const settings = await prisma.websiteSetting.findMany();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Institutional Website Settings
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Global system parameters, verification policies, and public brand lines.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-wbre-surfaceDark border border-wbre-primaryGold/30 space-y-6 shadow-premium-card">
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
              Organization Full Name
            </label>
            <input
              type="text"
              readOnly
              value="WORLD BOOK OF RECORD EXCELLENCE"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white font-serif text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
              Official Abbreviation
            </label>
            <input
              type="text"
              readOnly
              value="WBRE"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
              Primary Brand Line
            </label>
            <input
              type="text"
              readOnly
              value="RECOGNIZING DISTINCTION"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-wbre-lightGold font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
              Secondary Marketing Line
            </label>
            <input
              type="text"
              readOnly
              value="WHERE EXCELLENCE BECOMES HISTORY."
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white font-serif"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
              Public Submissions Status
            </label>
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-semibold">
              ● Online Adjudication Portal Active & Accepting Proposals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
