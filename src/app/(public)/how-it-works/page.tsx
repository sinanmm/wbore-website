import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { WBRE_CONFIG } from "@/lib/config";
import {
  FileText,
  Compass,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckSquare,
  HelpCircle,
} from "lucide-react";

export const metadata = {
  title: "How It Works | The WBRE Verification Pathway",
  description:
    "Comprehensive guide to the 5-step World Book of Record Excellence application, guidelines, attempt, and adjudication process.",
};

const STEP_DETAILS = [
  {
    step: "01",
    title: "APPLY FOR A RECORD",
    icon: FileText,
    summary: "Submit your proposed achievement and record concept.",
    details: [
      "Select your applicant type (individual, corporate, university, NGO, or government entity).",
      "Draft a clear, non-subjective title describing the proposed metric.",
      "Identify the benchmark you intend to surpass with preliminary evidence.",
      "Receive an official Application Reference Number (e.g. WBRE-APP-2026-000001).",
    ],
  },
  {
    step: "02",
    title: "DEFINE CRITERIA & RULES",
    icon: Compass,
    summary: "WBRE establishes measurable criteria, guidelines, and evidence requirements.",
    details: [
      "The adjudication board reviews the proposal against safety, legal, and repeatability standards.",
      "Official Record Guidelines & Measurement Pack are generated for your specific attempt.",
      "Witness qualification criteria (independent judges, timekeepers, licensed surveyors) are designated.",
      "Technical log requirements (continuous video, calibration logs, GPS telemetry) are specified.",
    ],
  },
  {
    step: "03",
    title: "CONDUCT THE ATTEMPT",
    icon: Zap,
    summary: "Conduct the record attempt according to the issued rules.",
    details: [
      "Execute the attempt strictly within the parameters of the WBRE guideline pack.",
      "Appoint qualified independent witnesses who have no direct commercial conflict of interest.",
      "Record uninterrupted multi-angle footage of the entire attempt.",
      "Gather sworn witness statements, calibration certificates, and timing logs.",
    ],
  },
  {
    step: "04",
    title: "VERIFY & ADJUDICATE",
    icon: ShieldCheck,
    summary: "Evidence is reviewed through the appropriate verification pathway.",
    details: [
      "Submit the comprehensive evidence dossier through the secure WBRE verification upload portal.",
      "Technical examiners, video analysts, and domain specialists inspect every piece of data.",
      "Cross-check GPS telemetry, chronometer precision, and independent witness affidavits.",
      "Adjudication board formally votes on ratification.",
    ],
  },
  {
    step: "05",
    title: "REGISTER & CERTIFY",
    icon: Award,
    summary: "Approved achievements become part of the official WBRE registry.",
    details: [
      "The official Record ID (e.g. WBRE-WR-2026-000001) is permanently generated.",
      "A gold-embossed Certificate of Excellence with cryptographic QR verification is issued.",
      "The record profile is published to the public global WBRE registry.",
      "Official archival entry is permanently preserved for global reference.",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-6">
              STEP-BY-STEP ADJUDICATION
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              HOW IT <span className="gold-text-gradient font-serif">WORKS</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Explore the complete 5-step pathway from proposal formulation to official worldwide registration.
            </p>
          </div>
        </section>

        {/* Detailed 5-Step Process */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {STEP_DETAILS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="p-8 sm:p-10 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 shadow-premium-card space-y-6 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/40 text-wbre-primaryGold flex-shrink-0 shadow-gold-subtle">
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-[0.25em] font-bold text-wbre-lightGold">
                          PHASE {step.step}
                        </span>
                        <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wide">
                          {step.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <p className="text-base text-slate-200 font-medium">
                    {step.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {step.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-lg bg-wbre-deepNavy/60 border border-wbre-primaryGold/10"
                      >
                        <CheckSquare className="w-4 h-4 text-wbre-primaryGold flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center space-y-4">
            <Button href="/apply" variant="gold" size="lg">
              <span>Begin Step 1: Apply Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <div>
              <Button href="/application-status" variant="ghost" size="sm">
                Already submitted? Track your application status
              </Button>
            </div>
          </div>
        </section>
      </div>
      </>
  );
}
