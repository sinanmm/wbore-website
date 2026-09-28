import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Globe, CheckCircle2, Lock, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center bg-wbre-deepNavy pt-32 pb-20 overflow-hidden">
      {/* Subtle Background Elements: Institutional Grid & Globe Radial */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-globe-radial opacity-80 pointer-events-none" />
      
      {/* Decorative Golden Coordinate Rings */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full border border-wbre-primaryGold/10 pointer-events-none" />
      <div className="absolute top-1/2 -right-40 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-wbre-primaryGold/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Small Institutional Label */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 shadow-inner-gold mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-wbre-primaryGold animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-wbre-lightGold">
                WORLD BOOK OF RECORD EXCELLENCE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.08] tracking-tight font-normal">
              WHERE{" "}
              <span className="gold-text-gradient font-serif block sm:inline">
                EXCELLENCE
              </span>{" "}
              BECOMES HISTORY.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A global platform dedicated to recognizing remarkable human achievement through clear standards, evidence-led review and enduring public recognition.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button href="/apply" variant="gold" size="lg" className="w-full sm:w-auto">
                <span>Apply For A Record</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button href="/verify" variant="outline-gold" size="lg" className="w-full sm:w-auto">
                <ShieldCheck className="w-4 h-4 mr-2 text-wbre-primaryGold" />
                <span>Verify A Record</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Official WBRE Emblem */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            {/* Subtle Soft Gold Radial Glow */}
            <div className="absolute w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full bg-gold-radial-light blur-3xl pointer-events-none opacity-70" />
            
            {/* Official Finalized Emblem */}
            <div className="relative w-full max-w-[290px] sm:max-w-[390px] lg:max-w-[520px] flex items-center justify-center">
              <Image
                src="/WBRE.png"
                alt="World Book of Record Excellence"
                width={700}
                height={700}
                priority
                className="relative z-10 w-[520px] max-w-full h-auto object-contain select-none filter drop-shadow-[0_24px_35px_rgba(0,0,0,0.22)]"
              />
            </div>
          </div>
        </div>

        {/* Under Hero: 3 Credibility Indicators */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-wbre-primaryGold/20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-center gap-4 p-5 rounded-xl bg-wbre-surfaceDark/50 border border-wbre-primaryGold/15 hover:border-wbre-primaryGold/35 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/30 flex-shrink-0 text-wbre-lightGold">
              <Globe className="w-6 h-6 text-wbre-primaryGold" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-wbre-lightGold block">
                GLOBAL
              </span>
              <span className="text-sm font-medium text-white">
                Achievement Recognition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-wbre-surfaceDark/50 border border-wbre-primaryGold/15 hover:border-wbre-primaryGold/35 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/30 flex-shrink-0 text-wbre-lightGold">
              <CheckCircle2 className="w-6 h-6 text-wbre-primaryGold" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-wbre-lightGold block">
                EVIDENCE-LED
              </span>
              <span className="text-sm font-medium text-white">
                Structured Verification
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-wbre-surfaceDark/50 border border-wbre-primaryGold/15 hover:border-wbre-primaryGold/35 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/30 flex-shrink-0 text-wbre-lightGold">
              <Lock className="w-6 h-6 text-wbre-primaryGold" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-wbre-lightGold block">
                PERMANENT
              </span>
              <span className="text-sm font-medium text-white">
                Digital Record Identity
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
