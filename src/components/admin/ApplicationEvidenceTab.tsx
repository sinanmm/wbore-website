"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Video,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Upload,
  X,
  FileCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  EVIDENCE_CATEGORIES,
  LABEL_TO_CODE,
  formatBytes,
  getFileGroup,
} from "@/lib/evidence";

export interface EvidenceItem {
  id: string;
  applicationId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  storageProvider: string;
  evidenceCategory: string;
  uploadedBy: string;
  status: string; // PENDING, APPROVED, REJECTED
  rejectionReason?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EvidenceTypeItem {
  id: string;
  applicationId: string;
  type: string;
  createdAt: Date | string;
}

interface ApplicationEvidenceTabProps {
  applicationId: string;
  applicationNumber: string;
  initialEvidences: EvidenceItem[];
  evidenceTypes: EvidenceTypeItem[];
  declaredEvidencePlan: string[];
}

export function ApplicationEvidenceTab({
  applicationId,
  applicationNumber,
  initialEvidences,
  evidenceTypes,
  declaredEvidencePlan,
}: ApplicationEvidenceTabProps) {
  const [evidences, setEvidences] = useState<EvidenceItem[]>(initialEvidences);
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rejectingItem, setRejectingItem] = useState<EvidenceItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Map declared requirements to codes
  const declaredCodes = declaredEvidencePlan.map(
    (label) => LABEL_TO_CODE[label] || label
  );

  const handleStatusUpdate = async (
    evidenceId: string,
    status: "APPROVED" | "REJECTED",
    reason?: string
  ) => {
    setUpdatingId(evidenceId);
    try {
      const res = await fetch(`/api/evidence/${encodeURIComponent(evidenceId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update evidence status.");
      }

      setEvidences((prev) =>
        prev.map((e) => (e.id === evidenceId ? data.evidence : e))
      );

      if (rejectingItem?.id === evidenceId) {
        setRejectingItem(null);
        setRejectionReason("");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update evidence status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getFileIcon = (fileName: string) => {
    const group = getFileGroup(fileName);
    if (group === "video") return <Video className="w-5 h-5 text-amber-400" />;
    if (group === "image") return <Eye className="w-5 h-5 text-sky-400" />;
    return <FileText className="w-5 h-5 text-wbre-primaryGold" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* SECTION 1: Selected Evidence Requirements */}
      <div className="p-6 rounded-2xl bg-wbre-surfaceDark/90 border border-wbre-primaryGold/25 shadow-premium-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-wbre-primaryGold" />
            <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider">
              Declared Evidence Requirements Matrix
            </h3>
          </div>
          <span className="text-xs font-mono text-wbre-lightGold bg-wbre-royalNavy px-2.5 py-1 rounded border border-wbre-primaryGold/30">
            {declaredEvidencePlan.length} Required Streams
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {declaredEvidencePlan.map((reqLabel) => {
            const reqCode = LABEL_TO_CODE[reqLabel] || reqLabel;
            const matchingFiles = evidences.filter(
              (f) =>
                f.evidenceCategory === reqCode ||
                f.evidenceCategory === reqLabel ||
                (reqCode === "VIDEO" && getFileGroup(f.fileName) === "video")
            );
            const isUploaded = matchingFiles.length > 0;

            return (
              <div
                key={reqLabel}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                  isUploaded
                    ? "bg-emerald-950/20 border-emerald-500/40 text-slate-200"
                    : "bg-wbre-deepNavy/70 border-slate-700/80 text-slate-300"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block">
                    REQUIREMENT
                  </span>
                  <h4 className="text-xs font-semibold text-white leading-snug">
                    {reqLabel}
                  </h4>
                  {isUploaded && (
                    <span className="text-[11px] text-emerald-400 font-mono block">
                      {matchingFiles.length} file(s) submitted
                    </span>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {isUploaded ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/50">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>UPLOADED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/40">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>PENDING</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Uploaded Evidence Files List */}
      <div className="p-6 rounded-2xl bg-wbre-surfaceDark/90 border border-wbre-primaryGold/25 shadow-premium-card space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="space-y-0.5">
            <h3 className="text-base font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-wbre-primaryGold" />
              <span>Uploaded Evidence Dossier Manifest</span>
            </h3>
            <p className="text-xs text-slate-300">
              Technical artifacts submitted for forensic review and verification.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-300 bg-wbre-deepNavy px-3 py-1.5 rounded-lg border border-wbre-primaryGold/30">
            Total Files: <strong className="text-wbre-lightGold">{evidences.length}</strong>
          </span>
        </div>

        {evidences.length > 0 ? (
          <div className="space-y-3">
            {evidences.map((ev) => {
              const categoryInfo =
                EVIDENCE_CATEGORIES[ev.evidenceCategory] || {
                  label: ev.evidenceCategory,
                };

              return (
                <div
                  key={ev.id}
                  className="p-4 sm:p-5 rounded-xl bg-wbre-deepNavy/80 border border-wbre-primaryGold/20 hover:border-wbre-primaryGold/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* File & Category Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-wbre-royalNavy border border-wbre-primaryGold/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      {getFileIcon(ev.originalName)}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white truncate max-w-sm sm:max-w-md">
                          {ev.originalName}
                        </span>

                        {/* Status Badge */}
                        {ev.status === "APPROVED" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                            Approved ✓
                          </span>
                        )}
                        {ev.status === "REJECTED" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-400/40">
                            Rejected ✗
                          </span>
                        )}
                        {ev.status === "PENDING" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40">
                            Pending Review
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span className="font-mono text-slate-300 font-medium">
                          {formatBytes(ev.fileSize)}
                        </span>
                        <span>•</span>
                        <span className="text-wbre-lightGold font-medium">
                          {categoryInfo.label}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">
                          Uploaded: {new Date(ev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {ev.rejectionReason && (
                        <p className="text-xs text-red-300/90 italic pt-1">
                          Rejection note: {ev.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewItem(ev)}
                      className="px-3 py-1.5 rounded-lg bg-wbre-royalNavy hover:bg-white/10 border border-wbre-primaryGold/30 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-wbre-lightGold" />
                      <span>Preview</span>
                    </button>

                    {/* Download Button */}
                    <a
                      href={ev.fileUrl}
                      download={ev.originalName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-wbre-royalNavy hover:bg-white/10 border border-wbre-primaryGold/30 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-wbre-lightGold" />
                      <span>Download</span>
                    </a>

                    {/* Approve Button */}
                    {ev.status !== "APPROVED" && (
                      <button
                        type="button"
                        disabled={updatingId === ev.id}
                        onClick={() => handleStatusUpdate(ev.id, "APPROVED")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-sm disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Evidence</span>
                      </button>
                    )}

                    {/* Reject Button */}
                    {ev.status !== "REJECTED" && (
                      <button
                        type="button"
                        disabled={updatingId === ev.id}
                        onClick={() => setRejectingItem(ev)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Evidence</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-xl bg-wbre-deepNavy/50 border border-wbre-primaryGold/15 space-y-2">
            <Upload className="w-10 h-10 text-wbre-primaryGold/40 mx-auto" />
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
              No Evidence Files Uploaded Yet
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              The applicant has declared {declaredEvidencePlan.length} evidence streams. Evidence files uploaded via the application or adjudication portal will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal Lightbox */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-wbre-surfaceDark border-2 border-wbre-primaryGold/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-wbre-lightGold block">
                  EVIDENCE PREVIEW
                </span>
                <h4 className="text-base font-serif font-bold text-white truncate max-w-lg">
                  {previewItem.originalName}
                </h4>
              </div>

              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center max-h-[72vh] overflow-hidden rounded-xl bg-black/60 p-2">
              {getFileGroup(previewItem.originalName) === "image" ? (
                <div className="relative w-full h-[60vh]">
                  <Image
                    src={previewItem.fileUrl}
                    alt={previewItem.originalName}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : getFileGroup(previewItem.originalName) === "video" ? (
                <video
                  src={previewItem.fileUrl}
                  controls
                  autoPlay
                  className="max-h-[60vh] rounded-lg max-w-full"
                />
              ) : (
                <div className="text-center p-12 space-y-4">
                  <FileText className="w-16 h-16 text-wbre-primaryGold mx-auto" />
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    Direct browser preview is not supported for this document format. You can download or open it in a viewer.
                  </p>
                  <a
                    href={previewItem.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-wbre-deepNavy font-bold text-xs uppercase tracking-wider"
                  >
                    <span>Open / Download Document</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400">
              <span>Size: {formatBytes(previewItem.fileSize)}</span>
              <a
                href={previewItem.fileUrl}
                download={previewItem.originalName}
                className="text-wbre-lightGold hover:underline flex items-center gap-1 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save to Local Disk</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Reject Evidence Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-wbre-surfaceDark border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400 pb-2 border-b border-white/10">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="text-base font-serif font-bold text-white uppercase tracking-wider">
                Reject Evidence File
              </h4>
            </div>

            <p className="text-xs text-slate-300">
              Provide an adjudication reason for declining <strong className="text-white">"{rejectingItem.originalName}"</strong>:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Video resolution insufficient; camera angle did not continuously capture stopwatch..."
              className="w-full p-3 rounded-xl bg-wbre-deepNavy border border-slate-700 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-red-400"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingItem(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2 rounded-lg bg-wbre-deepNavy border border-slate-700 text-slate-300 text-xs font-medium hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingId === rejectingItem.id}
                onClick={() =>
                  handleStatusUpdate(
                    rejectingItem.id,
                    "REJECTED",
                    rejectionReason
                  )
                }
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationEvidenceTab;
