"use client";

import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#060d1a] text-white flex flex-col justify-between m-0 font-sans antialiased">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="p-8 sm:p-10 rounded-2xl bg-[#0b172a] border border-red-500/40 text-center max-w-md mx-auto space-y-4 shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-2xl font-serif font-bold uppercase text-white tracking-wide">
              Adjudication System Alert
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              A critical system error occurred during request processing. Our technical adjudications team has been notified.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#060d1a] font-bold uppercase text-xs tracking-wider shadow-lg transition-transform active:scale-95"
              >
                Retry Operation
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
