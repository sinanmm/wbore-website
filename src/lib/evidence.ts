export interface EvidenceTypeInfo {
  code: string;
  label: string;
  defaultFileType: "video" | "image" | "document" | "any";
  description: string;
}

export const EVIDENCE_CATEGORIES: Record<string, EvidenceTypeInfo> = {
  VIDEO: {
    code: "VIDEO",
    label: "Full Continuous Video (Multi-angle)",
    defaultFileType: "video",
    description: "Uncut, high-definition multi-angle video recording of the entire attempt.",
  },
  PHOTOGRAPHY: {
    code: "PHOTOGRAPHY",
    label: "High-Resolution Photographic Evidence",
    defaultFileType: "image",
    description: "Close-up, wide-angle and context high-resolution still photographs.",
  },
  WITNESS_AFFIDAVIT: {
    code: "WITNESS_AFFIDAVIT",
    label: "Sworn Independent Witness Affidavits",
    defaultFileType: "document",
    description: "Notarized statements and contact details of independent certified witnesses.",
  },
  TIMEKEEPER_LOG: {
    code: "TIMEKEEPER_LOG",
    label: "Official Timekeepers / Chronometer Logs",
    defaultFileType: "document",
    description: "Synchronized dual-chronometer logs certified by official timekeepers.",
  },
  CALIBRATION_CERTIFICATE: {
    code: "CALIBRATION_CERTIFICATE",
    label: "Technical Measurement / Calibration Certificates",
    defaultFileType: "document",
    description: "Official calibration certificates for scales, meters, sensors, and instruments.",
  },
  GOVERNMENT_DOCUMENT: {
    code: "GOVERNMENT_DOCUMENT",
    label: "Government / Official Jurisdictional Documents",
    defaultFileType: "document",
    description: "Official permits, municipal licenses, police or government attestations.",
  },
  MEDIA_COVERAGE: {
    code: "MEDIA_COVERAGE",
    label: "Accredited Media Coverage & Broadcast",
    defaultFileType: "document",
    description: "Press clippings, television broadcasts, accredited journalist reports.",
  },
  GEOLOCATION_LOG: {
    code: "GEOLOCATION_LOG",
    label: "Surveyor Topographical / Geolocation Logs",
    defaultFileType: "document",
    description: "Certified land surveyor reports, differential GPS logs, topographical maps.",
  },
  TELEMETRY_STREAM: {
    code: "TELEMETRY_STREAM",
    label: "Biometric / Telemetry Data Streams",
    defaultFileType: "document",
    description: "Digital telemetry sensor datasets, biometric vitals logs, and telemetry files.",
  },
  GENERAL: {
    code: "GENERAL",
    label: "General Supporting Evidence",
    defaultFileType: "any",
    description: "General supplementary documentation and certificates.",
  },
};

/**
 * Mapping from the UI checkbox label to code
 */
export const LABEL_TO_CODE: Record<string, string> = {
  "Full Continuous Video (Multi-angle)": "VIDEO",
  "High-Resolution Photographic Evidence": "PHOTOGRAPHY",
  "Sworn Independent Witness Affidavits": "WITNESS_AFFIDAVIT",
  "Official Timekeepers / Chronometer Logs": "TIMEKEEPER_LOG",
  "Technical Measurement / Calibration Certificates": "CALIBRATION_CERTIFICATE",
  "Government / Official Jurisdictional Documents": "GOVERNMENT_DOCUMENT",
  "Accredited Media Coverage & Broadcast": "MEDIA_COVERAGE",
  "Surveyor Topographical / Geolocation Logs": "GEOLOCATION_LOG",
  "Biometric / Telemetry Data Streams": "TELEMETRY_STREAM",
};

/**
 * File Rules & Limits
 */
export const EVIDENCE_LIMITS = {
  MAX_FILES: 10,
  MAX_FILE_SIZE_BYTES: 25 * 1024 * 1024, // 25 MB
  MAX_TOTAL_SIZE_BYTES: 250 * 1024 * 1024, // 250 MB
  ALLOWED_IMAGE_EXTS: [".jpg", ".jpeg", ".png", ".webp"],
  ALLOWED_DOC_EXTS: [".pdf", ".doc", ".docx"],
  ALLOWED_VIDEO_EXTS: [".mp4", ".mov"],
};

export const ALLOWED_EXTENSIONS = [
  ...EVIDENCE_LIMITS.ALLOWED_IMAGE_EXTS,
  ...EVIDENCE_LIMITS.ALLOWED_DOC_EXTS,
  ...EVIDENCE_LIMITS.ALLOWED_VIDEO_EXTS,
];

export const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Videos
  "video/mp4",
  "video/quicktime",
];

// Block dangerous executable extensions & archives
export const DANGEROUS_EXTENSIONS = [
  ".exe", ".bat", ".cmd", ".sh", ".bash", ".zsh", ".php", ".phtml",
  ".pl", ".py", ".rb", ".cgi", ".js", ".mjs", ".vbs", ".scr", ".jar",
  ".apk", ".app", ".dmg", ".pkg", ".iso", ".bin", ".com", ".gadget",
  ".zip", ".rar", ".7z", ".tar", ".gz", ".bz2",
];

/**
 * Validate file name, extension, and size
 */
export function validateEvidenceFile(file: {
  name: string;
  size: number;
  type?: string;
}): { valid: boolean; error?: string } {
  const name = file.name || "";
  const ext = ("." + name.split(".").pop()).toLowerCase();

  // Check dangerous extensions / archives
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    if (ext === ".zip" || ext === ".rar" || ext === ".7z" || ext === ".tar" || ext === ".gz") {
      return {
        valid: false,
        error: "File type not supported. Archive files (.zip, .rar) are not permitted. Please upload individual documents or media files.",
      };
    }
    return {
      valid: false,
      error: `Security violation: Executable and script files (${ext}) are strictly prohibited.`,
    };
  }

  // Check supported extensions
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: "File type not supported. Allowed formats: PDF, JPG, JPEG, PNG, WEBP, MP4, MOV, DOC, DOCX.",
    };
  }

  // Check individual file size (25 MB)
  if (file.size > EVIDENCE_LIMITS.MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "Maximum file size is 25 MB",
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: "File is empty (0 bytes).",
    };
  }

  return { valid: true };
}

/**
 * Determine file category group (image, video, document)
 */
export function getFileGroup(fileName: string): "image" | "video" | "document" | "other" {
  const ext = ("." + fileName.split(".").pop()).toLowerCase();
  if (EVIDENCE_LIMITS.ALLOWED_IMAGE_EXTS.includes(ext)) return "image";
  if (EVIDENCE_LIMITS.ALLOWED_VIDEO_EXTS.includes(ext)) return "video";
  if (EVIDENCE_LIMITS.ALLOWED_DOC_EXTS.includes(ext)) return "document";
  return "other";
}

/**
 * Suggest evidence category code based on filename/group and selected requirements
 */
export function suggestEvidenceCategory(
  fileName: string,
  selectedCodes: string[]
): string {
  const group = getFileGroup(fileName);

  if (group === "video" && selectedCodes.includes("VIDEO")) return "VIDEO";
  if (group === "image" && selectedCodes.includes("PHOTOGRAPHY")) return "PHOTOGRAPHY";

  if (group === "document") {
    const docCandidates = [
      "WITNESS_AFFIDAVIT",
      "CALIBRATION_CERTIFICATE",
      "GOVERNMENT_DOCUMENT",
      "TIMEKEEPER_LOG",
      "GEOLOCATION_LOG",
      "TELEMETRY_STREAM",
      "MEDIA_COVERAGE",
    ];
    for (const code of docCandidates) {
      if (selectedCodes.includes(code)) return code;
    }
  }

  // Default to first selected or GENERAL
  return selectedCodes[0] || "GENERAL";
}

/**
 * Format bytes to readable string (e.g. 2.4 MB)
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
