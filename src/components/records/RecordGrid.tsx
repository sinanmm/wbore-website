import React from "react";
import { RecordCard, RecordCardProps } from "./RecordCard";
import { cn } from "@/lib/utils";

interface RecordGridProps {
  records: RecordCardProps["record"][];
  emptyMessage?: string;
  className?: string;
}

export function RecordGrid({
  records,
  emptyMessage = "No records found matching your criteria.",
  className,
}: RecordGridProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-wbre-surfaceDark/50 rounded-2xl border border-white/5">
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
        className
      )}
    >
      {records.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}

export default RecordGrid;
