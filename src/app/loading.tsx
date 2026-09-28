import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-wbre-deepNavy text-white">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-wbre-primaryGold/20 border-t-wbre-primaryGold animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-wbre-royalNavy" />
      </div>
      <span className="mt-4 text-xs font-mono tracking-widest text-wbre-lightGold uppercase">
        Loading Dossier...
      </span>
    </div>
  );
}
