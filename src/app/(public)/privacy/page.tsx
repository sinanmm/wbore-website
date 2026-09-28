import React from "react";

export const metadata = {
  title: "Privacy Policy | World Book of Record Excellence",
  description: "Official institutional data protection, evidence preservation, and privacy policy of WBRE.",
};

export default function PrivacyPage() {
  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        <section className="py-16 bg-gradient-to-b from-wbre-surfaceDarker to-wbre-deepNavy border-b border-wbre-primaryGold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-tight">
              INSTITUTIONAL PRIVACY POLICY
            </h1>
            <p className="mt-3 text-xs uppercase tracking-widest text-wbre-lightGold">
              Effective Date: January 1, 2026 • World Book of Record Excellence
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
              1. Information Collection & Record Archival
            </h2>
            <p>
              World Book of Record Excellence (WBRE) collects applicant, witness, and adjudicator information exclusively for the purpose of verifying, certifying, and cataloging official world and national record achievements.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
              2. Evidence Dossier Security
            </h2>
            <p>
              Telemetry streams, video documentation, surveyor blueprints, and witness affidavits submitted during adjudication are preserved in encrypted digital vaults with strict multi-layer access protocols.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
              3. Public Record Transparency
            </h2>
            <p>
              Upon official ratification of a record title, the record holder's name, verified metric, date, location, and non-confidential photographic documentation will be published to the public international registry.
            </p>
          </div>
        </section>
      </div>
      </>
  );
}
