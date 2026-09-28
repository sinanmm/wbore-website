import React from "react";

export const metadata = {
  title: "Terms & Conditions | World Book of Record Excellence",
  description: "Official legal terms and conditions governing record submissions, verification, and certification.",
};

export default function TermsPage() {
  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        <section className="py-16 bg-gradient-to-b from-wbre-surfaceDarker to-wbre-deepNavy border-b border-wbre-primaryGold/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-serif text-white uppercase tracking-tight">
              TERMS & CONDITIONS OF ADJUDICATION
            </h1>
            <p className="mt-3 text-xs uppercase tracking-widest text-wbre-lightGold">
              World Book of Record Excellence International Secretariat
            </p>
          </div>
        </section>

        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
              1. Authority of Adjudication Board
            </h2>
            <p>
              The World Book of Record Excellence Adjudication Board retains sole and final authority over the ratification, classification, suspension, revocation, or archiving of all record titles.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
              2. Revocation Policy
            </h2>
            <p>
              Any record subsequently proven to have involved data falsification, unauthorized assistance, safety violations, or post-attempt regulatory breaches will be permanently revoked from the active registry.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-wbre-surfaceDark/70 border border-wbre-primaryGold/20 space-y-4">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
              3. Trademark & Certificate Rights
            </h2>
            <p>
              The WBRE seal, name, and certificate emblems are registered international trademarks. Unofficial duplication or unauthorized commercial exploitation is strictly prohibited under international copyright conventions.
            </p>
          </div>
        </section>
      </div>
      </>
  );
}
