"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight, Award, Maximize2, ShieldCheck, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { CertificateModal } from "./CertificateModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const recipientName =
    record.holder?.name || record.organization?.name || "Official Laureate";

  return (
    <>
      <div className="group bg-gradient-to-b from-wbre-surfaceDark/90 via-wbre-surfaceDark to-wbre-deepNavy/95 hover:border-wbre-primaryGold/60 border border-wbre-primaryGold/25 rounded-2xl overflow-hidden transition-all duration-300 shadow-premium-card hover:shadow-gold-subtle flex flex-col h-full relative">
        {/* Certificate Photo Presentation Container */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative h-72 sm:h-80 w-full overflow-hidden bg-wbre-deepNavy cursor-pointer group/img select-none"
          title="Click to view full official certificate photo"
        >
          {record.featuredImage ? (
            <Image
              src={record.featuredImage}
              alt={record.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-[center_18%] group-hover/img:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-wbre-royalNavy/40 text-slate-400 p-6 text-center">
              <Award className="w-12 h-12 text-wbre-primaryGold/40 mb-2" />
              <span className="text-xs uppercase tracking-widest text-slate-400">
                WBRE Official Archive
              </span>
            </div>
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-wbre-surfaceDark via-transparent to-black/50" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 font-bold rounded-full uppercase px-2.5 py-1 text-[10px] tracking-wider bg-wbre-deepNavy/90 text-wbre-lightGold border border-wbre-primaryGold/40 shadow-sm backdrop-blur-sm">
              {record.category?.name || "Official Record"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>VERIFIED</span>
            </span>
          </div>

          {/* Bottom Floating Record ID & Quick Preview Hover Prompt */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="font-mono text-[11px] font-semibold text-wbre-lightGold bg-wbre-deepNavy/95 px-2.5 py-1 rounded-md border border-wbre-primaryGold/40 shadow-md">
              {record.recordId}
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gold-gradient text-wbre-deepNavy text-[11px] font-bold shadow-md hover:bg-gold-gradient-hover transition-all opacity-90 group-hover/img:opacity-100"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Inspect Photo</span>
            </button>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Location & Laureate */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-wbre-lightGold font-medium">
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate max-w-[180px] font-semibold">{recipientName}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 flex-shrink-0">
                <MapPin className="w-3 h-3 text-wbre-primaryGold" />
                <span>{record.country}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-serif font-bold text-white group-hover:text-wbre-lightGold transition-colors line-clamp-2 leading-snug">
              <Link href={`/records/${record.slug}`} className="focus:outline-none">
                {record.title}
              </Link>
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {record.shortDescription}
            </p>
          </div>

          {/* Verified Metric Highlight & Actions */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">
                Ratified Benchmark
              </span>
              <span className="text-xs sm:text-sm font-semibold text-wbre-lightGold text-right truncate max-w-[200px]">
                {record.resultValue}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-wbre-primaryGold" />
                <span>{formatDate(record.recordDate)}</span>
              </div>
              <span className="text-slate-400">{record.location}</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <Link
                href={`/records/${record.slug}`}
                className="flex-1 py-2 px-3 rounded-lg bg-wbre-royalNavy/80 hover:bg-wbre-royalNavy border border-wbre-primaryGold/30 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors group/btn"
              >
                <span>Full Record</span>
                <ArrowRight className="w-3.5 h-3.5 text-wbre-primaryGold group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="py-2 px-3 rounded-lg bg-wbre-deepNavy hover:bg-white/5 border border-wbre-primaryGold/25 text-wbre-lightGold hover:text-white font-medium text-xs flex items-center justify-center gap-1 transition-colors"
                title="View framed certificate ceremony"
              >
                <Award className="w-3.5 h-3.5 text-wbre-primaryGold" />
                <span>Certificate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* High-Resolution Certificate Modal Lightbox */}
      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={{
          title: record.title,
          recordId: record.recordId,
          slug: record.slug,
          resultValue: record.resultValue,
          recordDate: record.recordDate,
          country: record.country,
          location: record.location,
          featuredImage: record.featuredImage,
          holderName: recipientName,
          categoryName: record.category?.name,
        }}
      />
    </>
  );
}

export default RecordCard;
