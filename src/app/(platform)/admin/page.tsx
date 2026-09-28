import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  FileSpreadsheet,
  Award,
  CheckCircle2,
  Clock,
  Globe,
  FileCheck,
  ArrowRight,
  TrendingUp,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch statistics
  const [
    totalApplications,
    pendingApplications,
    approvedRecords,
    activeRecords,
    totalCertificates,
    countries,
    recentApplications,
    recentAuditLogs,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({
      where: {
        status: { in: ["SUBMITTED", "UNDER_INITIAL_REVIEW", "UNDER_VERIFICATION"] },
      },
    }),
    prisma.record.count({ where: { status: "ACTIVE" } }),
    prisma.record.count(),
    prisma.certificate.count(),
    prisma.record.findMany({ select: { country: true }, distinct: ["country"] }),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
  ]);

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileSpreadsheet,
      color: "text-blue-400 bg-blue-950/40 border-blue-500/30",
    },
    {
      title: "Pending Review",
      value: pendingApplications,
      icon: Clock,
      color: "text-amber-400 bg-amber-950/40 border-amber-500/30",
    },
    {
      title: "Active World Records",
      value: approvedRecords,
      icon: Award,
      color: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
    },
    {
      title: "Certified Certificates",
      value: totalCertificates,
      icon: FileCheck,
      color: "text-purple-400 bg-purple-950/40 border-purple-500/30",
    },
    {
      title: "Jurisdictions / Countries",
      value: countries.length || 1,
      icon: Globe,
      color: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
    },
    {
      title: "Total Database Records",
      value: activeRecords,
      icon: ShieldCheck,
      color: "text-yellow-400 bg-yellow-950/40 border-yellow-500/30",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner with Greeting & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-wbre-surfaceDark via-wbre-royalNavy/80 to-wbre-deepNavy border border-wbre-primaryGold/30 shadow-gold-subtle">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
            ADJUDICATION EXECUTIVE CONSOLE
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase tracking-wide mt-1">
            Welcome, {session.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            System status: Operational • All verification endpoints synchronized.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/records/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider hover:bg-gold-gradient-hover shadow-gold-subtle transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Record</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <div
              key={st.title}
              className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {st.title}
                </span>
                <div className="text-3xl font-serif font-bold text-white">
                  {st.value}
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center ${st.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower Grid: Recent Applications & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-wbre-primaryGold" />
              Recent Application Queue
            </h2>
            <Link
              href="/admin/applications"
              className="text-xs uppercase tracking-wider text-wbre-lightGold hover:underline"
            >
              View All ({totalApplications})
            </Link>
          </div>

          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-wbre-deepNavy/80 border border-wbre-primaryGold/15 hover:border-wbre-primaryGold/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-wbre-lightGold">
                        {app.applicationNumber}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-wbre-royalNavy text-slate-200 border border-white/10">
                        {app.categoryName}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white font-serif">
                      {app.proposedTitle}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Applicant: {app.applicantName} ({app.country}) • Logged {formatDate(app.createdAt)}
                    </p>
                  </div>

                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wbre-royalNavy hover:bg-wbre-royalNavy/80 text-xs text-wbre-lightGold font-semibold uppercase tracking-wider flex-shrink-0 transition-colors"
                  >
                    <span>Review Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">
                No active applications in queue.
              </p>
            )}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-wbre-primaryGold" />
              Security Audit Stream
            </h2>
            <Link
              href="/admin/audit-logs"
              className="text-xs text-wbre-lightGold hover:underline"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-4">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="text-xs space-y-1 pb-3 border-b border-white/5 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-wbre-lightGold">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(log.createdAt)}</span>
                </div>
                <p className="text-slate-300 text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
