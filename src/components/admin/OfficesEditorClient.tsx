"use client";

import React, { useState } from "react";
import { Building, Save, CheckCircle, AlertCircle } from "lucide-react";

interface OfficesEditorClientProps {
  offices: any[];
}

export function OfficesEditorClient({ offices: initialOffices }: OfficesEditorClientProps) {
  const [offices, setOffices] = useState(initialOffices);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ id: string; type: "success" | "error"; text: string } | null>(null);

  const handleFieldChange = (id: string, field: string, value: string) => {
    setOffices((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const handleSave = async (office: any) => {
    setSavingId(office.id);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/offices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(office),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save office updates.");
      }

      setMessage({ id: office.id, type: "success", text: "Address details updated successfully." });
    } catch (err: any) {
      setMessage({ id: office.id, type: "error", text: err.message || "Update error." });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {offices.map((office) => (
        <div
          key={office.id}
          className="p-6 rounded-2xl bg-wbre-surfaceDark border border-wbre-primaryGold/30 shadow-premium-card space-y-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-wbre-lightGold block">
                {office.country}
              </span>
              <h3 className="text-base font-serif font-bold text-white uppercase">
                {office.name}
              </h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-wbre-royalNavy flex items-center justify-center text-wbre-lightGold">
              <Building className="w-4 h-4" />
            </div>
          </div>

          {message && message.id === office.id && (
            <div
              className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                  : "bg-red-950/60 text-red-300 border border-red-500/40"
              }`}
            >
              {message.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Building / Suite</label>
              <input
                type="text"
                value={office.building}
                onChange={(e) => handleFieldChange(office.id, "building", e.target.value)}
                className="w-full p-2.5 rounded bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Street Address</label>
              <input
                type="text"
                value={office.street}
                onChange={(e) => handleFieldChange(office.id, "street", e.target.value)}
                className="w-full p-2.5 rounded bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Area / District</label>
              <input
                type="text"
                value={office.area || ""}
                onChange={(e) => handleFieldChange(office.id, "area", e.target.value)}
                className="w-full p-2.5 rounded bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Postal Code</label>
              <input
                type="text"
                value={office.postalCode || ""}
                onChange={(e) => handleFieldChange(office.id, "postalCode", e.target.value)}
                className="w-full p-2.5 rounded bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Contact Email</label>
              <input
                type="email"
                value={office.email || ""}
                onChange={(e) => handleFieldChange(office.id, "email", e.target.value)}
                className="w-full p-2.5 rounded bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={office.phone || ""}
                onChange={(e) => handleFieldChange(office.id, "phone", e.target.value)}
                className="w-full p-2.5 rounded bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={savingId === office.id}
            onClick={() => handleSave(office)}
            className="w-full py-2.5 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider hover:bg-gold-gradient-hover shadow-gold-subtle flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingId === office.id ? "SAVING..." : "SAVE ADDRESS CHANGES"}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
