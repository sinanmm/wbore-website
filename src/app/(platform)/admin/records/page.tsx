import React from "react";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  Award,
  Plus,
  Search,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { formatDate, getStatusDetails } from "@/lib/utils";

interface RecordsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

export default async function AdminRecordsPage({ searchParams }: RecordsPageProps) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const query = params.q || "";
  const selectedStatus = params.status || "";

  const where: any = {};
  if (query) {
    where.OR = [
      { recordId: { contains: query } },
      { title: { contains: query } },
      { country: { contains: query } },
      { holder: { name: { contains: query } } },
    ];
  }
  if (selectedStatus) where.status = selectedStatus;

  const records = await prisma.record.findMany({
    where,
    include: {
      category: true,
      holder: true,
      organization: true,
    },
    orderBy: { recordDate: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Record Registry Management
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Create, publish, review, archive, or revoke official WBRE record titles.
          </p>
        </div>

        <Link
          href="/admin/records/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider hover:bg-gold-gradient-hover shadow-gold-subtle"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Record</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20">
        <form method="GET" action="/admin/records" className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-wbre-primaryGold" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search Record ID, Title, Holder, Country..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>

          <select
            name="status"
            defaultValue={selectedStatus}
            className="px-3 py-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-xs text-slate-200"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="BROKEN">BROKEN</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="ARCHIVED">ARCHIVED</option>
            <option value="REVOKED">REVOKED</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider hover:bg-gold-gradient-hover"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 overflow-hidden shadow-premium-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-wbre-surfaceDarker text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Record ID</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Holder / Entity</th>
                <th className="py-3.5 px-4">Verified Result</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {records.length > 0 ? (
                records.map((r) => {
                  const statusDetails = getStatusDetails(r.status);
                  const holderName = r.holder?.name || r.organization?.name || "Official Archive";
                  return (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-wbre-lightGold">
                        {r.recordId}
                        {r.isDemo && (
                          <span className="block text-[9px] text-amber-400 font-sans font-bold">
                            DEMO RECORD
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                        {r.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {holderName}
                        <span className="block text-[11px] text-slate-400">{r.country}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-wbre-lightGold">
                        {r.resultValue}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {r.category?.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusDetails.bg}`}
                        >
                          {statusDetails.shortLabel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          href={`/records/${r.slug}`}
                          target="_blank"
                          className="inline-flex p-1.5 rounded bg-wbre-royalNavy hover:bg-wbre-royalNavy/80 text-wbre-lightGold"
                          title="View Public Profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/records/${r.id}`}
                          className="inline-flex px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px]"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No records found. Click 'Publish New Record' to add a certified record.
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
