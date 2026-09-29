"use client";

import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application segment error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-wbre-deepNavy text-white flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="p-8 sm:p-10 rounded-2xl bg-wbre-surfaceDark border border-red-500/40 text-center max-w-md mx-auto space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl font-serif font-bold uppercase">
            Adjudication System Alert
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            An unexpected error occurred during request processing. Our technical team has been notified.
          </p>
          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider"
            >
              Retry Operation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
