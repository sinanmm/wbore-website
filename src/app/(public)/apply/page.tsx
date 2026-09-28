import React from "react";
import { MultiStepApplyWizard } from "@/components/apply/MultiStepApplyWizard";

export const metadata = {
  title: "Apply for a World Record | Official Application Portal | WBRE",
  description:
    "Submit your record proposal to the World Book of Record Excellence for formal evaluation, measurement guidelines, and adjudication.",
};

export default function ApplyPage() {
  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-4">
              FORMAL ADJUDICATION APPLICATION
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              APPLY FOR A <span className="gold-text-gradient font-serif">WORLD RECORD</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Complete the standardized 5-step application to register your attempt concept and initiate official WBRE adjudication protocols.
            </p>
          </div>
        </section>

        {/* Multi-Step Wizard Section */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MultiStepApplyWizard />
        </section>
      </div>
      </>
  );
}
