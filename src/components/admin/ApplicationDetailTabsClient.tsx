"use client";

import React, { useState } from "react";
import { ApplicationReviewClient } from "@/components/admin/ApplicationReviewClient";
import { ApplicationEvidenceTab, EvidenceItem, EvidenceTypeItem } from "./ApplicationEvidenceTab";
import {
  User,
  FileText,
  Calendar,
  MapPin,
  ShieldCheck,
  Clock,
  FolderOpen,
  FileCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ApplicationDetailTabsClientProps {
  application: any;
  evidenceList: string[];
}

export function ApplicationDetailTabsClient({
  application,
  evidenceList,
}: ApplicationDetailTabsClientProps) {
  const [activeTab, setActiveTab] = useState<"dossier" | "evidence">("dossier");

  const evidenceCount = application.evidences?.length || 0;

  return (
    <div className="space-y-6">
      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-wbre-primaryGold/20 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("dossier")}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "dossier"
              ? "bg-gold-gradient text-wbre-deepNavy shadow-gold-subtle"
              : "bg-wbre-surfaceDark/60 hover:bg-wbre-surfaceDark text-slate-300 hover:text-white border border-white/10"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Application Dossier</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("evidence")}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 ${
            activeTab === "evidence"
              ? "bg-gold-gradient text-wbre-deepNavy shadow-gold-subtle"
              : "bg-wbre-surfaceDark/60 hover:bg-wbre-surfaceDark text-slate-300 hover:text-white border border-white/10"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Evidence Verification</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === "evidence"
                ? "bg-wbre-deepNavy text-wbre-lightGold"
                : "bg-white/10 text-wbre-lightGold border border-wbre-primaryGold/30"
            }`}
          >
            {evidenceCount}
          </span>
        </button>
      </div>

      {/* TAB 1: Dossier Details */}
      {activeTab === "dossier" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
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
                  <span className="text-slate-200">
                    {application.city}, {application.country}
                  </span>
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
                  <span className="text-slate-400 block uppercase font-semibold">
                    Measured Metric:
                  </span>
                  <p className="text-wbre-lightGold font-semibold mt-0.5">
                    {application.measuredMetric}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold">
                    Known Benchmark:
                  </span>
                  <p className="text-slate-300 mt-0.5">
                    {application.knownBenchmark || "None provided"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-semibold">
                    Significance:
                  </span>
                  <p className="text-slate-300 mt-0.5">{application.significance}</p>
                </div>
              </div>
            </div>

            {/* Declared Requirements Quick Summary */}
            <div className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">
                  Declared Evidence Plan
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("evidence")}
                  className="text-xs text-wbre-lightGold hover:underline font-semibold"
                >
                  View Full Evidence Tab →
                </button>
              </div>
              <ul className="space-y-2 text-xs">
                {evidenceList.map((ev: string, i: number) => (
                  <li key={i} className="flex items-center justify-between text-slate-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0" />
                      <span>{ev}</span>
                    </div>
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
                {application.statusHistory.map((h: any) => (
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
      )}

      {/* TAB 2: Evidence Verification */}
      {activeTab === "evidence" && (
        <ApplicationEvidenceTab
          applicationId={application.id}
          applicationNumber={application.applicationNumber}
          initialEvidences={application.evidences || []}
          evidenceTypes={application.evidenceTypes || []}
          declaredEvidencePlan={evidenceList}
        />
      )}
    </div>
  );
}

export default ApplicationDetailTabsClient;
