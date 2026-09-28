import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Building, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminOrganizationsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const orgs = await prisma.organization.findMany({
    include: {
      _count: {
        select: { records: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Verified Organizations & Institutions
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Institutional entities, universities, corporate bodies, and non-governmental record claimants.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 overflow-hidden shadow-premium-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-wbre-surfaceDarker text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Organization</th>
              <th className="py-3.5 px-4">Country</th>
              <th className="py-3.5 px-4">Website</th>
              <th className="py-3.5 px-4">Records</th>
              <th className="py-3.5 px-4">Registered Date</th>
              <th className="py-3.5 px-4 text-right">Public Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white font-serif text-sm">
                  {org.name}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {org.country}
                </td>
                <td className="py-3.5 px-4 text-wbre-lightGold">
                  {org.website ? (
                    <a href={org.website} target="_blank" className="hover:underline">
                      {org.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded bg-wbre-royalNavy text-wbre-lightGold font-semibold">
                    {org._count.records} Records
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">
                  {formatDate(org.createdAt)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/organizations/${org.slug}`}
                    target="_blank"
                    className="inline-flex p-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
