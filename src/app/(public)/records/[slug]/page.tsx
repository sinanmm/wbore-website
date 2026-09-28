import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Award,
  Clock,
  User,
  Building,
  FileCheck,
  CheckCircle2,
  QrCode,
  Share2,
  ArrowLeft,
  Video,
  ExternalLink,
} from "lucide-react";
import { formatDate, getStatusDetails } from "@/lib/utils";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const record = await prisma.record.findUnique({
    where: { slug },
  });

  if (!record) {
    return { title: "Record Not Found | WBRE" };
  }

  return {
    title: `${record.title} | WBRE Verified Record`,
    description: record.shortDescription,
  };
}

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const record = await prisma.record.findUnique({
    where: { slug },
    include: {
      category: true,
      holder: true,
      organization: true,
      certificates: true,
      historyEntries: {
        orderBy: { eventDate: "desc" },
      },
    },
  });

  if (!record) {
    notFound();
  }

  const statusDetails = getStatusDetails(record.status);
  const gallery = record.galleryJson ? JSON.parse(record.galleryJson) : [];
  const primaryCert = record.certificates?.[0];

  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/records"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-wbre-lightGold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Records</span>
          </Link>
        </div>

        {/* Hero Banner with Official Verification Badge */}
        <section className="py-12 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Category */}
              <Badge variant="category" size="md">
                {record.category?.name || "General"}
              </Badge>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider border ${statusDetails.bg}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{statusDetails.label}</span>
              </div>

              {/* Demo Badge */}
              {record.isDemo && (
                <Badge variant="demo" size="md">
                  DEMO RECORD
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-4">
                <span className="font-mono text-xs uppercase tracking-widest text-wbre-lightGold bg-wbre-royalNavy/80 px-3 py-1 rounded border border-wbre-primaryGold/30">
                  RECORD IDENTIFIER: {record.recordId}
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-normal leading-tight">
                  {record.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
                  {record.shortDescription}
                </p>
              </div>

              {/* Verified Result Box */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-wbre-surfaceDark via-wbre-royalNavy/80 to-wbre-deepNavy border-2 border-wbre-primaryGold/50 shadow-gold-subtle space-y-4">
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
                  OFFICIALLY RATIFIED BENCHMARK
                </span>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white gold-text-gradient">
                  {record.resultValue}
                </div>
                <div className="text-xs text-slate-300 pt-2 border-t border-white/10 space-y-1">
                  <p><span className="text-slate-400">Measurement Metric:</span> {record.measurementUnit}</p>
                  <p><span className="text-slate-400">Record Date:</span> {formatDate(record.recordDate)}</p>
                  <p><span className="text-slate-400">Ratification Date:</span> {formatDate(record.verificationDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Main Column: Dossier Details, Evidence, Gallery */}
            <div className="lg:col-span-8 space-y-12">
              {/* Featured Ceremony Certificate Visual */}
              {record.featuredImage && (
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] max-w-xl mx-auto w-full rounded-2xl overflow-hidden border-2 border-wbre-primaryGold/40 shadow-gold-glow bg-wbre-surfaceDarker group">
                    <Image
                      src={record.featuredImage}
                      alt={record.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 680px"
                      className="object-contain sm:object-cover sm:object-[center_16%]"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
                      <span className="font-mono text-[11px] font-semibold text-wbre-lightGold bg-wbre-deepNavy/95 px-3 py-1 rounded-md border border-wbre-primaryGold/40 shadow-md">
                        {record.recordId}
                      </span>
                      <span className="text-[11px] text-slate-300 bg-wbre-deepNavy/90 px-3 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                        Official Ratification Ceremony
                      </span>
                    </div>
                  </div>
                  <p className="text-center text-xs text-slate-400">
                    World Book of Record Excellence official certificate presentation ceremony
                  </p>
                </div>
              )}

              {/* Full Description / Archival Record Dossier */}
              <div className="p-8 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <FileCheck className="w-6 h-6 text-wbre-primaryGold" />
                  <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
                    Official Archival Dossier
                  </h2>
                </div>

                <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
                  <p>{record.fullDescription}</p>
                </div>
              </div>

              {/* Verification & Evidence Protocol */}
              <div className="p-8 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <ShieldCheck className="w-6 h-6 text-wbre-primaryGold" />
                  <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
                    Evidence & Adjudication Protocol
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {record.verificationMethod && (
                    <div className="p-4 rounded-xl bg-wbre-deepNavy/60 border border-wbre-primaryGold/15 space-y-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-wbre-lightGold block">
                        Verification Methodology
                      </span>
                      <p className="text-sm text-slate-200">{record.verificationMethod}</p>
                    </div>
                  )}

                  {record.evidenceSummary && (
                    <div className="p-4 rounded-xl bg-wbre-deepNavy/60 border border-wbre-primaryGold/15 space-y-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-wbre-lightGold block">
                        Evidence Summary
                      </span>
                      <p className="text-sm text-slate-200">{record.evidenceSummary}</p>
                    </div>
                  )}

                  {record.adjudicatorInfo && (
                    <div className="p-4 rounded-xl bg-wbre-deepNavy/60 border border-wbre-primaryGold/15 space-y-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-wbre-lightGold block">
                        Official Adjudicator / Board
                      </span>
                      <p className="text-sm text-slate-200">{record.adjudicatorInfo}</p>
                    </div>
                  )}

                  {record.witnessInfo && (
                    <div className="p-4 rounded-xl bg-wbre-deepNavy/60 border border-wbre-primaryGold/15 space-y-1">
                      <span className="text-xs uppercase tracking-wider font-semibold text-wbre-lightGold block">
                        Independent Witness Panel
                      </span>
                      <p className="text-sm text-slate-200">{record.witnessInfo}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Gallery if available */}
              {gallery.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
                    Photographic Documentation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gallery.map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative h-60 rounded-xl overflow-hidden border border-wbre-primaryGold/20 group"
                      >
                        <Image
                          src={imgUrl}
                          alt={`${record.title} evidence photo ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Record History Timeline */}
              {record.historyEntries.length > 0 && (
                <div className="p-8 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <Clock className="w-6 h-6 text-wbre-primaryGold" />
                    <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
                      Record Chronology & Status History
                    </h2>
                  </div>

                  <div className="relative pl-6 space-y-6 border-l-2 border-wbre-primaryGold/30">
                    {record.historyEntries.map((history) => (
                      <div key={history.id} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-wbre-primaryGold border-2 border-wbre-deepNavy" />
                        <div className="space-y-1">
                          <span className="text-xs font-mono font-semibold text-wbre-lightGold">
                            {formatDate(history.eventDate)}
                          </span>
                          <h4 className="text-base font-serif font-bold text-white uppercase tracking-wide">
                            {history.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-300">
                            {history.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Holder Profile, Certificate & QR Verification */}
            <div className="lg:col-span-4 space-y-8">
              {/* Recipient / Holder Profile Box */}
              <div className="p-6 rounded-2xl bg-wbre-surfaceDark/90 border border-wbre-primaryGold/30 shadow-premium-card space-y-5">
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
                  RECORD RECIPIENT
                </span>

                {record.holder && (
                  <div className="flex items-center gap-4">
                    {record.holder.photoUrl ? (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-wbre-primaryGold flex-shrink-0">
                        <Image
                          src={record.holder.photoUrl}
                          alt={record.holder.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-wbre-royalNavy flex items-center justify-center text-wbre-lightGold ring-1 ring-wbre-primaryGold flex-shrink-0">
                        <User className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <Link
                        href={`/people/${record.holder.slug}`}
                        className="text-lg font-serif font-bold text-white hover:text-wbre-lightGold transition-colors"
                      >
                        {record.holder.name}
                      </Link>
                      <p className="text-xs text-slate-300">{record.holder.country}</p>
                    </div>
                  </div>
                )}

                {record.organization && (
                  <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-wbre-royalNavy flex items-center justify-center text-wbre-lightGold ring-1 ring-wbre-primaryGold flex-shrink-0">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <Link
                        href={`/organizations/${record.organization.slug}`}
                        className="text-base font-serif font-bold text-white hover:text-wbre-lightGold transition-colors"
                      >
                        {record.organization.name}
                      </Link>
                      <p className="text-xs text-slate-300">{record.organization.country}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-wbre-primaryGold" />
                    <span>{record.location}, {record.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-wbre-primaryGold" />
                    <span>Attempt Date: {formatDate(record.recordDate)}</span>
                  </div>
                </div>
              </div>

              {/* Certificate & Instant Verification Card */}
              {record.certificateNumber && (
                <div className="p-6 rounded-2xl bg-gradient-to-b from-wbre-royalNavy/60 to-wbre-deepNavy border-2 border-wbre-primaryGold/50 shadow-gold-glow space-y-5 text-center">
                  <div className="w-12 h-12 rounded-full bg-wbre-deepNavy border border-wbre-primaryGold/60 mx-auto flex items-center justify-center text-wbre-primaryGold shadow-gold-subtle">
                    <Award className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-wbre-lightGold block">
                      OFFICIAL CERTIFICATION
                    </span>
                    <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider mt-1">
                      Certificate of Excellence
                    </h3>
                  </div>

                  <div className="p-3 bg-wbre-deepNavy rounded-lg border border-wbre-primaryGold/25">
                    <span className="text-[11px] text-slate-400 block">Certificate Reference</span>
                    <span className="font-mono text-xs font-bold text-wbre-lightGold">
                      {record.certificateNumber}
                    </span>
                  </div>

                  {/* QR Verification Code Preview */}
                  {primaryCert?.qrCodeDataUrl && (
                    <div className="flex flex-col items-center gap-2 pt-2">
                      <div className="p-2 bg-white rounded-lg shadow-inner inline-block">
                        <img
                          src={primaryCert.qrCodeDataUrl}
                          alt="Certificate Verification QR Code"
                          className="w-36 h-36"
                        />
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Scan to verify certificate authenticity
                      </span>
                    </div>
                  )}

                  <Button
                    href={`/verify/${record.certificateNumber}`}
                    variant="gold"
                    size="sm"
                    className="w-full"
                  >
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    <span>Verify Authenticity</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      </>
  );
}
