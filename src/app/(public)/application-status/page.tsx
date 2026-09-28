import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  ShieldCheck,
  Calendar,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { formatDate, getApplicationStatusDetails } from "@/lib/utils";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Track Application Status | WBRE",
  description:
    "Check the real-time adjudication, guideline issuance, and verification progress of your official record proposal.",
};

interface ApplicationStatusPageProps {
  searchParams: Promise<{
    id?: string;
    email?: string;
  }>;
}

export default async function ApplicationStatusPage({
  searchParams,
}: ApplicationStatusPageProps) {
  const params = await searchParams;
  const searchId = params.id?.trim() || "";
  const searchEmail = params.email?.trim() || "";

  let application: any = null;
  let hasSearched = Boolean(searchId && searchEmail);

  if (hasSearched) {
    try {
      application = await prisma.application.findFirst({
        where: {
          applicationNumber: { equals: searchId },
          email: { equals: searchEmail },
        },
        include: {
          statusHistory: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    } catch (e) {
      console.error("Error checking application status:", e);
    }
  }

  const statusInfo = application ? getApplicationStatusDetails(application.status) : null;

  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-4">
              APPLICATION TRACKER
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              TRACK <span className="gold-text-gradient font-serif">APPLICATION</span> STATUS
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Enter your official Application Reference Number and registered contact email to view real-time adjudication progress.
            </p>
          </div>
        </section>

        {/* Lookup Box */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="p-6 sm:p-8 rounded-2xl bg-wbre-surfaceDark border-2 border-wbre-primaryGold/30 shadow-gold-subtle">
            <form method="GET" action="/application-status" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="app-id-input"
                    className="block text-xs uppercase tracking-wider font-semibold text-wbre-lightGold mb-1.5"
                  >
                    Application ID *
                  </label>
                  <input
                    id="app-id-input"
                    type="text"
                    name="id"
                    defaultValue={searchId}
                    placeholder="e.g. WBRE-APP-2026-000001"
                    className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/30 text-white font-mono text-xs focus:ring-1 focus:ring-wbre-primaryGold placeholder-slate-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="app-email-input"
                    className="block text-xs uppercase tracking-wider font-semibold text-wbre-lightGold mb-1.5"
                  >
                    Applicant Email *
                  </label>
                  <input
                    id="app-email-input"
                    type="email"
                    name="email"
                    defaultValue={searchEmail}
                    placeholder="official@institution.org"
                    className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/30 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold placeholder-slate-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-wbre-deepNavy font-bold uppercase text-xs tracking-widest transition-all shadow-gold-subtle flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>LOOKUP STATUS</span>
              </button>
            </form>
          </div>
        </section>

        {/* Results */}
        {hasSearched && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-in fade-in duration-300">
            {application ? (
              <div className="p-8 sm:p-10 rounded-2xl bg-wbre-surfaceDark/90 border border-wbre-primaryGold/30 shadow-premium-card space-y-8">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-wbre-lightGold bg-wbre-royalNavy px-3 py-1 rounded border border-wbre-primaryGold/30">
                      {application.applicationNumber}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wide mt-2">
                      {application.proposedTitle}
                    </h2>
                    <p className="text-xs text-slate-300">
                      Applicant: {application.applicantName} {application.organizationName ? `(${application.organizationName})` : ""}
                    </p>
                  </div>

                  <div className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider ${statusInfo?.color}`}>
                    {statusInfo?.label}
                  </div>
                </div>

                {/* Progress bar steps */}
                <div className="p-6 rounded-xl bg-wbre-deepNavy/80 border border-wbre-primaryGold/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-wbre-lightGold">
                    <span>Adjudication Progress</span>
                    <span>Stage {statusInfo?.step} of 5</span>
                  </div>
                  <div className="w-full h-2 bg-wbre-surfaceDark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold-gradient transition-all duration-500"
                      style={{ width: `${((statusInfo?.step || 1) / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-300">{statusInfo?.desc}</p>
                </div>

                {/* Proposal Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-wbre-deepNavy border border-white/5 space-y-1">
                    <span className="text-slate-400 block uppercase">Category</span>
                    <span className="font-semibold text-white">{application.categoryName}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-wbre-deepNavy border border-white/5 space-y-1">
                    <span className="text-slate-400 block uppercase">Target Location</span>
                    <span className="font-semibold text-white">{application.location}, {application.country}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-wbre-deepNavy border border-white/5 space-y-1">
                    <span className="text-slate-400 block uppercase">Measured Metric</span>
                    <span className="font-semibold text-white">{application.measuredMetric}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-wbre-deepNavy border border-white/5 space-y-1">
                    <span className="text-slate-400 block uppercase">Logged On</span>
                    <span className="font-semibold text-white">{formatDate(application.createdAt)}</span>
                  </div>
                </div>

                {/* Activity & Notes Timeline */}
                {application.statusHistory.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-wbre-primaryGold" />
                      Status Chronology & Notes
                    </h3>

                    <div className="space-y-3 pl-4 border-l-2 border-wbre-primaryGold/30">
                      {application.statusHistory.map((h: any) => (
                        <div key={h.id} className="relative space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-wbre-lightGold">
                              {formatDate(h.createdAt)}
                            </span>
                            <span className="text-xs font-semibold text-white uppercase">
                              {h.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          {h.note && (
                            <p className="text-xs text-slate-300">{h.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl bg-wbre-surfaceDark p-8 text-center space-y-3 border border-red-500/40">
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-white">
                  No Application Record Found
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  We could not locate an application with ID <span className="font-mono text-wbre-lightGold">{searchId}</span> matching email <span className="text-wbre-lightGold">{searchEmail}</span>.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
      </>
  );
}
