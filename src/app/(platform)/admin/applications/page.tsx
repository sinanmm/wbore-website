import React from "react";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  FileSpreadsheet,
  Search,
  Filter,
  ArrowRight,
  User,
  Clock,
} from "lucide-react";
import { formatDate, getApplicationStatusDetails } from "@/lib/utils";

interface ApplicationsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
  }>;
}

export default async function AdminApplicationsPage({
  searchParams,
}: ApplicationsPageProps) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const query = params.q || "";
  const selectedStatus = params.status || "";
  const selectedCategory = params.category || "";

  const where: any = {};
  if (query) {
    where.OR = [
      { applicationNumber: { contains: query } },
      { applicantName: { contains: query } },
      { proposedTitle: { contains: query } },
      { email: { contains: query } },
      { country: { contains: query } },
    ];
  }
  if (selectedStatus) where.status = selectedStatus;
  if (selectedCategory) where.categoryName = selectedCategory;

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Application Adjudication Queue
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Review, adjudicate, issue guidelines, or ratify pending record proposals.
          </p>
        </div>
        <span className="text-xs text-wbre-lightGold font-mono bg-wbre-surfaceDark px-3 py-1.5 rounded-lg border border-wbre-primaryGold/25">
          {applications.length} Applications Total
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20">
        <form method="GET" action="/admin/applications" className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-wbre-primaryGold" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search reference, applicant, title, email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>

          <select
            name="status"
            defaultValue={selectedStatus}
            className="px-3 py-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-xs text-slate-200"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="UNDER_INITIAL_REVIEW">UNDER INITIAL REVIEW</option>
            <option value="GUIDELINES_ISSUED">GUIDELINES ISSUED</option>
            <option value="ATTEMPT_SCHEDULED">ATTEMPT SCHEDULED</option>
            <option value="EVIDENCE_SUBMITTED">EVIDENCE SUBMITTED</option>
            <option value="UNDER_VERIFICATION">UNDER VERIFICATION</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="MORE_INFORMATION_REQUIRED">MORE INFO REQUIRED</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider hover:bg-gold-gradient-hover"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table / Cards List */}
      <div className="rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 overflow-hidden shadow-premium-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-wbre-surfaceDarker text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Ref Number</th>
                <th className="py-3.5 px-4">Applicant / Entity</th>
                <th className="py-3.5 px-4">Proposed Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.length > 0 ? (
                applications.map((app) => {
                  const statusInfo = getApplicationStatusDetails(app.status);
                  return (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-wbre-lightGold">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-400">{app.country}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-200 font-medium">
                        {app.proposedTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {app.categoryName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-wbre-lightGold hover:text-white"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No applications matched the filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
