import React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Award } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-24 bg-wbre-deepNavy relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-b from-wbre-surfaceDark via-wbre-royalNavy/90 to-wbre-deepNavy border-2 border-wbre-primaryGold/40 p-8 sm:p-14 text-center shadow-gold-glow relative overflow-hidden">
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-wbre-lightGold pointer-events-none m-4 opacity-60" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-wbre-lightGold pointer-events-none m-4 opacity-60" />

          <div className="w-16 h-16 rounded-full bg-wbre-deepNavy border border-wbre-primaryGold/50 mx-auto mb-6 flex items-center justify-center text-wbre-primaryGold shadow-gold-subtle">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-wbre-lightGold block mb-3">
            OFFICIAL ADJUDICATION APPLICATION
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-tight mb-5 font-normal">
            READY TO MAKE HISTORY?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            Every extraordinary achievement begins with an attempt. Submit your record concept and begin the WBRE verification process.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/apply" variant="gold" size="lg" className="w-full sm:w-auto px-8">
              <span>Start Your Application</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button href="/standards" variant="outline-gold" size="lg" className="w-full sm:w-auto px-8">
              <span>Review Verification Standards</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
