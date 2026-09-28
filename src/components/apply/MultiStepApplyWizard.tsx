"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ApplicantTypes,
  AttemptTypes,
  ApplicationFormData,
} from "@/lib/validations";
import { WBRE_CONFIG } from "@/lib/config";
import {
  User,
  FileText,
  Calendar,
  ShieldCheck,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

const EVIDENCE_OPTIONS = [
  "Full Continuous Video (Multi-angle)",
  "High-Resolution Photographic Evidence",
  "Sworn Independent Witness Affidavits",
  "Official Timekeepers / Chronometer Logs",
  "Technical Measurement / Calibration Certificates",
  "Government / Official Jurisdictional Documents",
  "Accredited Media Coverage & Broadcast",
  "Surveyor Topographical / Geolocation Logs",
  "Biometric / Telemetry Data Streams",
];

export function MultiStepApplyWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    applicantType: "Individual",
    applicantName: "",
    organizationName: "",
    email: "",
    phone: "",
    country: "",
    stateRegion: "",
    city: "",
    // Step 2
    proposedTitle: "",
    categoryName: WBRE_CONFIG.categories[0].name,
    description: "",
    measuredMetric: "",
    knownBenchmark: "",
    significance: "",
    // Step 3
    proposedDate: "",
    location: "",
    expectedParticipants: 1,
    attemptType: "Individual",
    // Step 4
    evidencePlan: [] as string[],
    additionalNotes: "",
    // Step 5
    acceptTerms: false,
    acceptGuidelines: false,
    confirmAccuracy: false,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEvidence = (option: string) => {
    setFormData((prev) => {
      const exists = prev.evidencePlan.includes(option);
      return {
        ...prev,
        evidencePlan: exists
          ? prev.evidencePlan.filter((e) => e !== option)
          : [...prev.evidencePlan, option],
      };
    });
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!formData.applicantName.trim()) {
        setErrorMsg("Please enter applicant / lead organizer name.");
        return false;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMsg("Please provide a valid official email address.");
        return false;
      }
      if (!formData.phone.trim()) {
        setErrorMsg("Please provide a contact phone number.");
        return false;
      }
      if (!formData.country.trim() || !formData.city.trim()) {
        setErrorMsg("Please specify country and city.");
        return false;
      }
    }

    if (step === 2) {
      if (formData.proposedTitle.trim().length < 5) {
        setErrorMsg("Proposed record title must be at least 5 characters.");
        return false;
      }
      if (formData.description.trim().length < 20) {
        setErrorMsg("Please describe the achievement in at least 20 characters.");
        return false;
      }
      if (formData.measuredMetric.trim().length < 3) {
        setErrorMsg("Please define what exact metric will be measured.");
        return false;
      }
      if (formData.significance.trim().length < 10) {
        setErrorMsg("Please explain why this achievement is significant.");
        return false;
      }
    }

    if (step === 3) {
      if (formData.location.trim().length < 3) {
        setErrorMsg("Please specify the exact location / venue.");
        return false;
      }
    }

    if (step === 4) {
      if (formData.evidencePlan.length === 0) {
        setErrorMsg("Please select at least one planned evidence method.");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms || !formData.acceptGuidelines || !formData.confirmAccuracy) {
      setErrorMsg("You must check all declaration checkboxes before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Submission failed. Please check your information.");
      }

      setSubmittedAppId(data.applicationNumber);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAppId = () => {
    if (submittedAppId) {
      navigator.clipboard.writeText(submittedAppId);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedAppId) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-wbre-surfaceDark via-wbre-royalNavy/90 to-wbre-deepNavy border-2 border-wbre-primaryGold/50 shadow-gold-glow text-center max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-gold-subtle">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-wbre-lightGold">
            SUBMISSION CONFIRMED
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white uppercase tracking-tight">
            APPLICATION LOGGED INTO OFFICIAL REGISTRY
          </h2>
        </div>

        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          Your record application has been assigned a unique international dossier reference. An official confirmation email with guidelines will be dispatched shortly.
        </p>

        {/* Application ID Box */}
        <div className="p-6 rounded-2xl bg-wbre-deepNavy border border-wbre-primaryGold/40 max-w-md mx-auto space-y-3">
          <span className="text-xs text-slate-400 uppercase tracking-widest block">
            Official Application Reference Number
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-xl sm:text-2xl font-bold text-wbre-lightGold">
              {submittedAppId}
            </span>
            <button
              onClick={copyAppId}
              className="p-2 rounded bg-wbre-royalNavy hover:bg-wbre-royalNavy/80 text-wbre-lightGold transition-colors"
              title="Copy Reference Number"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Please preserve this identifier to track your review status.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href={`/application-status?id=${encodeURIComponent(submittedAppId)}&email=${encodeURIComponent(formData.email)}`} variant="gold" size="md">
            Track Application Status
          </Button>
          <Button href="/" variant="outline-gold" size="md">
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  // WIZARD STEPS
  const steps = [
    { num: 1, title: "Applicant", icon: User },
    { num: 2, title: "Proposal", icon: FileText },
    { num: 3, title: "Attempt", icon: Calendar },
    { num: 4, title: "Evidence", icon: ShieldCheck },
    { num: 5, title: "Declaration", icon: CheckSquare },
  ];

  return (
    <div className="rounded-3xl bg-wbre-surfaceDark/90 border border-wbre-primaryGold/30 p-6 sm:p-10 shadow-gold-subtle max-w-4xl mx-auto">
      {/* Progress Bar & Step Indicators */}
      <div className="mb-10">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-4">
          {steps.map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className={`flex flex-col items-center text-center transition-all ${
                  isCurrent
                    ? "text-wbre-lightGold font-bold"
                    : isDone
                    ? "text-slate-300"
                    : "text-slate-600"
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                    isCurrent
                      ? "bg-gold-gradient text-wbre-deepNavy ring-4 ring-wbre-primaryGold/20 shadow-gold-subtle"
                      : isDone
                      ? "bg-wbre-royalNavy text-wbre-lightGold border border-wbre-primaryGold/40"
                      : "bg-wbre-deepNavy text-slate-500 border border-slate-700"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider hidden sm:block">
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="w-full h-1.5 bg-wbre-deepNavy rounded-full overflow-hidden">
          <div
            className="h-full bg-gold-gradient transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-red-200 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Applicant Information */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
              STEP 1 OF 5
            </span>
            <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wide mt-1">
              Applicant & Entity Information
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Provide identity details of the individual or authorized institutional representative.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Applicant Type *
              </label>
              <select
                value={formData.applicantType}
                onChange={(e) => updateField("applicantType", e.target.value)}
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
              >
                {ApplicantTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Full Name of Applicant / Lead *
              </label>
              <input
                type="text"
                value={formData.applicantName}
                onChange={(e) => updateField("applicantName", e.target.value)}
                placeholder="e.g. Dr. Arthur Pendelton"
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Organization / Institution (Optional)
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
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Official Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="official@institution.org"
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Phone Number with Country Code *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Country *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="United Kingdom"
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                State / Region (Optional)
              </label>
              <input
                type="text"
                value={formData.stateRegion}
                onChange={(e) => updateField("stateRegion", e.target.value)}
                placeholder="Cambridgeshire"
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Cambridge"
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Record Proposal */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
              STEP 2 OF 5
            </span>
            <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wide mt-1">
              Proposed Record Concept
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Clearly define the proposed milestone, objective metrics, and significance.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Proposed Record Title *
              </label>
              <input
                type="text"
                value={formData.proposedTitle}
                onChange={(e) => updateField("proposedTitle", e.target.value)}
                placeholder="e.g. Longest Continuous Autonomous High-Altitude Solar Flight"
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Category *
              </label>
              <select
                value={formData.categoryName}
                onChange={(e) => updateField("categoryName", e.target.value)}
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
              >
                {WBRE_CONFIG.categories.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Describe the Achievement in Detail *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Explain the background, methodology, setup, and conditions of the record attempt..."
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  What Exactly Will Be Measured? *
                </label>
                <input
                  type="text"
                  value={formData.measuredMetric}
                  onChange={(e) => updateField("measuredMetric", e.target.value)}
                  placeholder="e.g. Total hours of unassisted flight, altitude, GPS distance"
                  className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  Current Known Benchmark (If known)
                </label>
                <input
                  type="text"
                  value={formData.knownBenchmark}
                  onChange={(e) => updateField("knownBenchmark", e.target.value)}
                  placeholder="e.g. Previous unofficial lab mark: 260 hours"
                  className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Why is this Achievement Significant? *
              </label>
              <textarea
                rows={3}
                value={formData.significance}
                onChange={(e) => updateField("significance", e.target.value)}
                placeholder="Explain the scientific, athletic, cultural or community impact of this accomplishment..."
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Attempt Information */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
              STEP 3 OF 5
            </span>
            <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wide mt-1">
              Attempt Logistics & Scope
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Details concerning the venue, expected date, and participants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Proposed Date of Attempt
              </label>
              <input
                type="date"
                value={formData.proposedDate}
                onChange={(e) => updateField("proposedDate", e.target.value)}
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Attempt Classification *
              </label>
              <select
                value={formData.attemptType}
                onChange={(e) => updateField("attemptType", e.target.value)}
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
              >
                {AttemptTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Venue & Exact Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. Al Ain Aerospace Testing Complex, Abu Dhabi, UAE"
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                Expected Number of Participants
              </label>
              <input
                type="number"
                min={1}
                value={formData.expectedParticipants}
                onChange={(e) => updateField("expectedParticipants", parseInt(e.target.value) || 1)}
                className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs focus:ring-1 focus:ring-wbre-primaryGold"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Evidence Plan */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
              STEP 4 OF 5
            </span>
            <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wide mt-1">
              Evidence Collection Plan
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Select all evidence streams you commit to capturing and submitting for adjudication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EVIDENCE_OPTIONS.map((opt) => {
              const isSelected = formData.evidencePlan.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => toggleEvidence(opt)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? "bg-wbre-primaryGold/15 border-wbre-primaryGold text-white"
                      : "bg-wbre-deepNavy/60 border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                      isSelected
                        ? "bg-wbre-primaryGold border-wbre-primaryGold text-wbre-deepNavy"
                        : "border-slate-600"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
              Additional Evidence Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={formData.additionalNotes}
              onChange={(e) => updateField("additionalNotes", e.target.value)}
              placeholder="Specify calibrated equipment models, independent expert credentials, etc."
              className="w-full p-3 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/25 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-wbre-primaryGold"
            />
          </div>
        </div>
      )}

      {/* STEP 5: Declaration & Submission */}
      {currentStep === 5 && (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-wbre-lightGold block">
              STEP 5 OF 5
            </span>
            <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wide mt-1">
              Institutional Declaration
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Review and confirm the formal terms of WBRE adjudication and registration.
            </p>
          </div>

          {/* Proposal Summary Box */}
          <div className="p-4 rounded-xl bg-wbre-deepNavy border border-wbre-primaryGold/25 space-y-2 text-xs">
            <p className="text-slate-300">
              <span className="text-slate-400 font-semibold">Applicant:</span> {formData.applicantName} ({formData.country})
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400 font-semibold">Proposed Title:</span> {formData.proposedTitle}
            </p>
            <p className="text-slate-300">
              <span className="text-slate-400 font-semibold">Category:</span> {formData.categoryName}
            </p>
          </div>

          {/* Declarations Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 p-3 rounded-lg bg-wbre-deepNavy/70 border border-wbre-primaryGold/20 cursor-pointer hover:bg-wbre-deepNavy">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => updateField("acceptTerms", e.target.checked)}
                className="mt-0.5 rounded border-wbre-primaryGold text-wbre-primaryGold focus:ring-wbre-primaryGold"
                required
              />
              <span className="text-xs text-slate-200 leading-relaxed">
                I understand that submitting an application does not guarantee automatic record approval and that all achievements must pass rigorous evidence review.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-wbre-deepNavy/70 border border-wbre-primaryGold/20 cursor-pointer hover:bg-wbre-deepNavy">
              <input
                type="checkbox"
                checked={formData.acceptGuidelines}
                onChange={(e) => updateField("acceptGuidelines", e.target.checked)}
                className="mt-0.5 rounded border-wbre-primaryGold text-wbre-primaryGold focus:ring-wbre-primaryGold"
                required
              />
              <span className="text-xs text-slate-200 leading-relaxed">
                I agree to adhere strictly to all official WBRE measurement criteria, safety regulations, and ethical guidelines.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-wbre-deepNavy/70 border border-wbre-primaryGold/20 cursor-pointer hover:bg-wbre-deepNavy">
              <input
                type="checkbox"
                checked={formData.confirmAccuracy}
                onChange={(e) => updateField("confirmAccuracy", e.target.checked)}
                className="mt-0.5 rounded border-wbre-primaryGold text-wbre-primaryGold focus:ring-wbre-primaryGold"
                required
              />
              <span className="text-xs text-slate-200 leading-relaxed">
                I formally confirm that all submitted information and future evidence documents are truthful, unmanipulated, and legally compliant.
              </span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-wbre-deepNavy font-bold uppercase text-xs sm:text-sm tracking-widest transition-all shadow-gold-subtle flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isSubmitting ? "PROCESSING DOSSIER..." : "SUBMIT RECORD APPLICATION"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 5 && (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold uppercase text-xs tracking-wider hover:bg-gold-gradient-hover transition-all"
          >
            <span>Proceed to Step {currentStep + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
