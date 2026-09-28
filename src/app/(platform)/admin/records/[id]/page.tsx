import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RecordFormClient } from "@/components/admin/RecordFormClient";
import { ArrowLeft } from "lucide-react";

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const [record, categories] = await Promise.all([
    prisma.record.findUnique({
      where: { id },
      include: {
        holder: true,
        organization: true,
      },
    }),
    prisma.recordCategory.findMany({
      select: { id: true, name: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  if (!record) notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link
        href="/admin/records"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-wbre-lightGold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Records</span>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-xs font-bold text-wbre-lightGold bg-wbre-royalNavy px-3 py-1 rounded">
            {record.recordId}
          </span>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider mt-2">
            Edit Record: {record.title}
          </h1>
        </div>
      </div>

      <RecordFormClient categories={categories} initialData={record} isEdit />
    </div>
  );
}
