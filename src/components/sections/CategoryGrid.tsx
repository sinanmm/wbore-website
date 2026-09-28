import React from "react";
import Link from "next/link";
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
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_CONFIG } from "@/config/site";

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

export function CategoryGrid() {
  return (
    <section className="py-20 sm:py-28 bg-wbre-deepNavy relative overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="RECORD CATEGORIES"
          title="EXTRAORDINARY ACHIEVEMENT HAS MANY FORMS."
          subtitle="Explore the official disciplines and domains where world-defining benchmarks are established and permanently recognized."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {SITE_CONFIG.categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Trophy;
            return (
              <div
                key={cat.slug}
                className="group p-6 rounded-xl bg-wbre-surfaceDark/80 hover:bg-wbre-surfaceDark border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/60 transition-all duration-300 shadow-premium-card hover:shadow-gold-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/30 text-wbre-lightGold mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-wbre-lightGold transition-colors mb-2.5">
                    {cat.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed mb-6">
                    {cat.description}
                  </p>
                </div>

                <Link
                  href={`/records?category=${encodeURIComponent(cat.name)}`}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-wbre-lightGold hover:text-white transition-colors group/link pt-3 border-t border-white/10"
                >
                  <span>View Records</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
