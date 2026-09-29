"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  FileText,
  Video,
  FileCheck,
  AlertCircle,
  X,
  CheckCircle2,
  Trash2,
  Eye,
  Plus,
  Loader2,
  RotateCw,
} from "lucide-react";
import {
  EVIDENCE_LIMITS,
  LABEL_TO_CODE,
  EVIDENCE_CATEGORIES,
  suggestEvidenceCategory,
  validateEvidenceFile,
  formatBytes,
  getFileGroup,
} from "@/lib/evidence";

export interface UploadedEvidenceItem {
  id: string;
  name: string;
  url: string;
  key?: string;
  size: number;
  type: string;
  category: string;
  provider?: string;
  uploadProgress?: number;
  status: "uploading" | "uploaded" | "error";
  errorMessage?: string;
}

interface EvidenceUploadBoxProps {
  applicationId: string;
  selectedEvidenceOptions: string[];
  uploadedFiles: UploadedEvidenceItem[];
  onFilesChange: (files: UploadedEvidenceItem[]) => void;
  onApplicationIdAssigned?: (assignedId: string) => void;
}

export function EvidenceUploadBox({
  applicationId,
  selectedEvidenceOptions,
  uploadedFiles,
  onFilesChange,
  onApplicationIdAssigned,
}: EvidenceUploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeError, setActiveError] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<UploadedEvidenceItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<UploadedEvidenceItem[]>(uploadedFiles);
  const fileObjectsMapRef = useRef<Map<string, { file: File; category: string }>>(new Map());

  // Keep filesRef synchronized with the external prop
  useEffect(() => {
    filesRef.current = uploadedFiles;
  }, [uploadedFiles]);

  // Synchronous atomic state update helper
  const updateFilesList = useCallback(
    (updater: (prev: UploadedEvidenceItem[]) => UploadedEvidenceItem[]) => {
      const next = updater(filesRef.current);
      filesRef.current = next;
      onFilesChange(next);
    },
    [onFilesChange]
  );

  // Selected evidence codes
  const selectedCodes = selectedEvidenceOptions
    .map((opt) => LABEL_TO_CODE[opt] || opt)
    .filter(Boolean);

  const totalUploadedSize = uploadedFiles.reduce((acc, f) => acc + (f.size || 0), 0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const uploadSingleFile = async (
    file: File,
    tempId: string,
    initialCategory: string
  ): Promise<void> => {
    // Temporary console log for debugging
    console.log("Frontend: Uploading file:", file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("applicationId", applicationId);
    formData.append("evidenceCategory", initialCategory);
    formData.append("category", initialCategory);

    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.max(10, Math.min(95, Math.round((event.loaded / event.total) * 100)));
          updateFilesList((prev) =>
            prev.map((item) =>
              item.id === tempId ? { ...item, uploadProgress: progress, status: "uploading" } : item
            )
          );
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.success && res.file) {
              updateFilesList((prev) =>
                prev.map((item) =>
                  item.id === tempId
                    ? {
                        ...item,
                        id: res.file.id,
                        url: res.file.url,
                        key: res.file.key,
                        provider: res.file.provider,
                        status: "uploaded",
                        uploadProgress: 100,
                        errorMessage: undefined,
                      }
                    : item
                )
              );

              // If a server application ID was assigned or created
              if (res.file.applicationId && onApplicationIdAssigned) {
                onApplicationIdAssigned(res.file.applicationId);
              }

              resolve();
            } else {
              throw new Error(res.error || "Upload failed");
            }
          } catch (err: any) {
            const msg = err.message || "Failed to process server response.";
            markFileError(tempId, msg);
            reject(err);
          }
        } else {
          let errorMsg = `Server returned HTTP ${xhr.status}`;
          try {
            const errRes = JSON.parse(xhr.responseText);
            if (errRes.error) errorMsg = errRes.error;
          } catch {
            // Keep default
          }
          markFileError(tempId, errorMsg);
          reject(new Error(errorMsg));
        }
      });

      xhr.addEventListener("error", () => {
        const errorMsg = "Network connection failed during upload.";
        markFileError(tempId, errorMsg);
        reject(new Error(errorMsg));
      });

      xhr.addEventListener("abort", () => {
        markFileError(tempId, "Upload aborted.");
        reject(new Error("Upload aborted"));
      });

      xhr.open("POST", `/api/applications/${encodeURIComponent(applicationId)}/evidence/upload`);
      xhr.send(formData);
    });
  };

  const markFileError = (tempId: string, msg: string) => {
    updateFilesList((prev) =>
      prev.map((item) =>
        item.id === tempId
          ? { ...item, status: "error", errorMessage: msg, uploadProgress: 0 }
          : item
      )
    );
  };

  const retryUpload = (itemId: string) => {
    const cached = fileObjectsMapRef.current.get(itemId);
    if (!cached) {
      setActiveError("Cannot retry: Original file source is no longer in memory. Please select the file again.");
      return;
    }

    updateFilesList((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: "uploading", uploadProgress: 15, errorMessage: undefined }
          : item
      )
    );

    uploadSingleFile(cached.file, itemId, cached.category).catch((err) => {
      console.warn("Retry upload error:", err);
    });
  };

  const processSelectedFiles = async (fileList: FileList | File[]) => {
    setActiveError(null);
    const files = Array.from(fileList);

    if (files.length === 0) return;

    // Check maximum files limit (10 files)
    const currentCount = filesRef.current.length;
    if (currentCount + files.length > EVIDENCE_LIMITS.MAX_FILES) {
      setActiveError(
        `Maximum 10 files allowed. You currently have ${currentCount} file(s) attached.`
      );
      return;
    }

    // Check individual files & total size (Max 25MB each, Max 250MB total)
    let tentativeTotal = filesRef.current.reduce((acc, f) => acc + (f.size || 0), 0);
    const validBatch: { file: File; tempId: string; category: string }[] = [];

    for (const file of files) {
      const validation = validateEvidenceFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (!validation.valid) {
        setActiveError(validation.error || `"${file.name}": File validation failed.`);
        return;
      }

      tentativeTotal += file.size;
      if (tentativeTotal > EVIDENCE_LIMITS.MAX_TOTAL_SIZE_BYTES) {
        setActiveError("Maximum total upload size is 250 MB");
        return;
      }

      const tempId = `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const suggestedCat = suggestEvidenceCategory(file.name, selectedCodes);

      // Cache file object for retry
      fileObjectsMapRef.current.set(tempId, { file, category: suggestedCat });

      validBatch.push({ file, tempId, category: suggestedCat });
    }

    // 1. Immediately display new files in UI with "Uploading..." status
    const newItems: UploadedEvidenceItem[] = validBatch.map((b) => ({
      id: b.tempId,
      name: b.file.name,
      url: "",
      size: b.file.size,
      type: b.file.type,
      category: b.category,
      uploadProgress: 15,
      status: "uploading",
    }));

    updateFilesList((prev) => [...prev, ...newItems]);

    // 2. Perform uploads asynchronously
    for (const b of validBatch) {
      try {
        await uploadSingleFile(b.file, b.tempId, b.category);
      } catch (err) {
        console.warn(`Upload failed for ${b.file.name}:`, err);
      }
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processSelectedFiles(e.dataTransfer.files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedCodes, applicationId]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      processSelectedFiles(selected);
    }
    // Safely clear input after reading so the same file name can be re-selected if deleted
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 100);
  };

  const removeFile = async (item: UploadedEvidenceItem) => {
    // If already stored in DB/storage, invoke DELETE endpoint
    if (item.status === "uploaded" && !item.id.startsWith("tmp-") && !item.id.startsWith("temp-")) {
      try {
        await fetch(`/api/evidence/${encodeURIComponent(item.id)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Failed to delete from server:", err);
      }
    }

    fileObjectsMapRef.current.delete(item.id);
    updateFilesList((prev) => prev.filter((f) => f.id !== item.id));
  };

  const updateFileCategory = (id: string, category: string) => {
    const cached = fileObjectsMapRef.current.get(id);
    if (cached) {
      cached.category = category;
    }
    updateFilesList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, category } : f))
    );
  };

  const getFileIcon = (fileName: string) => {
    const group = getFileGroup(fileName);
    if (group === "video") return <Video className="w-5 h-5 text-amber-400" />;
    if (group === "image") return <Eye className="w-5 h-5 text-sky-400" />;
    return <FileText className="w-5 h-5 text-wbre-primaryGold" />;
  };

  return (
    <div className="space-y-6 pt-6 border-t border-wbre-primaryGold/20">
      {/* Module Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-wbre-lightGold flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-wbre-primaryGold" />
            EVIDENCE ATTACHMENT PORTAL
          </span>
          <h4 className="text-lg font-serif font-bold text-white uppercase tracking-wide mt-0.5">
            Upload Evidence Files
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Upload supporting evidence documents, photographs, videos and certificates.
          </p>
        </div>

        {/* Counter & Size Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-3 py-1 rounded-full bg-wbre-deepNavy border border-wbre-primaryGold/30 text-[11px] font-mono text-slate-300">
            <span className="text-wbre-lightGold font-bold">{uploadedFiles.length}</span>/
            {EVIDENCE_LIMITS.MAX_FILES} Files
          </span>
          <span className="px-3 py-1 rounded-full bg-wbre-deepNavy border border-wbre-primaryGold/30 text-[11px] font-mono text-slate-300">
            {formatBytes(totalUploadedSize)} / 250 MB
          </span>
        </div>
      </div>

      {/* Error Alert Banner */}
      {activeError && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{activeError}</span>
          </div>
          <button
            onClick={() => setActiveError(null)}
            className="p-1 hover:bg-white/10 rounded text-red-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Large Dashed-Border Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center group ${
          isDragging
            ? "border-wbre-primaryGold bg-wbre-royalNavy/60 shadow-gold-glow scale-[1.01]"
            : "border-wbre-primaryGold/35 hover:border-wbre-primaryGold/70 bg-gradient-to-b from-wbre-surfaceDark/70 to-wbre-deepNavy/80 hover:bg-wbre-surfaceDark/90"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.mp4,.mov"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Central Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
            isDragging
              ? "bg-gold-gradient text-wbre-deepNavy scale-110 shadow-gold-glow"
              : "bg-wbre-royalNavy/80 border border-wbre-primaryGold/30 text-wbre-lightGold group-hover:border-wbre-primaryGold/60 group-hover:scale-105"
          }`}
        >
          <Upload className="w-8 h-8" />
        </div>

        {/* Action Title & Instructions */}
        <div className="space-y-1 max-w-md">
          <p className="text-base font-serif font-bold text-white group-hover:text-wbre-lightGold transition-colors">
            Drag & Drop your evidence files here, or click to browse
          </p>
          <p className="text-xs text-slate-300">
            Upload supporting evidence documents, photographs, videos and certificates.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-5 py-2.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-wbre-deepNavy font-bold text-xs uppercase tracking-wider shadow-gold-subtle flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Files</span>
          </button>
        </div>

        {/* Format Rules Ribbon */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
          <span><strong className="text-slate-300">Images:</strong> JPG, JPEG, PNG, WEBP</span>
          <span>•</span>
          <span><strong className="text-slate-300">Documents:</strong> PDF, DOC, DOCX</span>
          <span>•</span>
          <span><strong className="text-slate-300">Videos:</strong> MP4, MOV</span>
          <span>•</span>
          <span className="text-wbre-lightGold font-medium">Max 25 MB per file</span>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
              <span>Attached Evidence Manifest</span>
              <span className="text-slate-400 font-mono">({uploadedFiles.length})</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Assigned evidence streams will be evaluated by the WBRE Technical Adjudications Board.
            </span>
          </div>

          <div className="space-y-2.5">
            {uploadedFiles.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-wbre-surfaceDark/90 border border-wbre-primaryGold/25 hover:border-wbre-primaryGold/50 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* File info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-wbre-royalNavy/90 border border-wbre-primaryGold/30 flex items-center justify-center flex-shrink-0">
                    {getFileIcon(item.name)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md block">
                        {item.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{formatBytes(item.size)}</span>
                      <span>•</span>

                      {/* Status: Uploading */}
                      {item.status === "uploading" && (
                        <span className="text-amber-400 flex items-center gap-1 font-mono">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Uploading...</span>
                        </span>
                      )}

                      {/* Status: Uploaded */}
                      {item.status === "uploaded" && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Uploaded ✓</span>
                        </span>
                      )}

                      {/* Status: Error */}
                      {item.status === "error" && (
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{item.errorMessage || "Upload failed"}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => retryUpload(item.id)}
                            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Category selector & Actions */}
                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  {/* Category Link Dropdown */}
                  <select
                    value={item.category || "GENERAL"}
                    onChange={(e) => updateFileCategory(item.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-wbre-deepNavy border border-wbre-primaryGold/30 text-[11px] text-wbre-lightGold font-medium focus:ring-1 focus:ring-wbre-primaryGold"
                    title="Select associated evidence category"
                  >
                    {selectedCodes.length > 0 ? (
                      selectedCodes.map((code) => (
                        <option key={code} value={code}>
                          {EVIDENCE_CATEGORIES[code]?.label || code}
                        </option>
                      ))
                    ) : (
                      <option value="GENERAL">General Evidence</option>
                    )}
                    <option value="GENERAL">General Evidence</option>
                  </select>

                  {/* Preview button if URL exists */}
                  {item.url && (
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="p-2 rounded-lg bg-wbre-deepNavy hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Preview file"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(item)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal for Images / Media */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative max-w-3xl w-full bg-wbre-surfaceDark border border-wbre-primaryGold/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-sm font-serif font-bold text-white truncate max-w-md">
                {previewItem.name}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center max-h-[70vh] overflow-hidden rounded-xl bg-black/40 p-2">
              {getFileGroup(previewItem.name) === "image" ? (
                <div className="relative w-full h-96">
                  <Image
                    src={previewItem.url}
                    alt={previewItem.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : getFileGroup(previewItem.name) === "video" ? (
                <video
                  src={previewItem.url}
                  controls
                  className="max-h-[60vh] rounded-lg max-w-full"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText className="w-16 h-16 text-wbre-primaryGold mx-auto" />
                  <p className="text-slate-300 text-sm">
                    Document preview is not available in browser. You can inspect or download the file.
                  </p>
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-lg bg-gold-gradient text-wbre-deepNavy font-bold text-xs uppercase"
                  >
                    Open Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EvidenceUploadBox;
