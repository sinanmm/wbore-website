import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function generateApplicationNumber(
  sequence: number = Math.floor(Math.random() * 900000) + 100000,
  year: number = 2026
): string {
  const padded = sequence.toString().padStart(6, "0");
  return `WBRE-APP-${year}-${padded}`;
}

export function generateRecordNumber(
  sequence: number = Math.floor(Math.random() * 900000) + 100000,
  year: number = 2026
): string {
  const padded = sequence.toString().padStart(6, "0");
  return `WBRE-WR-${year}-${padded}`;
}

export function generateCertificateNumber(
  sequence: number = Math.floor(Math.random() * 900000) + 100000,
  year: number = 2026
): string {
  const padded = sequence.toString().padStart(6, "0");
  return `WBRE-CERT-${year}-${padded}`;
}

export function generateVerificationCode(length: number = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatShortDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function getStatusDetails(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return {
        label: "VERIFIED ACTIVE RECORD",
        shortLabel: "ACTIVE",
        bg: "bg-emerald-950/40 text-emerald-300 border-emerald-500/40",
        badge: "bg-emerald-500",
        icon: "CheckCircle",
      };
    case "BROKEN":
      return {
        label: "HISTORICAL (SUPERSEDED)",
        shortLabel: "BROKEN",
        bg: "bg-amber-950/40 text-amber-300 border-amber-500/40",
        badge: "bg-amber-500",
        icon: "Clock",
      };
    case "REVOKED":
      return {
        label: "RECORD REVOKED",
        shortLabel: "REVOKED",
        bg: "bg-red-950/40 text-red-300 border-red-500/40",
        badge: "bg-red-500",
        icon: "AlertOctagon",
      };
    case "UNDER_REVIEW":
      return {
        label: "UNDER RE-EXAMINATION",
        shortLabel: "UNDER REVIEW",
        bg: "bg-sky-950/40 text-sky-300 border-sky-500/40",
        badge: "bg-sky-500",
        icon: "FileSearch",
      };
    case "ARCHIVED":
    default:
      return {
        label: "HISTORICAL ARCHIVE",
        shortLabel: "ARCHIVED",
        bg: "bg-slate-900/60 text-slate-300 border-slate-700",
        badge: "bg-slate-500",
        icon: "Archive",
      };
  }
}

export function getApplicationStatusDetails(status: string) {
  const map: Record<string, { label: string; step: number; color: string; desc: string }> = {
    SUBMITTED: {
      label: "Application Submitted",
      step: 1,
      color: "text-blue-400 border-blue-500/30 bg-blue-950/30",
      desc: "Your proposal has been logged into the international queue.",
    },
    UNDER_INITIAL_REVIEW: {
      label: "Under Initial Review",
      step: 2,
      color: "text-amber-400 border-amber-500/30 bg-amber-950/30",
      desc: "Our adjudication team is assessing eligibility and benchmark criteria.",
    },
    GUIDELINES_ISSUED: {
      label: "Guidelines Issued",
      step: 3,
      color: "text-purple-400 border-purple-500/30 bg-purple-950/30",
      desc: "Specific measurement rules, witness criteria and evidence logs have been sent.",
    },
    ATTEMPT_SCHEDULED: {
      label: "Attempt Scheduled",
      step: 3,
      color: "text-indigo-400 border-indigo-500/30 bg-indigo-950/30",
      desc: "Official attempt date has been registered with the adjudications desk.",
    },
    EVIDENCE_SUBMITTED: {
      label: "Evidence Submitted",
      step: 4,
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/30",
      desc: "Video recordings, logbooks, witness affidavits are in technical adjudication.",
    },
    UNDER_VERIFICATION: {
      label: "Under Verification",
      step: 4,
      color: "text-yellow-400 border-yellow-500/30 bg-yellow-950/30",
      desc: "Final technical validation by the senior verification board.",
    },
    APPROVED: {
      label: "Approved & Certified",
      step: 5,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/30",
      desc: "The record is confirmed, certified and archived in the official WBRE registry.",
    },
    REJECTED: {
      label: "Proposal Declined",
      step: 5,
      color: "text-red-400 border-red-500/30 bg-red-950/30",
      desc: "The proposal does not meet standard quantifiable WBRE criteria.",
    },
    MORE_INFORMATION_REQUIRED: {
      label: "Information Required",
      step: 2,
      color: "text-orange-400 border-orange-500/30 bg-orange-950/30",
      desc: "Adjudicators have requested additional supporting documentation.",
    },
  };

  return map[status] || map.SUBMITTED;
}
