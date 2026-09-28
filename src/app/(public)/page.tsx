import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { PurposeSection } from "@/components/sections/PurposeSection";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FeaturedRecords } from "@/components/sections/FeaturedRecords";
import { GlobalOffices } from "@/components/sections/GlobalOffices";
import { CtaSection } from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PurposeSection />
      <CategoryGrid />
      <ProcessSection />
      <FeaturedRecords />
      <GlobalOffices />
      <CtaSection />
    </>
  );
}
