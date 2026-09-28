import React from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { GlobalOffices } from "@/components/home/GlobalOffices";
import { Mail, Phone, MapPin, Building, Globe2 } from "lucide-react";

export const metadata = {
  title: "Contact & Global Offices | WBRE",
  description:
    "Connect with World Book of Record Excellence international adjudication headquarters in Dubai, London, and the United States.",
};

export default function ContactPage() {
  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Page Hero */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/60 border border-wbre-primaryGold/30 text-xs font-semibold uppercase tracking-[0.25em] text-wbre-lightGold mb-4">
              COMMUNICATIONS & DIPLOMATIC DESK
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-tight max-w-4xl mx-auto leading-tight">
              CONNECT WITH <span className="gold-text-gradient font-serif">WBRE</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Reach out to our global headquarters and adjudication secretariats for record enquiries, institutional partnerships, and adjudicator assignments.
            </p>
          </div>
        </section>

        {/* Contact Grid & Form */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
                  DIRECT CHANNELS
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase">
                  Global Secretariats & Enquiries
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  For formal adjudication dispatch, media accreditations, or legal record verifications, contact our centralized desk.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-wbre-royalNavy flex items-center justify-center text-wbre-lightGold flex-shrink-0 border border-wbre-primaryGold/30">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-wbre-lightGold block">
                      General Secretarial Inquiries
                    </span>
                    <a href="mailto:info@wbore.com" className="text-sm text-white hover:underline">
                      info@wbore.com
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-wbre-surfaceDark/80 border border-wbre-primaryGold/20 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-wbre-royalNavy flex items-center justify-center text-wbre-lightGold flex-shrink-0 border border-wbre-primaryGold/30">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-wbre-lightGold block">
                      Adjudications Board
                    </span>
                    <a href="mailto:info@wbore.com" className="text-sm text-white hover:underline">
                      info@wbore.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Global Offices Section */}
        <GlobalOffices />
      </div>
      </>
  );
}
