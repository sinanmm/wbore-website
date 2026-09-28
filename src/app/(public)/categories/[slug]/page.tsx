import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecordCard } from "@/components/records/RecordCard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, Award } from "lucide-react";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.recordCategory.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: "Category Not Found | WBRE" };
  }

  return {
    title: `${category.name} Records | WBRE Official Registry`,
    description: category.description,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.recordCategory.findUnique({
    where: { slug },
    include: {
      records: {
        include: {
          category: true,
          holder: true,
          organization: true,
        },
        orderBy: { recordDate: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-300 hover:text-wbre-lightGold mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Categories</span>
            </Link>

            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-6">
                CATEGORY ARCHIVE
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight leading-tight">
                {category.name}
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </section>

        {/* Records Listing */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/10">
            <span className="text-sm font-semibold uppercase tracking-wider text-wbre-lightGold">
              Verified Records ({category.records.length})
            </span>
            <Button href="/apply" variant="gold" size="sm">
              Propose {category.name} Record
            </Button>
          </div>

          {category.records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.records.map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 bg-wbre-surfaceDark/50 rounded-2xl border border-wbre-primaryGold/20 max-w-lg mx-auto">
              <Award className="w-12 h-12 text-wbre-primaryGold/40 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-white mb-2">
                No Certified Records Yet
              </h3>
              <p className="text-slate-300 text-sm mb-6">
                Be the pioneer to establish the benchmark in this category.
              </p>
              <Button href="/apply" variant="gold" size="sm">
                Apply to Set First Record
              </Button>
            </div>
          )}
        </section>
      </div>
      </>
  );
}
