import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { RecordService } from "@/features/records/services/record.service";
import { FeaturedRecordsShowcase } from "./FeaturedRecordsShowcase";

export async function FeaturedRecords() {
  let records: any[] = [];
  try {
    records = await RecordService.getFeaturedRecords(10);
  } catch (error) {
    console.error("Failed to load featured records:", error);
  }

  return (
    <section className="py-20 sm:py-28 bg-wbre-deepNavy relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="OFFICIAL REGISTRY ARCHIVES"
            title="FEATURED RECORD EXCELLENCE"
            subtitle="Explore officially ratified world benchmarks and decorated laureates evaluated and preserved under permanent WBRE protocols."
            align="left"
            className="mb-0 max-w-2xl"
          />

          <Button href="/records" variant="outline-gold" size="md" className="self-start md:self-end">
            <span>Explore Full Registry</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        {records.length > 0 ? (
          <FeaturedRecordsShowcase records={records} />
        ) : (
          <div className="text-center py-16 px-4 bg-wbre-surfaceDark/50 rounded-2xl border border-wbre-primaryGold/20 max-w-xl mx-auto">
            <p className="text-slate-300 text-sm">
              Records are currently being adjudicated. Visit the full registry directory to explore certified archives.
            </p>
            <div className="mt-6">
              <Button href="/records" variant="gold" size="sm">
                View All Records
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedRecords;
