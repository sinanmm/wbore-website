import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ApplicationDetailTabsClient } from "@/components/admin/ApplicationDetailTabsClient";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

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
      evidences: {
        orderBy: { createdAt: "desc" },
      },
      evidenceTypes: true,
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

      {/* Tabs Layout: Dossier vs Evidence */}
      <ApplicationDetailTabsClient
        application={application}
        evidenceList={evidenceList}
      />
    </div>
  );
}
