import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Layers, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const categories = await prisma.recordCategory.findMany({
    include: {
      _count: {
        select: { records: true },
      },
    },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Record Categories Management
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage official taxonomy categories, display order, descriptions, and icon mappings.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 overflow-hidden shadow-premium-card">
        <table className="w-full text-left text-xs">
          <thead className="bg-wbre-surfaceDarker text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4">Records Count</th>
              <th className="py-3.5 px-4 text-right">Public Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-wbre-lightGold">
                  #{cat.displayOrder}
                </td>
                <td className="py-3.5 px-4 font-bold text-white">
                  {cat.name}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400">
                  {cat.slug}
                </td>
                <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate">
                  {cat.description}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-1 rounded bg-wbre-royalNavy text-wbre-lightGold font-semibold">
                    {cat._count.records} Records
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/categories/${cat.slug}`}
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
