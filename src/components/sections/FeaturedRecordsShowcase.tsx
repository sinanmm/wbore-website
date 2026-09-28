"use client";

import React, { useState, useMemo } from "react";
import { RecordCard, RecordCardProps } from "@/components/records/RecordCard";
import { ShieldCheck, Award, Globe2, Sparkles, Filter } from "lucide-react";

interface FeaturedRecordsShowcaseProps {
  records: RecordCardProps["record"][];
}

export function FeaturedRecordsShowcase({ records }: FeaturedRecordsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Extract unique category names
  const categories = useMemo(() => {
    const cats = new Set<string>();
    records.forEach((r) => {
      if (r.category?.name) cats.add(r.category.name);
    });
    return ["ALL", ...Array.from(cats)];
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    if (selectedCategory === "ALL") return records;
    return records.filter((r) => r.category?.name === selectedCategory);
  }, [records, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Category Filter Pills & Archive Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-4 border-b border-wbre-primaryGold/15">
        {/* Pills */}
        <div className="flex items-center flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === "ALL"
                ? records.length
                : records.filter((r) => r.category?.name === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all uppercase flex items-center gap-1.5 ${
                  isActive
                    ? "bg-gold-gradient text-wbre-deepNavy shadow-gold-subtle"
                    : "bg-wbre-surfaceDark/80 hover:bg-wbre-surfaceDark text-slate-300 hover:text-white border border-wbre-primaryGold/25 hover:border-wbre-primaryGold/50"
                }`}
              >
                <span>{cat === "ALL" ? "All Laureates" : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-wbre-deepNavy/20 text-wbre-deepNavy font-bold"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status text */}
        <div className="flex items-center gap-2 text-xs text-wbre-lightGold font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Showing {filteredRecords.length} Authenticated Archives</span>
        </div>
      </div>

      {/* Records Layout */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-8">
          {/* Main Grid: When 5 items on desktop, 3 in first row and 2 centered in second row */}
          {selectedCategory === "ALL" && records.length === 5 ? (
            <div className="space-y-8">
              {/* Row 1: First 3 records */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {records.slice(0, 3).map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>

              {/* Row 2: Remaining 2 records centered on large screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {records.slice(3, 5).map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecords.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-wbre-surfaceDark/50 rounded-2xl border border-wbre-primaryGold/20 max-w-xl mx-auto">
          <p className="text-slate-300 text-sm">
            No records found for the selected category.
          </p>
        </div>
      )}

      {/* Trust & Verification Footnote Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-wbre-surfaceDark via-wbre-royalNavy/60 to-wbre-surfaceDark border border-wbre-primaryGold/20 shadow-premium-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-wbre-royalNavy border border-wbre-primaryGold/40 flex items-center justify-center text-wbre-primaryGold flex-shrink-0 shadow-gold-subtle">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-serif font-bold text-white uppercase tracking-wider">
              Institutional Archival Standard
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Every certified record underwent forensic evidence examination, multi-witness sworn attestations, and board ratification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-wbre-primaryGold" />
            <span>5 Verified Nations</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-wbre-primaryGold" />
            <span>100% Board Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedRecordsShowcase;
