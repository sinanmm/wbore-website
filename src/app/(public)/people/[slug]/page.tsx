import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RecordCard } from "@/components/records/RecordCard";
import { User, MapPin, Award, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const holder = await prisma.recordHolder.findUnique({
    where: { slug },
  });

  if (!holder) return { title: "Record Laureate Not Found | WBRE" };

  return {
    title: `${holder.name} | Verified Record Laureate | WBRE`,
    description: holder.bio || `Official WBRE profile of ${holder.name}`,
  };
}

export default async function PersonProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const holder = await prisma.recordHolder.findUnique({
    where: { slug },
    include: {
      records: {
        include: {
          category: true,
          holder: true,
          organization: true,
        },
        orderBy: { recordDate: "desc" },
      },
    },
  });

  if (!holder) {
    notFound();
  }

  return (
    <>
      <div className="flex-1 w-full pt-28 pb-20 bg-wbre-deepNavy">
        {/* Profile Hero */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-wbre-surfaceDarker via-wbre-deepNavy to-wbre-deepNavy border-b border-wbre-primaryGold/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/records"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-wbre-lightGold mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Registry</span>
            </Link>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {holder.photoUrl ? (
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-wbre-primaryGold shadow-gold-glow flex-shrink-0">
                  <Image
                    src={holder.photoUrl}
                    alt={holder.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-wbre-royalNavy ring-4 ring-wbre-primaryGold flex items-center justify-center text-wbre-lightGold flex-shrink-0">
                  <User className="w-16 h-16" />
                </div>
              )}

              <div className="space-y-3 text-center sm:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wbre-royalNavy/80 border border-wbre-primaryGold/30 text-[11px] font-semibold uppercase tracking-[0.2em] text-wbre-lightGold">
                  <Award className="w-3.5 h-3.5" />
                  AUTHENTICATED RECORD LAUREATE
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-tight">
                  {holder.name}
                </h1>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-wbre-primaryGold" />
                    <span>{holder.country}</span>
                  </div>
                  {holder.organization && (
                    <span className="text-slate-400">
                      Affiliation: {holder.organization}
                    </span>
                  )}
                </div>

                {holder.bio && (
                  <p className="text-sm text-slate-300 max-w-2xl leading-relaxed pt-2">
                    {holder.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Verified Records */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
              Verified Records ({holder.records.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {holder.records.map((rec) => (
              <RecordCard key={rec.id} record={rec} />
            ))}
          </div>
        </section>
      </div>
      </>
  );
}
