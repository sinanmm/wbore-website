import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import {
  validateEvidenceFile,
  EVIDENCE_LIMITS,
  suggestEvidenceCategory,
} from "@/lib/evidence";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routeAppId = id?.trim();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bodyAppId = (formData.get("applicationId") as string | null)?.trim();
    const requestedCategory =
      (formData.get("evidenceCategory") as string | null) ||
      (formData.get("category") as string | null);

    const applicationId = routeAppId || bodyAppId;

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application identifier is required." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was provided in the upload request." },
        { status: 400 }
      );
    }

    // Temporary console log for debugging
    console.log("API: Received upload:", file.name);

    // 1. Server-side File Validation (type, dangerous exts, size <= 25MB)
    const validation = validateEvidenceFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // 2. Ensure Application exists in database (find existing or create draft)
    let application = await prisma.application.findFirst({
      where: {
        OR: [{ id: applicationId }, { applicationNumber: applicationId }],
      },
      include: { evidences: true },
    });

    if (!application) {
      const count = await prisma.application.count();
      const year = new Date().getFullYear();
      const draftNumber = `WBRE-APP-${year}-DRAFT-${String(count + 1).padStart(4, "0")}`;

      application = await prisma.application.create({
        data: {
          id: applicationId.startsWith("draft-") ? undefined : applicationId,
          applicationNumber: draftNumber,
          applicantType: "Individual",
          applicantName: "Draft Applicant",
          email: "draft@wbre.org",
          phone: "+0000000000",
          country: "Pending",
          city: "Pending",
          proposedTitle: "Pending Draft Record Proposal",
          categoryName: "General",
          description: "Draft application initialized for evidence collection workflow.",
          measuredMetric: "Pending",
          significance: "Pending",
          location: "Pending",
          attemptType: "Individual",
          evidencePlan: "[]",
          status: "DRAFT",
        },
        include: { evidences: true },
      });
      console.log(`[API] Created draft Application record with ID: ${application.id}`);
    }

    // 3. Validate Application File Limits (Max 10 files, Max 250 MB total)
    if (application.evidences.length >= EVIDENCE_LIMITS.MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum 10 files allowed",
        },
        { status: 400 }
      );
    }

    const currentTotalSize = application.evidences.reduce(
      (acc, ev) => acc + (ev.fileSize || 0),
      0
    );

    if (currentTotalSize + file.size > EVIDENCE_LIMITS.MAX_TOTAL_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: "Maximum total upload size is 250 MB",
        },
        { status: 400 }
      );
    }

    // 4. Store file using Storage Abstraction
    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = `evidence/${application.applicationNumber || application.id}`;
    const uploadResult = await storage.uploadFile(
      buffer,
      file.name,
      file.type || "application/octet-stream",
      folder
    );

    console.log("Storage: Upload completed:", uploadResult.url);

    const evidenceCategory =
      requestedCategory ||
      suggestEvidenceCategory(file.name, ["GENERAL"]);

    // 5. Database Insertion: Create ApplicationEvidence record
    const createdEvidence = await prisma.applicationEvidence.create({
      data: {
        applicationId: application.id,
        fileName: uploadResult.key.split("/").pop() || file.name,
        originalName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
        fileUrl: uploadResult.url,
        storageProvider: uploadResult.provider || "LOCAL",
        evidenceCategory,
        uploadedBy: "APPLICANT",
        status: "PENDING",
      },
    });

    console.log("Database: Evidence saved:", createdEvidence.id);

    return NextResponse.json({
      success: true,
      file: {
        id: createdEvidence.id,
        name: createdEvidence.originalName,
        originalName: createdEvidence.originalName,
        url: createdEvidence.fileUrl,
        key: createdEvidence.fileName,
        size: createdEvidence.fileSize,
        type: createdEvidence.fileType,
        category: createdEvidence.evidenceCategory,
        provider: createdEvidence.storageProvider,
        uploadedAt: createdEvidence.createdAt,
        applicationId: application.id,
        status: "uploaded",
      },
    });
  } catch (error: any) {
    console.error("Evidence upload API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload evidence file. Please try again.",
      },
      { status: 500 }
    );
  }
}
