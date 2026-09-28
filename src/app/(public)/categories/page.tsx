import React from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WBRE_CONFIG } from "@/lib/config";
import {
  Trophy,
  Palette,
  Atom,
  GraduationCap,
  TrendingUp,
  Users,
  HeartHandshake,
  Leaf,
  Sparkles,
  Medal,
  Lightbulb,
  Building2,
  ArrowRight,
} from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Record Categories | World Book of Record Excellence",
  description:
    "Browse official WBRE achievement disciplines across science, technology, arts, endurance, education, and humanitarian impact.",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Palette,
  Atom,
  GraduationCap,
  TrendingUp,
  Users,
  HeartHandshake,
  Leaf,
  Sparkles,
  Medal,
  Lightbulb,
  Building2,
};

export default async function CategoriesIndexPage() {
  let categoriesWithCounts: Array<{
    name: string;
    slug: string;
    description: string;
    icon: string;
    count: number;
  }> = WBRE_CONFIG.categories.map((c) => ({
    ...c,
    count: 0,
  }));

  try {
    const dbCategories = await prisma.recordCategory.findMany({
      include: {
        _count: {
          select: { records: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    if (dbCategories.length > 0) {
      categoriesWithCounts = dbCategories.map((c) => ({
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.iconName,
        count: c._count.records,
      }));
    }
  } catch (e) {
    console.error("Error loading categories:", e);
  }

  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-6">
              OFFICIAL TAXONOMY
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              RECORD <span className="gold-text-gradient font-serif">CATEGORIES</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Explore the twelve primary institutional domains under which extraordinary human achievements and institutional milestones are codified.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesWithCounts.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Trophy;
              return (
                <div
                  key={cat.slug}
                  className="group p-8 rounded-2xl bg-wbre-surfaceDark/80 hover:bg-wbre-surfaceDark border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/60 transition-all duration-300 shadow-premium-card hover:shadow-gold-subtle flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/30 text-wbre-lightGold group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-xs uppercase tracking-wider font-semibold text-wbre-lightGold bg-wbre-deepNavy px-3 py-1 rounded-full border border-wbre-primaryGold/25">
                        {cat.count} {cat.count === 1 ? "Record" : "Records"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-white group-hover:text-wbre-lightGold transition-colors mb-3">
                      {cat.name}
                    </h2>

                    <p className="text-sm text-slate-300 leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  <Link
                    href={`/records?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-wbre-lightGold hover:text-white transition-colors pt-4 border-t border-white/10"
                  >
                    <span>Browse Category Registry</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      </>
  );
}
