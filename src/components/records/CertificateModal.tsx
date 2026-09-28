"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Award, ExternalLink, Calendar, MapPin, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: {
    title: string;
    recordId: string;
    slug: string;
    resultValue: string;
    recordDate: Date | string;
    country: string;
    location: string;
    featuredImage?: string | null;
    holderName?: string;
    categoryName?: string;
  };
}

export function CertificateModal({ isOpen, onClose, record }: CertificateModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !record.featuredImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark blur backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl bg-wbre-surfaceDark border-2 border-wbre-primaryGold/50 rounded-2xl shadow-gold-glow overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-wbre-royalNavy/90 border-b border-wbre-primaryGold/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-wbre-deepNavy">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-wbre-lightGold block">
                OFFICIAL CEREMONY ARCHIVE
              </span>
              <span className="font-mono text-xs font-semibold text-white">
                {record.recordId}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Image & Information */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[82vh] overflow-y-auto">
          {/* Certificate Image Frame */}
          <div className="md:col-span-7 bg-black/60 p-4 sm:p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-wbre-primaryGold/40 bg-wbre-deepNavy">
              <Image
                src={record.featuredImage}
                alt={record.title}
                fill
                sizes="(max-width: 768px) 100vw, 550px"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Record Details Panel */}
          <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-wbre-surfaceDark to-wbre-deepNavy">
            <div className="space-y-4">
              {record.categoryName && (
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-wbre-royalNavy/90 text-wbre-lightGold border border-wbre-primaryGold/30">
                  {record.categoryName}
                </span>
              )}

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Honored Laureate
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {record.holderName || "Official Laureate"}
                </h3>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                  Ratified Milestone
                </span>
                <h4 className="text-base font-serif font-semibold text-wbre-lightGold leading-snug">
                  {record.title}
                </h4>
              </div>

              {/* Verified Result */}
              <div className="p-3.5 rounded-xl bg-wbre-royalNavy/60 border border-wbre-primaryGold/25 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                  Ratified Metric Benchmark
                </span>
                <span className="text-sm font-semibold text-white block">
                  {record.resultValue}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0" />
                  <span>{record.location}, {record.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0" />
                  <span>Ratified: {formatDate(record.recordDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Officially Verified & Authenticated by WBRE Board</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <Link
                href={`/records/${record.slug}`}
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-wbre-deepNavy font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-gold-subtle"
              >
                <span>Inspect Full Registry Dossier</span>
                <ExternalLink className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-wbre-surfaceDark hover:bg-white/5 border border-white/15 text-slate-300 hover:text-white font-medium text-xs tracking-wider transition-colors"
              >
                Close Certificate Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateModal;
