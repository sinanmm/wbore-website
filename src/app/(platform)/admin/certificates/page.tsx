import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CertificateViewerClient } from "@/components/admin/CertificateViewerClient";
import { FileCheck, ShieldCheck, Award, QrCode, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminCertificatesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const certificates = await prisma.certificate.findMany({
    include: {
      record: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { issueDate: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Official Certificates Archive & Printing
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage authenticated Certificate of Excellence credentials and generate print-ready archival documents.
          </p>
        </div>
        <span className="text-xs text-wbre-lightGold font-mono bg-wbre-surfaceDark px-3 py-1.5 rounded-lg border border-wbre-primaryGold/25">
          {certificates.length} Certificates Active
        </span>
      </div>

      <CertificateViewerClient certificates={certificates} />
    </div>
  );
}
