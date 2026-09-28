import React from "react";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { RecordFormClient } from "@/components/admin/RecordFormClient";
import { ArrowLeft } from "lucide-react";

export default async function NewRecordPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const categories = await prisma.recordCategory.findMany({
    select: { id: true, name: true },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link
        href="/admin/records"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-wbre-lightGold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Records</span>
      </Link>

      <div>
        <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
          Publish Official Record & Issue Certificate
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Add an adjudicated world record to the permanent registry. A unique Record ID and Certificate Number will be generated automatically.
        </p>
      </div>

      <RecordFormClient categories={categories} />
    </div>
  );
}
