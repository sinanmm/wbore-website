import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertOctagon,
  Calendar,
  MapPin,
  Award,
  ArrowRight,
  QrCode,
  Lock,
} from "lucide-react";
import { formatDate, getStatusDetails } from "@/lib/utils";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Official Record & Certificate Verification | WBRE",
  description:
    "Verify the authenticity, validity, and official adjudication status of any World Book of Record Excellence certificate or record title.",
};

interface VerifyPageProps {
  searchParams: Promise<{
    code?: string;
  }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const searchCode = params.code?.trim() || "";

  let recordResult: any = null;
  let certificateResult: any = null;
  let hasSearched = Boolean(searchCode);

  if (searchCode) {
    try {
      // Check Certificate first
      certificateResult = await prisma.certificate.findFirst({
        where: {
          OR: [
            { certificateNumber: { equals: searchCode } },
            { verificationCode: { equals: searchCode } },
          ],
        },
        include: {
          record: {
            include: {
              category: true,
              holder: true,
              organization: true,
            },
          },
        },
      });

      if (!certificateResult) {
        // Check Record ID
        recordResult = await prisma.record.findFirst({
          where: {
            OR: [
              { recordId: { equals: searchCode } },
              { certificateNumber: { equals: searchCode } },
            ],
          },
          include: {
            category: true,
            holder: true,
            organization: true,
            certificates: true,
          },
        });
      }
    } catch (e) {
      console.error("Verification query error:", e);
    }
  }

  const verifiedRecord = certificateResult?.record || recordResult;
  const verifiedCertificate = certificateResult || verifiedRecord?.certificates?.[0];

  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-6">
              PUBLIC AUTHENTICITY LEDGER
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              VERIFY A <span className="gold-text-gradient font-serif">WBRE RECORD</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Confirm the authenticity and current status of a World Book of Record Excellence certificate or record.
            </p>
          </div>
        </section>

        {/* Verification Input Portal */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="p-8 sm:p-10 rounded-2xl bg-wbre-surfaceDark border-2 border-wbre-primaryGold/40 shadow-gold-glow">
            <form method="GET" action="/verify" className="space-y-4">
              <label
                htmlFor="verify-input"
                className="block text-xs uppercase tracking-[0.2em] font-bold text-wbre-lightGold"
              >
                ENTER RECORD ID OR CERTIFICATE NUMBER
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wbre-primaryGold" />
                  <input
                    id="verify-input"
                    type="text"
                    name="code"
                    defaultValue={searchCode}
                    placeholder="e.g. WBRE-WR-2026-000101 or WBRE-CERT-2026-000101"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-wbre-deepNavy border border-wbre-primaryGold/40 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wbre-primaryGold text-sm font-mono tracking-wide"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-wbre-deepNavy font-bold uppercase text-xs tracking-widest transition-all shadow-gold-subtle flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFY</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                You can enter either an official Record ID (`WBRE-WR-...`) or a Certificate Serial Number (`WBRE-CERT-...`).
              </p>
            </form>
          </div>
        </section>

        {/* Verification Result Display */}
        {hasSearched && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {verifiedRecord ? (
              <div className="rounded-2xl bg-gradient-to-b from-wbre-surfaceDark via-wbre-royalNavy/80 to-wbre-deepNavy border-2 border-emerald-500/50 p-8 sm:p-10 shadow-gold-glow relative overflow-hidden">
                {/* Top Verified Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-[0.25em] font-bold text-emerald-400 block">
                        AUTHENTICATED RECORD
                      </span>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wider">
                        VERIFIED
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="active" size="md">
                      {verifiedRecord.status}
                    </Badge>
                    {verifiedRecord.isDemo && (
                      <Badge variant="demo" size="md">
                        DEMO RECORD
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Details Table / Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-white/10 text-sm">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Record Title
                      </span>
                      <p className="font-serif text-lg font-bold text-white">
                        {verifiedRecord.title}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Record Holder / Laureate
                      </span>
                      <p className="font-medium text-wbre-lightGold">
                        {verifiedRecord.holder?.name ||
                          verifiedRecord.organization?.name ||
                          "WBRE Official Laureate"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Ratified Achievement
                      </span>
                      <p className="font-semibold text-white">
                        {verifiedRecord.resultValue} ({verifiedRecord.measurementUnit})
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Official Record ID
                      </span>
                      <p className="font-mono text-sm font-bold text-wbre-lightGold">
                        {verifiedRecord.recordId}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Certificate Number
                      </span>
                      <p className="font-mono text-sm font-bold text-white">
                        {verifiedCertificate?.certificateNumber ||
                          verifiedRecord.certificateNumber ||
                          "Official WBRE Cert"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">
                        Date & Jurisdiction
                      </span>
                      <p className="text-slate-300">
                        {formatDate(verifiedRecord.recordDate)} • {verifiedRecord.location},{" "}
                        {verifiedRecord.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-4 h-4 text-wbre-primaryGold" />
                    <span>Cryptographically verified against official WBRE ledger</span>
                  </div>

                  <Button
                    href={`/records/${verifiedRecord.slug}`}
                    variant="gold"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    <span>View Official Record Dossier</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Invalid / Not Found State */
              <div className="rounded-2xl bg-wbre-surfaceDark/90 border-2 border-red-500/40 p-8 sm:p-10 text-center space-y-4 shadow-premium-card">
                <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto">
                  <AlertOctagon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
                  NO VERIFIED RECORD FOUND
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  The identifier <span className="font-mono text-wbre-lightGold font-semibold">"{searchCode}"</span> does not match any authenticated record or certificate in the official WBRE registry.
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Please verify the characters on the physical certificate or record documents and try again.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
      </>
  );
}
