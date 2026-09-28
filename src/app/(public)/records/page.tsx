import React from "react";
import Link from "next/link";
import { RecordCard } from "@/components/records/RecordCard";
import { Button } from "@/components/ui/Button";
import { Search, Filter, RotateCcw, Award, Globe, ShieldCheck } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Official Records Registry | World Book of Record Excellence",
  description:
    "Explore verified global human achievements, authenticated records, and historical benchmarks in the official WBRE registry.",
};

interface RecordsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    country?: string;
    year?: string;
    sort?: string;
  }>;
}

export default async function RecordsRegistryPage({
  searchParams,
}: RecordsPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const selectedCategory = params.category || "";
  const selectedStatus = params.status || "";
  const selectedCountry = params.country || "";
  const selectedYear = params.year || "";
  const selectedSort = params.sort || "newest";

  // Build where filters
  const where: any = {};

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { recordId: { contains: query } },
      { country: { contains: query } },
      { location: { contains: query } },
      { holder: { name: { contains: query } } },
      { organization: { name: { contains: query } } },
      { shortDescription: { contains: query } },
    ];
  }

  if (selectedCategory) {
    where.category = {
      name: selectedCategory,
    };
  }

  if (selectedStatus) {
    where.status = selectedStatus;
  }

  if (selectedCountry) {
    where.country = selectedCountry;
  }

  if (selectedYear) {
    const yearNum = parseInt(selectedYear);
    if (!isNaN(yearNum)) {
      where.recordDate = {
        gte: new Date(`${yearNum}-01-01`),
        lte: new Date(`${yearNum}-12-31`),
      };
    }
  }

  // Sorting
  let orderBy: any = { recordDate: "desc" };
  if (selectedSort === "oldest") orderBy = { recordDate: "asc" };
  if (selectedSort === "title") orderBy = { title: "asc" };

  // Fetch records and categories
  let records: any[] = [];
  let categories: any[] = [];
  let countries: string[] = [];

  try {
    const [fetchedRecords, fetchedCategories, allRecordsForCountries] = await Promise.all([
      prisma.record.findMany({
        where,
        include: {
          category: true,
          holder: true,
          organization: true,
        },
        orderBy,
      }),
      prisma.recordCategory.findMany({
        orderBy: { displayOrder: "asc" },
      }),
      prisma.record.findMany({
        select: { country: true },
        distinct: ["country"],
      }),
    ]);

    records = fetchedRecords;
    categories = fetchedCategories;
    countries = allRecordsForCountries.map((r) => r.country).filter(Boolean);
  } catch (err) {
    console.error("Failed to query records:", err);
  }

  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-6">
              INTERNATIONAL ARCHIVE
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              OFFICIAL RECORD <span className="gold-text-gradient font-serif">REGISTRY</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Explore officially verified benchmarks, historical laureates, and extraordinary world achievements preserved in the permanent WBRE register.
            </p>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="p-6 rounded-2xl bg-wbre-surfaceDark border border-wbre-primaryGold/30 shadow-gold-subtle">
            <form method="GET" action="/records" className="space-y-4">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-wbre-primaryGold" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Search by record title, recipient, country, Record ID (e.g. WBRE-WR-2026-000101)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-wbre-deepNavy border border-wbre-primaryGold/30 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-wbre-primaryGold text-sm"
                />
              </div>

              {/* Filters row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Category filter */}
                <select
                  name="category"
                  defaultValue={selectedCategory}
                  className="px-3.5 py-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Status filter */}
                <select
                  name="status"
                  defaultValue={selectedStatus}
                  className="px-3.5 py-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">ACTIVE (Verified)</option>
                  <option value="BROKEN">BROKEN (Superseded)</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                  <option value="REVOKED">REVOKED</option>
                </select>

                {/* Country filter */}
                <select
                  name="country"
                  defaultValue={selectedCountry}
                  className="px-3.5 py-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
                >
                  <option value="">All Countries</option>
                  {countries.map((ctry) => (
                    <option key={ctry} value={ctry}>
                      {ctry}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  name="sort"
                  defaultValue={selectedSort}
                  className="px-3.5 py-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-wbre-primaryGold"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                  <option value="title">Sort: Title (A-Z)</option>
                </select>

                {/* Submit & Reset */}
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-lg bg-gold-gradient text-wbre-deepNavy font-semibold text-xs uppercase tracking-wider hover:bg-gold-gradient-hover transition-all"
                  >
                    Filter
                  </button>
                  <Link
                    href="/records"
                    className="p-2.5 rounded-lg bg-wbre-deepNavy border border-slate-700 text-slate-300 hover:text-white"
                    title="Reset filters"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Record Results Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <span className="text-xs uppercase tracking-widest font-semibold text-wbre-lightGold">
              Showing {records.length} Verified {records.length === 1 ? "Record" : "Records"}
            </span>
            <span className="text-xs text-slate-400">
              World Book of Record Excellence Registry
            </span>
          </div>

          {records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {records.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 bg-wbre-surfaceDark/50 rounded-2xl border border-wbre-primaryGold/20 max-w-xl mx-auto space-y-4">
              <Award className="w-12 h-12 text-wbre-primaryGold/40 mx-auto" />
              <h3 className="text-xl font-serif font-bold text-white">
                No Verified Records Found
              </h3>
              <p className="text-slate-300 text-sm">
                No certified records matched your search parameters. Try clearing some filters or searching with a different term.
              </p>
              <div className="pt-2">
                <Button href="/records" variant="outline-gold" size="sm">
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
      </>
  );
}
