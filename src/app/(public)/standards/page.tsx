import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WBRE_CONFIG } from "@/lib/config";
import {
  Ruler,
  RefreshCw,
  ShieldCheck,
  Target,
  HeartPulse,
  Scale,
  Sparkles,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Verification Principles & Standards | WBRE",
  description:
    "Official verification principles and adjudication criteria governing all World Book of Record Excellence titles.",
};

const PRINCIPLE_ICONS: Record<string, any> = {
  "01": Ruler,
  "02": RefreshCw,
  "03": ShieldCheck,
  "04": Target,
  "05": HeartPulse,
  "06": Scale,
  "07": Sparkles,
};

export default function StandardsPage() {
  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-6">
              ADJUDICATION FRAMEWORK
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              VERIFICATION <span className="gold-text-gradient font-serif">PRINCIPLES</span> & STANDARDS
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Every official WBRE title is evaluated against seven foundational pillars of objective verification, empirical rigor, and institutional integrity.
            </p>
          </div>
        </section>

        {/* 7 Verification Principles */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {WBRE_CONFIG.verificationPrinciples.map((principle, index) => {
              const Icon = PRINCIPLE_ICONS[principle.number] || ShieldCheck;
              return (
                <div
                  key={principle.number}
                  className="p-8 rounded-2xl bg-wbre-surfaceDark/80 hover:bg-wbre-surfaceDark border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/50 transition-all duration-300 shadow-premium-card flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start sm:items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/40 text-wbre-primaryGold flex-shrink-0">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-mono text-xs font-bold text-wbre-lightGold bg-wbre-deepNavy px-2.5 py-0.5 rounded border border-wbre-primaryGold/30">
                          RULE {principle.number}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wider">
                          {principle.title}
                        </h3>
                      </div>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ineligible Concepts Notice */}
          <div className="mt-16 p-8 rounded-2xl bg-wbre-royalNavy/40 border border-amber-500/30">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="text-lg font-serif font-bold text-amber-200 uppercase tracking-wider">
                  Ineligible & Disallowed Proposals
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  WBRE strictly disallows any record attempts involving animal cruelty, underage risk endangerment, illegal public disruption, destruction of natural monuments, food wastage, or subjective artistic value judgments. All prospective applicants must adhere to environmental and safety guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Button href="/apply" variant="gold" size="lg">
              <span>Submit Record For Review</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </div>
      </>
  );
}
