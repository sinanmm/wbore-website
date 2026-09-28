import React from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Official Record Guidelines & Ethics | WBRE",
  description: "Official rules of evidence collection, witness criteria, and safety protocols for record challengers.",
};

export default function RecordGuidelinesPage() {
  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        <section className="py-16 bg-gradient-to-b from-wbre-surfaceDarker to-wbre-deepNavy border-b border-wbre-primaryGold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-tight">
              RECORD GUIDELINES & ETHICAL CODE
            </h1>
            <p className="mt-3 text-xs uppercase tracking-widest text-wbre-lightGold">
              International Protocol Standards • WBRE
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-wbre-primaryGold" />
              1. Video Recording Protocol
            </h2>
            <p>
              All attempts must feature unedited continuous video capture from at least two separate fixed or stabilized angles. The recording must display the attempt from the official start signal to conclusion without cutaways.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-wbre-primaryGold" />
              2. Independent Witness Requirements
            </h2>
            <p>
              At least two qualified independent witnesses must be present throughout the entire attempt. Witnesses must not be direct relatives, employees, agents, or personal sponsors of the challenger.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              3. Strict Safety & Ethical Compliance
            </h2>
            <p>
              Attempts requiring medical oversight (extreme endurance, deep submergence, high-velocity) must submit certified medical emergency preparedness plans in advance. Reckless endangerment of participants or spectators will result in immediate disqualification.
            </p>
          </div>

          <div className="pt-6 text-center">
            <Button href="/apply" variant="gold" size="lg">
              <span>Submit A Record Concept</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </div>
      </>
  );
}
