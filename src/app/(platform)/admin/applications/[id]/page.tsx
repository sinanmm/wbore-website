import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApplicationReviewClient } from "@/components/admin/ApplicationReviewClient";
import { ArrowLeft, User, Calendar, MapPin, ShieldCheck, Clock } from "lucide-react";
import { formatDate, getApplicationStatusDetails } from "@/lib/utils";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!application) notFound();

  const evidenceList = application.evidencePlan
    ? JSON.parse(application.evidencePlan)
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-wbre-lightGold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Queue</span>
      </Link>

      {/* Header Dossier Bar */}
      <div className="p-6 rounded-2xl bg-wbre-surfaceDark border border-wbre-primaryGold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs font-bold text-wbre-lightGold bg-wbre-royalNavy px-3 py-1 rounded border border-wbre-primaryGold/30">
            {application.applicationNumber}
          </span>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wide mt-2">
            {application.proposedTitle}
          </h1>
          <p className="text-xs text-slate-300">
            Category: {application.categoryName} • Logged on {formatDate(application.createdAt)}
          </p>
        </div>

        <div className="text-right space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Current Status
          </span>
          <span className="inline-block font-bold text-xs text-wbre-lightGold uppercase px-3 py-1 rounded bg-wbre-deepNavy border border-wbre-primaryGold/40">
            {application.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Proposal Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Applicant Info */}
          <div className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
              <User className="w-4 h-4 text-wbre-primaryGold" />
              Applicant & Entity Dossier
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Name:</span>
                <span className="font-semibold text-white">{application.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Type:</span>
                <span className="font-semibold text-white">{application.applicantType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email:</span>
                <span className="text-slate-200">{application.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Phone:</span>
                <span className="text-slate-200">{application.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Jurisdiction:</span>
                <span className="text-slate-200">{application.city}, {application.country}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Organization:</span>
                <span className="text-slate-200">{application.organizationName || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Proposal Details */}
          <div className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
              Technical Description & Metric Specification
            </h2>
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="text-slate-400 block uppercase font-semibold">Description:</span>
                <p className="text-slate-200 mt-1">{application.description}</p>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-semibold">Measured Metric:</span>
                <p className="text-wbre-lightGold font-semibold mt-0.5">{application.measuredMetric}</p>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-semibold">Known Benchmark:</span>
                <p className="text-slate-300 mt-0.5">{application.knownBenchmark || "None provided"}</p>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-semibold">Significance:</span>
                <p className="text-slate-300 mt-0.5">{application.significance}</p>
              </div>
            </div>
          </div>

          {/* Evidence Plan */}
          <div className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
              Declared Evidence Methodology
            </h2>
            <ul className="space-y-2 text-xs">
              {evidenceList.map((ev: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-slate-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0" />
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Adjudication Decision Panel */}
        <div className="lg:col-span-5 space-y-6">
          <ApplicationReviewClient
            applicationId={application.id}
            currentStatus={application.status}
            initialNotes={application.internalNotes || ""}
            initialGuidelines={application.guidelinesDocument || ""}
          />

          {/* Chronological History */}
          <div className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 space-y-4 text-xs">
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
              <Clock className="w-4 h-4 text-wbre-primaryGold" />
              Adjudication Audit History
            </h3>

            <div className="space-y-3 pl-3 border-l border-wbre-primaryGold/30">
              {application.statusHistory.map((h) => (
                <div key={h.id} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-wbre-lightGold uppercase">
                      {h.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-slate-400">{formatDate(h.createdAt)}</span>
                  </div>
                  {h.note && <p className="text-slate-300">{h.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
