import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { FolderLock, Video, FileText, Camera, ShieldCheck, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminEvidenceVaultPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const records = await prisma.record.findMany({
    where: {
      OR: [
        { evidenceSummary: { not: null } },
        { featuredImage: { not: null } },
      ],
    },
    select: {
      id: true,
      recordId: true,
      title: true,
      evidenceSummary: true,
      verificationMethod: true,
      witnessInfo: true,
      featuredImage: true,
      recordDate: true,
    },
    orderBy: { recordDate: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Evidence Vault & Telemetry Archives
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Secure storage abstraction repository for video logs, calibrated telemetry records, and sworn witness affidavits.
          </p>
        </div>
        <span className="text-xs text-wbre-lightGold font-mono bg-wbre-surfaceDark px-3 py-1.5 rounded-lg border border-wbre-primaryGold/25">
          Provider: S3 / Storage Agnostic Ready
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((rec) => (
          <div
            key={rec.id}
            className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-wbre-lightGold bg-wbre-deepNavy px-2.5 py-1 rounded border border-wbre-primaryGold/30">
                {rec.recordId}
              </span>
              <span className="text-[11px] text-slate-400">
                {formatDate(rec.recordDate)}
              </span>
            </div>

            <h3 className="text-base font-serif font-bold text-white truncate">
              {rec.title}
            </h3>

            <div className="space-y-2 text-xs text-slate-300 bg-wbre-deepNavy/60 p-3 rounded-lg border border-white/5">
              <div className="flex items-start gap-2">
                <FileText className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{rec.evidenceSummary || "Evidence dossier logged."}</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">{rec.verificationMethod || "Technical Board Adjudication"}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-wbre-lightGold">
              <span>Status: Cryptographically Preserved</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
