import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_CONFIG } from "@/config/site";
import { FileText, Compass, Zap, ShieldCheck, Award } from "lucide-react";

const STEP_ICONS = [FileText, Compass, Zap, ShieldCheck, Award];

export function ProcessSection() {
  return (
    <section className="py-20 sm:py-28 bg-wbre-institutionalNavy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="THE FIVE-STEP VERIFICATION PATHWAY"
          subtitle="From initial concept to permanent archival, every submission follows an uncompromising evidence-led verification standard."
          align="center"
        />

        {/* Process Steps: Desktop Horizontal & Mobile Vertical Timeline */}
        <div className="mt-16 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-[1px] bg-gradient-to-r from-wbre-primaryGold/10 via-wbre-primaryGold/50 to-wbre-primaryGold/10 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
            {SITE_CONFIG.howItWorksSteps.map((step, idx) => {
              const Icon = STEP_ICONS[idx] || Award;
              return (
                <div
                  key={step.step}
                  className="flex flex-col items-center text-center group bg-wbre-surfaceDark/60 lg:bg-transparent p-6 lg:p-0 rounded-2xl lg:rounded-none border lg:border-none border-wbre-primaryGold/15"
                >
                  {/* Step Number & Icon Circle */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-wbre-deepNavy border-2 border-wbre-primaryGold/40 group-hover:border-wbre-primaryGold group-hover:shadow-gold-subtle flex items-center justify-center transition-all duration-300">
                      <Icon className="w-7 h-7 text-wbre-lightGold group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-wbre-primaryGold text-[10px] font-bold text-wbre-deepNavy">
                      {step.step}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-wbre-lightGold mb-1">
                    {step.subtitle}
                  </span>

                  <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
