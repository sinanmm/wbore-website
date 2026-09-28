import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, getStatusDetails } from "@/lib/utils";

export interface RecordCardProps {
  record: {
    id: string;
    recordId: string;
    slug: string;
    title: string;
    shortDescription: string;
    resultValue: string;
    measurementUnit: string;
    recordDate: Date | string;
    country: string;
    location: string;
    status: string;
    isDemo?: boolean;
    featuredImage?: string | null;
    category?: {
      name: string;
      slug: string;
    } | null;
    holder?: {
      name: string;
      slug: string;
    } | null;
    organization?: {
      name: string;
      slug: string;
    } | null;
  };
}

export function RecordCard({ record }: RecordCardProps) {
  const statusDetails = getStatusDetails(record.status);
  const recipientName =
    record.holder?.name || record.organization?.name || "Official Registry Record";

  return (
    <div className="group bg-wbre-surfaceDark/80 hover:bg-wbre-surfaceDark border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/50 rounded-xl overflow-hidden transition-all duration-300 shadow-premium-card hover:shadow-gold-subtle flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-wbre-deepNavy">
        {record.featuredImage ? (
          <Image
            src={record.featuredImage}
            alt={record.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-wbre-royalNavy/40 text-slate-400 p-6 text-center">
            <Award className="w-12 h-12 text-wbre-primaryGold/40 mb-2" />
            <span className="text-xs uppercase tracking-widest text-slate-400">
              WBRE Official Archive
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-wbre-surfaceDark via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <Badge variant="category" size="sm">
            {record.category?.name || "General"}
          </Badge>

          {record.isDemo && (
            <Badge variant="demo" size="sm">
              DEMO RECORD
            </Badge>
          )}
        </div>

        {/* Bottom Floating Record ID */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="font-mono text-[11px] font-semibold text-wbre-lightGold bg-wbre-deepNavy/90 px-2.5 py-1 rounded border border-wbre-primaryGold/30">
            {record.recordId}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0" />
            <span className="truncate">{record.location}, {record.country}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-serif font-bold text-white group-hover:text-wbre-lightGold transition-colors line-clamp-2 leading-snug">
            <Link href={`/records/${record.slug}`} className="focus:outline-none">
              {record.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {record.shortDescription}
          </p>
        </div>

        {/* Verified Result Highlight */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Verified Metric
            </span>
            <span className="text-sm sm:text-base font-semibold text-wbre-lightGold">
              {record.resultValue}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 truncate mr-2">
              <span className="font-medium text-slate-300 truncate">
                Holder: {recipientName}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 flex-shrink-0">
              <Calendar className="w-3 h-3 text-wbre-primaryGold" />
              <span>{formatDate(record.recordDate)}</span>
            </div>
          </div>

          {/* CTA Link */}
          <Link
            href={`/records/${record.slug}`}
            className="inline-flex items-center justify-between w-full pt-2 text-xs font-semibold uppercase tracking-wider text-wbre-lightGold group-hover:text-white transition-colors"
          >
            <span>View Official Record</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecordCard;
