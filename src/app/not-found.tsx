import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Award, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex items-center justify-center pt-28 pb-20 bg-wbre-deepNavy px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-wbre-surfaceDark border-2 border-wbre-primaryGold/40 text-center max-w-xl mx-auto space-y-6 shadow-gold-subtle">
          <div className="w-16 h-16 rounded-full bg-wbre-deepNavy border border-wbre-primaryGold/50 mx-auto flex items-center justify-center text-wbre-primaryGold">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-wbre-lightGold block">
              404 • REGISTRY IDENTIFIER NOT FOUND
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white uppercase mt-2">
              Page or Record Not Found
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The requested page or record archive could not be located in the World Book of Record Excellence official register.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button href="/records" variant="gold" size="md">
              <Search className="w-4 h-4 mr-2" />
              <span>Search Official Registry</span>
            </Button>
            <Button href="/" variant="outline-gold" size="md">
              <span>Return to Homepage</span>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
