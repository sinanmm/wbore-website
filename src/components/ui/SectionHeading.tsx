import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlightWord?: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  highlightWord,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignmentClass = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  // Helper to highlight word in title
  const renderTitle = () => {
    if (!highlightWord) return title;
    const parts = title.split(new RegExp(`(${highlightWord})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={i} className="gold-text-gradient font-serif">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={cn("flex flex-col max-w-3xl mb-12 sm:mb-16", alignmentClass, className)}>
      {eyebrow && (
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-[1px] bg-wbre-primaryGold" />
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-wbre-lightGold">
            {eyebrow}
          </span>
          <span className="w-6 h-[1px] bg-wbre-primaryGold" />
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight font-normal">
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
