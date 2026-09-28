import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND_ASSETS } from "./BrandAssets";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
  priority?: boolean;
}

const SIZE_MAP = {
  sm: { image: 44, heightClass: "h-[44px] w-[44px]", titleClass: "text-xs", subClass: "text-[8px]" },
  md: { image: 62, heightClass: "h-[56px] w-[56px] sm:h-[62px] sm:w-[62px]", titleClass: "text-sm sm:text-base lg:text-lg", subClass: "text-[9px] sm:text-[10px]" },
  lg: { image: 72, heightClass: "h-[64px] w-[64px] sm:h-[72px] sm:w-[72px]", titleClass: "text-base sm:text-lg", subClass: "text-[10px]" },
  xl: { image: 96, heightClass: "h-24 w-24", titleClass: "text-xl sm:text-2xl", subClass: "text-[10px]" },
};

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  className,
  priority = false,
}: LogoProps) {
  const config = SIZE_MAP[size];

  const content = (
    <div className={cn("flex items-center gap-3.5 group", className)}>
      <div className="relative flex items-center justify-center flex-shrink-0">
        <Image
          src={BRAND_ASSETS.logo.primary}
          alt={BRAND_ASSETS.logo.alt}
          width={config.image}
          height={config.image}
          className={cn(config.heightClass, "object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md")}
          priority={priority}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-serif font-semibold tracking-wider text-white uppercase group-hover:text-wbre-lightGold transition-colors leading-tight",
              config.titleClass
            )}
          >
            {BRAND_ASSETS.institutionName}
          </span>
          <span
            className={cn(
              "font-sans uppercase tracking-[0.25em] text-wbre-primaryGold font-medium",
              config.subClass
            )}
          >
            {BRAND_ASSETS.tagline}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
