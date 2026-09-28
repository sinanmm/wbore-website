"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Save, ShieldCheck, AlertCircle } from "lucide-react";
import { RecordStatuses } from "@/lib/validations";

interface RecordFormClientProps {
  categories: Array<{ id: string; name: string }>;
  initialData?: any;
  isEdit?: boolean;
}

export function RecordFormClient({
  categories,
  initialData,
  isEdit = false,
}: RecordFormClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    holderName: initialData?.holder?.name || "",
    organizationName: initialData?.organization?.name || "",
    country: initialData?.country || "",
    location: initialData?.location || "",
    resultValue: initialData?.resultValue || "",
    measurementUnit: initialData?.measurementUnit || "",
    recordDate: initialData?.recordDate
      ? new Date(initialData.recordDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    verificationDate: initialData?.verificationDate
      ? new Date(initialData.verificationDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    status: initialData?.status || "ACTIVE",
    isDemo: initialData?.isDemo !== undefined ? initialData.isDemo : false,
    isFeatured: initialData?.isFeatured !== undefined ? initialData.isFeatured : true,
    evidenceSummary: initialData?.evidenceSummary || "",
    verificationMethod: initialData?.verificationMethod || "",
    witnessInfo: initialData?.witnessInfo || "",
    adjudicatorInfo: initialData?.adjudicatorInfo || "",
    featuredImage: initialData?.featuredImage || "",
    videoUrl: initialData?.videoUrl || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const url = isEdit
        ? `/api/admin/records/${initialData.id}`
        : "/api/admin/records";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save record.");
      }

      router.push("/admin/records");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-wbre-surfaceDark border border-wbre-primaryGold/30 shadow-premium-card space-y-6">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
          Record Identification & Classification
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
            Official Record Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Longest Continuous Autonomous High-Altitude Solar Flight"
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
            >
              {RecordStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Demo Record Flag
            </label>
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isDemo}
                  onChange={(e) => updateField("isDemo", e.target.checked)}
                  className="rounded border-wbre-primaryGold text-wbre-primaryGold focus:ring-wbre-primaryGold"
                />
                <span>Label as DEMO RECORD</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                  className="rounded border-wbre-primaryGold text-wbre-primaryGold focus:ring-wbre-primaryGold"
                />
                <span>Feature on Home</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Metric & Recipient */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
          Ratified Metric & Laureate Attribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Ratified Value / Benchmark *
            </label>
            <input
              type="text"
              value={formData.resultValue}
              onChange={(e) => updateField("resultValue", e.target.value)}
              placeholder="e.g. 336.5 Hours or 264,120 Trees"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Measurement Metric Unit *
            </label>
            <input
              type="text"
              value={formData.measurementUnit}
              onChange={(e) => updateField("measurementUnit", e.target.value)}
              placeholder="e.g. Hours of continuous flight"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Record Holder Name (Individual)
            </label>
            <input
              type="text"
              value={formData.holderName}
              onChange={(e) => updateField("holderName", e.target.value)}
              placeholder="e.g. Dr. Aaron Vance"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Organization / Institutional Recipient
            </label>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => updateField("organizationName", e.target.value)}
              placeholder="e.g. Cambridge Robotics Lab"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Country *
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => updateField("country", e.target.value)}
              placeholder="United Arab Emirates"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Venue / Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="Al Ain Aerospace Testing Facility"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Record Date *
            </label>
            <input
              type="date"
              value={formData.recordDate}
              onChange={(e) => updateField("recordDate", e.target.value)}
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Ratification Date *
            </label>
            <input
              type="date"
              value={formData.verificationDate}
              onChange={(e) => updateField("verificationDate", e.target.value)}
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
              required
            />
          </div>
        </div>
      </div>

      {/* Dossier Descriptions & Evidence */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
          Official Dossier & Evidence Details
        </h3>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
            Short Summary *
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => updateField("shortDescription", e.target.value)}
            placeholder="One-line summary for cards and search"
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
            Full Archival Record Dossier *
          </label>
          <textarea
            rows={4}
            value={formData.fullDescription}
            onChange={(e) => updateField("fullDescription", e.target.value)}
            placeholder="Comprehensive description of the attempt, conditions, and significance..."
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Evidence Summary
            </label>
            <input
              type="text"
              value={formData.evidenceSummary}
              onChange={(e) => updateField("evidenceSummary", e.target.value)}
              placeholder="e.g. Telemetry logs, GPS logs, 3 independent affidavits"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Verification Methodology
            </label>
            <input
              type="text"
              value={formData.verificationMethod}
              onChange={(e) => updateField("verificationMethod", e.target.value)}
              placeholder="e.g. Calibrated Telemetry & Optical Adjudication"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Official Adjudicator / Division
            </label>
            <input
              type="text"
              value={formData.adjudicatorInfo}
              onChange={(e) => updateField("adjudicatorInfo", e.target.value)}
              placeholder="e.g. Chief Adjudicator Dr. E. Sterling"
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300 mb-1">
              Featured Image URL
            </label>
            <input
              type="text"
              value={formData.featuredImage}
              onChange={(e) => updateField("featuredImage", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-wbre-deepNavy font-bold uppercase text-xs tracking-widest transition-all shadow-gold-subtle flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{isSubmitting ? "SAVING RECORD..." : isEdit ? "UPDATE RECORD ARCHIVE" : "CERTIFY & PUBLISH RECORD"}</span>
      </button>
    </form>
  );
}
