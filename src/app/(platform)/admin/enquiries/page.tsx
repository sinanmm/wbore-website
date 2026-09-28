import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Mail, Clock, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminEnquiriesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const enquiries = await prisma.contactEnquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
            Public Enquiries & Communications Inbox
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            General messages, adjudications inquiries, and partnership requests submitted via public contact portals.
          </p>
        </div>
        <span className="text-xs text-wbre-lightGold font-mono bg-wbre-surfaceDark px-3 py-1.5 rounded-lg border border-wbre-primaryGold/25">
          {enquiries.length} Enquiries Total
        </span>
      </div>

      <div className="space-y-4">
        {enquiries.length > 0 ? (
          enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="p-6 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-wbre-lightGold">
                    {enquiry.enquiryType}
                  </span>
                  <h3 className="text-base font-serif font-bold text-white mt-0.5">
                    {enquiry.name} {enquiry.organization ? `(${enquiry.organization})` : ""}
                  </h3>
                  <div className="text-xs text-slate-400">
                    <a href={`mailto:${enquiry.email}`} className="text-slate-300 hover:underline mr-3">
                      {enquiry.email}
                    </a>
                    {enquiry.phone && <span>• Phone: {enquiry.phone} • </span>}
                    <span>Country: {enquiry.country}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-mono">
                    {formatDate(enquiry.createdAt)}
                  </span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-950 text-blue-300 border border-blue-500/30">
                    {enquiry.status}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-wbre-deepNavy/60 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                {enquiry.message}
              </p>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-wbre-surfaceDark/50 border border-white/10 text-slate-400 text-sm">
            No contact messages received yet.
          </div>
        )}
      </div>
    </div>
  );
}
