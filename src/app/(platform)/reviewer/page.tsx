import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, FileCheck, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ReviewerPortalPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-wbre-deepNavy text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/80 border border-wbre-primaryGold/30 text-[11px] font-semibold uppercase tracking-wider text-wbre-lightGold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Technical Evidence Review Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase">
              Reviewer Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Welcome back, {session.name} ({session.role}). Assigned to evidence adjudication and criteria verification.
            </p>
          </div>
          <Button href="/admin/applications" variant="gold" size="sm">
            Review Active Applications
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">Queue Assigned</span>
              <Clock className="w-5 h-5 text-wbre-primaryGold" />
            </div>
            <p className="text-2xl font-serif font-bold text-white">Active Queue</p>
            <p className="text-xs text-slate-300">Assess incoming video telemetry and logbooks</p>
          </div>

          <div className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">Guidelines</span>
              <FileCheck className="w-5 h-5 text-wbre-lightGold" />
            </div>
            <p className="text-2xl font-serif font-bold text-white">Standard Protocols</p>
            <p className="text-xs text-slate-300">Review criteria definitions & calibration standards</p>
          </div>

          <div className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs uppercase tracking-wider">Certifications</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-white">Verification Board</p>
            <p className="text-xs text-slate-300">Submit findings to chief adjudicator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
