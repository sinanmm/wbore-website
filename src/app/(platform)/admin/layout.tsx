import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If user is not authenticated and is inside admin, we check in page level or layout
  // Note: if user is browsing /admin/login, layout shouldn't wrap with sidebar
  return (
    <div className="min-h-screen bg-wbre-deepNavy text-slate-100 flex">
      {session ? (
        <>
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AdminHeader user={session} />
            <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-wbre-deepNavy">
              {children}
            </main>
          </div>
        </>
      ) : (
        <div className="flex-1">{children}</div>
      )}
    </div>
  );
}
