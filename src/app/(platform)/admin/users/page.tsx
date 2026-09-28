import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { UserCheck, ShieldCheck, UserPlus } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Secretariat Users & Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage authenticated administrative staff, reviewers, adjudicators, and role-based permissions.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 overflow-hidden shadow-premium-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-wbre-surfaceDarker text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Institutional Email</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Account Status</th>
              <th className="py-3.5 px-4">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white">
                  {u.name}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {u.email}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded bg-wbre-royalNavy text-wbre-lightGold font-semibold uppercase tracking-wider text-[10px]">
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {u.isActive ? "ACTIVE" : "DISABLED"}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">
                  {formatDate(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
