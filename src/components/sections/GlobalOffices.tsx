import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OfficeService } from "@/features/offices/services/office.service";
import { Mail, Phone, Building } from "lucide-react";

export async function GlobalOffices() {
  const offices = await OfficeService.getOffices();

  return (
    <section className="py-20 sm:py-28 bg-wbre-surfaceDarker relative overflow-hidden">
      {/* Background World Map Graphic Details */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="GLOBAL PRESENCE"
          title="INTERNATIONAL ADJUDICATION OFFICES"
          subtitle="Operating through key global jurisdictional hubs to provide seamless record coordination and on-site adjudication."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {offices.map((office) => (
            <div
              key={office.id || office.name}
              className="group p-8 rounded-2xl bg-wbre-surfaceDark/70 hover:bg-wbre-surfaceDark border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/60 transition-all duration-300 shadow-premium-card hover:shadow-gold-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-wbre-lightGold bg-wbre-royalNavy/80 px-3 py-1 rounded-full border border-wbre-primaryGold/30">
                    {office.country}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-wbre-royalNavy flex items-center justify-center border border-wbre-primaryGold/30 text-wbre-primaryGold">
                    <Building className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider mb-4 group-hover:text-wbre-lightGold transition-colors">
                  {office.name}
                </h3>

                <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-white">World Book of Record Excellence</p>
                  <p>{office.building}</p>
                  <p>{office.street}</p>
                  {office.area && <p>{office.area}</p>}
                  {office.postalCode && <p>{office.postalCode}</p>}
                  <p className="font-medium text-wbre-lightGold">{office.country}</p>
                </div>
              </div>

              {/* Office Contact Info */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-2 text-xs text-slate-300">
                {office.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0" />
                    <a href={`mailto:${office.email}`} className="hover:text-white transition-colors">
                      {office.email}
                    </a>
                  </div>
                )}
                {office.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-3.5 h-3.5 text-wbre-primaryGold flex-shrink-0" />
                    <a href={`tel:${office.phone}`} className="hover:text-white transition-colors">
                      {office.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GlobalOffices;
