import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OfficesEditorClient } from "@/components/admin/OfficesEditorClient";
import { MapPin } from "lucide-react";

export default async function AdminOfficesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const offices = await prisma.office.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Global Jurisdictional Offices Editor
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Centralized postal addresses, building suites, and contact information for international headquarters in Dubai, UK, and USA.
          </p>
        </div>
      </div>

      <OfficesEditorClient offices={offices} />
    </div>
  );
}
