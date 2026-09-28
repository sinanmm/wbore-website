import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ShieldCheck, UserCheck, Award, MapPin } from "lucide-react";

export default async function AdminAdjudicatorsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const adjudicators = [
    {
      name: "Dr. Eleanor Sterling",
      role: "Chief Adjudication Officer",
      jurisdiction: "Global Headquarters (London / Dubai)",
      specialty: "High-Altitude Aerospace & Telemetry Benchmarks",
      status: "ACTIVE_FELLOW",
    },
    {
      name: "Prof. Marcus Vance",
      role: "Senior Adjudicator - Physical Sciences",
      jurisdiction: "United Kingdom & Europe Desk",
      specialty: "Acoustics, Chronometry & Atmospheric Measurements",
      status: "ACTIVE_FELLOW",
    },
    {
      name: "Dr. Sarah Al-Mansouri",
      role: "Regional Director & Adjudicator",
      jurisdiction: "Middle East & Asia-Pacific Secretariat (Dubai)",
      specialty: "Engineering Marvels & Mass Participation Records",
      status: "ACTIVE_FELLOW",
    },
    {
      name: "Jonathan Bradley, Esq.",
      role: "Legal & Regulatory Compliance Marshal",
      jurisdiction: "North America Desk (Massachusetts, USA)",
      specialty: "Jurisdictional Compliance, Permits & Safety Protocols",
      status: "ACTIVE_FELLOW",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Official Adjudication Board & Marshals
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Certified international adjudicators authorized to examine evidence and ratify WBRE record titles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adjudicators.map((adj) => (
          <div
            key={adj.name}
            className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/25 shadow-premium-card space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-wbre-royalNavy flex items-center justify-center text-wbre-lightGold border border-wbre-primaryGold/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white uppercase">
                    {adj.name}
                  </h3>
                  <span className="text-xs font-semibold text-wbre-lightGold">
                    {adj.role}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                {adj.status.replace(/_/g, " ")}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-white/10">
              <p>
                <span className="text-slate-400 font-semibold">Jurisdiction:</span> {adj.jurisdiction}
              </p>
              <p>
                <span className="text-slate-400 font-semibold">Domain Specialty:</span> {adj.specialty}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
