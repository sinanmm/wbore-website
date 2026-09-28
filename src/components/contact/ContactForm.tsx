"use client";

import React, { useState } from "react";
import { EnquiryTypes } from "@/lib/validations";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    organization: "",
    enquiryType: "General Enquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit enquiry.");
      }
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 rounded-2xl bg-wbre-surfaceDark border border-emerald-500/40 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
          Enquiry Received
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Your communication has been dispatched to the relevant WBRE jurisdictional office. An official response will follow within 2 business days.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              country: "",
              organization: "",
              enquiryType: "General Enquiry",
              message: "",
            });
          }}
          className="text-xs text-wbre-lightGold hover:underline uppercase tracking-wider"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-wbre-surfaceDark border border-wbre-primaryGold/30 shadow-premium-card space-y-5">
      <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider pb-2 border-b border-white/10">
        Official Enquiry Form
      </h3>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Official Correspondent"
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
            Official Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="correspondence@domain.org"
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+1 555 0192"
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
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

        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
            Organization / Entity (Optional)
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => updateField("organization", e.target.value)}
            placeholder="Institutional Name"
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
            Enquiry Classification *
          </label>
          <select
            value={formData.enquiryType}
            onChange={(e) => updateField("enquiryType", e.target.value)}
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
          >
            {EnquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
            Official Message / Dossier Query *
          </label>
          <textarea
            rows={4}
            value={formData.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="State the purpose of your enquiry, application reference if existing, or partnership proposal..."
            className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-wbre-deepNavy font-bold uppercase text-xs tracking-widest transition-all shadow-gold-subtle flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
        <span>{isSubmitting ? "TRANSMITTING..." : "TRANSMIT ENQUIRY"}</span>
      </button>
    </form>
  );
}
