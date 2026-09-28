"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Award,
  Layers,
  FileCheck,
  Users,
  Building,
  ShieldAlert,
  FolderLock,
  Mail,
  MapPin,
  Settings,
  UserCheck,
  History,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Applications", href: "/admin/applications", icon: FileSpreadsheet },
  { name: "Records", href: "/admin/records", icon: Award },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Certificates", href: "/admin/certificates", icon: FileCheck },
  { name: "People", href: "/admin/people", icon: Users },
  { name: "Organizations", href: "/admin/organizations", icon: Building },
  { name: "Adjudicators", href: "/admin/adjudicators", icon: ShieldAlert },
  { name: "Evidence Vault", href: "/admin/evidence", icon: FolderLock },
  { name: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { name: "Global Offices", href: "/admin/offices", icon: MapPin },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Admin Users", href: "/admin/users", icon: UserCheck },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: History },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-wbre-surfaceDarker border-r border-wbre-primaryGold/20 flex flex-col flex-shrink-0 min-h-screen">
      {/* Top Brand */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image
              src="/WBRE.png"
              alt="WBRE"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
        <div className="flex flex-col">
          <span className="font-serif text-sm font-bold tracking-wider text-white uppercase leading-tight">
            WBRE SECRETARIAT
          </span>
          <span className="text-[9px] uppercase tracking-widest text-wbre-lightGold font-medium">
            ADMINISTRATION
          </span>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors",
                isActive
                  ? "bg-wbre-primaryGold/20 text-wbre-lightGold font-semibold border-l-2 border-wbre-primaryGold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Live Site Link */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-wbre-royalNavy/60 text-xs font-semibold text-wbre-lightGold hover:text-white transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
