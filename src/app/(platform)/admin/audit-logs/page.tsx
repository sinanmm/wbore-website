import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { History, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminAuditLogsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const logs = await prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Institutional Audit Trail
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Complete immutable activity log of all logins, record creations, status transitions, and administrative actions.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 overflow-hidden shadow-premium-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-wbre-surfaceDarker text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Target Entity</th>
              <th className="py-3.5 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                  {formatDate(log.createdAt)}
                </td>
                <td className="py-3.5 px-4 font-bold text-wbre-lightGold font-mono text-[11px]">
                  {log.action}
                </td>
                <td className="py-3.5 px-4 text-white font-medium">
                  {log.user?.name || "System"}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {log.entity}
                </td>
                <td className="py-3.5 px-4 text-slate-300">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
