import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  Target,
  Eye,
  Award,
  Scale,
  Sparkles,
  CheckCircle2,
  Globe,
  Lock,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About WBRE | Built to Recognize Distinction",
  description:
    "Learn about the World Book of Record Excellence mission, vision, core values, and evidence-led verification framework.",
};

export default function AboutPage() {
  const values = [
    {
      title: "Integrity",
      description: "Unwavering commitment to factual accuracy, independent adjudication, and strict adherence to protocol.",
      icon: ShieldCheck,
    },
    {
      title: "Excellence",
      description: "Setting the highest global benchmark for what constitutes genuine, transcendent human achievement.",
      icon: Award,
    },
    {
      title: "Transparency",
      description: "Open criteria, clear evidence standards, and verifiable measurement records accessible to the public.",
      icon: Eye,
    },
    {
      title: "Objectivity",
      description: "Strictly empirical metrics evaluated without bias, favoritism, or commercial compromise.",
      icon: Scale,
    },
    {
      title: "Global Recognition",
      description: "Providing internationally respected credentials, certificates, and archival permanent registry identity.",
      icon: Globe,
    },
    {
      title: "Innovation",
      description: "Modernizing record verification through digital signatures, high-resolution telemetry, and secure QR systems.",
      icon: Sparkles,
    },
  ];

  const whyWbreItems = [
    {
      title: "Measurable Standards",
      desc: "Every title is governed by rigorous metric definitions formulated by domain specialists.",
    },
    {
      title: "Structured Evidence",
      desc: "Multi-angle visual capture, calibrated instruments, and sworn witness affidavits.",
    },
    {
      title: "Unique Record Identity",
      desc: "Permanent cryptographic and alphanumeric Record ID assigned to every verified title.",
    },
    {
      title: "Public Verification",
      desc: "Instant live QR and serial number verification portal accessible worldwide.",
    },
    {
      title: "International Recognition",
      desc: "Honoring laureates, scientists, athletes, and civic leaders across over 120 nations.",
    },
    {
      title: "Permanent Digital Archive",
      desc: "Indelible historical preservation guaranteeing achievements are documented forever.",
    },
  ];

  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-6">
              INSTITUTIONAL IDENTITY
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              BUILT TO <span className="gold-text-gradient font-serif">RECOGNIZE</span> DISTINCTION.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              World Book of Record Excellence is an international record-recognition and achievement-verification authority dedicated to documenting extraordinary human endeavors.
            </p>
          </div>
        </section>

        {/* Who We Are & Mission / Vision */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[1px] bg-wbre-primaryGold" />
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-wbre-lightGold">
                  WHO WE ARE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                An enduring international registry for transformative achievements.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Headquartered across key international hubs including Dubai, London, and the United States, World Book of Record Excellence operates as a prestigious certification authority. We serve as the bridge between extraordinary potential and permanent historical record.
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Unlike informal listicles or commercial certificates, every WBRE record represents a strictly audited milestone evaluated by certified adjudicators, technical observers, and independent subject-matter examiners.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/25 shadow-premium-card space-y-4">
                <div className="w-12 h-12 rounded-xl bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/40 text-wbre-lightGold">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
                  OUR MISSION
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Recognize extraordinary human achievement using transparent standards and a consistent verification framework.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/25 shadow-premium-card space-y-4">
                <div className="w-12 h-12 rounded-xl bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/40 text-wbre-lightGold">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
                  OUR VISION
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Build a globally respected archive of achievements that inspires individuals, institutions and communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-wbre-institutionalNavy border-y border-wbre-primaryGold/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="INSTITUTIONAL PILLARS"
              title="OUR CORE VALUES"
              subtitle="The guiding ethics behind every standard, adjudication procedure, and archival decision."
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {values.map((val) => {
                const Icon = val.icon;
                return (
                  <div
                    key={val.title}
                    className="p-7 rounded-xl bg-wbre-surfaceDark/70 hover:bg-wbre-surfaceDark border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/50 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/30 text-wbre-lightGold mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-2">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why WBRE */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="DISTINCTION & INTEGRITY"
            title="WHY WBRE?"
            subtitle="How our structured methodology sets the definitive international standard in record adjudication."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {whyWbreItems.map((item, idx) => (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-wbre-surfaceDark/50 border border-wbre-primaryGold/15 hover:border-wbre-primaryGold/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-wbre-primaryGold flex-shrink-0" />
                  <h3 className="text-base font-serif font-bold text-white uppercase tracking-wide">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button href="/apply" variant="gold" size="lg">
              <span>Submit A Record Proposal</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </div>
      </>
  );
}
