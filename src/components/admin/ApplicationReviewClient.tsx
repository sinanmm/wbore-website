"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ApplicationStatuses } from "@/lib/validations";
import { ShieldCheck, Save, Send, AlertCircle, CheckCircle } from "lucide-react";

interface ApplicationReviewClientProps {
  applicationId: string;
  currentStatus: string;
  initialNotes: string;
  initialGuidelines: string;
}

export function ApplicationReviewClient({
  applicationId,
  currentStatus,
  initialNotes,
  initialGuidelines,
}: ApplicationReviewClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [internalNotes, setInternalNotes] = useState(initialNotes);
  const [guidelinesDocument, setGuidelinesDocument] = useState(initialGuidelines);
  const [decisionNote, setDecisionNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdate = async (newStatus?: string) => {
    setIsSaving(true);
    setMessage(null);

    const targetStatus = newStatus || status;

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          note: decisionNote || `Status updated to ${targetStatus}`,
          internalNotes,
          guidelinesDocument,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status");
      }

      setStatus(targetStatus);
      setDecisionNote("");
      setMessage({ type: "success", text: `Application successfully updated to ${targetStatus}.` });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to execute update." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-wbre-surfaceDark border border-wbre-primaryGold/30 space-y-5 shadow-gold-subtle">
      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
        <ShieldCheck className="w-5 h-5 text-wbre-primaryGold" />
        <h2 className="text-base font-serif font-bold text-white uppercase tracking-wider">
          Adjudication Controls
        </h2>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-200"
              : "bg-red-950/60 border border-red-500/40 text-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Status Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300">
          Change Adjudication Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs font-semibold uppercase focus:ring-1 focus:ring-wbre-primaryGold"
        >
          {ApplicationStatuses.map((st) => (
            <option key={st} value={st}>
              {st.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Decision Note / Reason */}
      <div className="space-y-1.5">
        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300">
          Decision Note (Logged in History)
        </label>
        <input
          type="text"
          value={decisionNote}
          onChange={(e) => setDecisionNote(e.target.value)}
          placeholder="e.g. Approved proposal; issuing official rule pack."
          className="w-full p-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
        />
      </div>

      {/* Internal Confidential Notes */}
      <div className="space-y-1.5">
        <label className="block text-xs uppercase tracking-wider font-semibold text-slate-300">
          Internal Adjudicator Notes (Confidential)
        </label>
        <textarea
          rows={3}
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="Internal notes regarding evidence viability, adjudicator assignment..."
          className="w-full p-2.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => handleUpdate()}
          className="w-full py-2.5 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider hover:bg-gold-gradient-hover shadow-gold-subtle flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>Save Status & Notes</span>
        </button>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleUpdate("APPROVED")}
            className="py-2 rounded-lg bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-500/40 text-emerald-200 font-semibold uppercase text-[11px] tracking-wider transition-colors disabled:opacity-50"
          >
            Quick Approve
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleUpdate("REJECTED")}
            className="py-2 rounded-lg bg-red-900/50 hover:bg-red-800/70 border border-red-500/40 text-red-200 font-semibold uppercase text-[11px] tracking-wider transition-colors disabled:opacity-50"
          >
            Quick Reject
          </button>
        </div>
      </div>
    </div>
  );
}
