import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { FOOTER_NAV_SECTIONS } from "@/config/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wbre-surfaceDarker text-slate-300 border-t border-wbre-primaryGold/25 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-wbre-royalNavy/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Logo size="lg" href="/" />

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              World Book of Record Excellence recognizes remarkable achievements through structured standards, evidence-led verification and enduring global recognition.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-[11px] text-wbre-lightGold font-medium tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-wbre-primaryGold" />
                Official International Registry
              </span>
            </div>
          </div>

          {/* Nav Sections from Config */}
          {FOOTER_NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-wbre-primaryGold" />
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-wbre-lightGold transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} World Book of Record Excellence. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-wbre-primaryGold font-medium tracking-widest uppercase">
              WBRE • RECOGNIZING DISTINCTION
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
