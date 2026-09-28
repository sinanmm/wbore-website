import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookOpen, ShieldCheck, Award } from "lucide-react";

export function PurposeSection() {
  const pillars = [
    {
      number: "01",
      title: "DEFINE",
      icon: BookOpen,
      description:
        "Every record title should use a clear, measurable and repeatable definition.",
    },
    {
      number: "02",
      title: "VERIFY",
      icon: ShieldCheck,
      description:
        "Evidence, witnesses and technical review create a traceable verification pathway.",
    },
    {
      number: "03",
      title: "RECOGNIZE",
      icon: Award,
      description:
        "Approved achievements receive a public identity, certificate and lasting registry presence.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-wbre-institutionalNavy relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="OUR PURPOSE"
          title="Recognition built around standards, not just certificates."
          subtitle="World Book of Record Excellence is designed as a modern international achievement registry for exceptional individuals, organizations, institutions and communities."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="group p-8 rounded-2xl bg-wbre-surfaceDark/70 hover:bg-wbre-surfaceDark border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/50 transition-all duration-300 shadow-premium-card hover:shadow-gold-subtle flex flex-col justify-between relative overflow-hidden"
              >
                {/* Subtle top gold accent line */}
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-wbre-primaryGold/40 to-transparent group-hover:via-wbre-primaryGold transition-all duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-wbre-lightGold/60 group-hover:text-wbre-lightGold transition-colors">
                      {pillar.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/30 text-wbre-primaryGold group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white uppercase tracking-wider mb-4">
                    {pillar.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default PurposeSection;
