import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApplicationFormSchema } from "@/lib/validations";
import { generateApplicationNumber } from "@/lib/utils";
import { LABEL_TO_CODE } from "@/lib/evidence";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedData = ApplicationFormSchema.parse(json);
    const uploadedFiles = validatedData.uploadedFiles || [];

    // Check if an existing draft application is being submitted
    let application = null;
    if (validatedData.applicationId) {
      application = await prisma.application.findFirst({
        where: {
          OR: [
            { id: validatedData.applicationId },
            { applicationNumber: validatedData.applicationId },
          ],
        },
        include: { evidences: true, evidenceTypes: true },
      });
    }

    if (application && application.status === "DRAFT") {
      // Promote draft application to official submission
      const count = await prisma.application.count({ where: { status: { not: "DRAFT" } } });
      const officialApplicationNumber = generateApplicationNumber(count + 1, new Date().getFullYear());

      // Delete existing placeholder evidence types if any
      await prisma.applicationEvidenceType.deleteMany({
        where: { applicationId: application.id },
      });

      application = await prisma.application.update({
        where: { id: application.id },
        data: {
          applicationNumber: officialApplicationNumber,
          applicantType: validatedData.applicantType,
          applicantName: validatedData.applicantName,
          organizationName: validatedData.organizationName || null,
          email: validatedData.email,
          phone: validatedData.phone,
          country: validatedData.country,
          stateRegion: validatedData.stateRegion || null,
          city: validatedData.city,
          proposedTitle: validatedData.proposedTitle,
          categoryName: validatedData.categoryName,
          description: validatedData.description,
          measuredMetric: validatedData.measuredMetric,
          knownBenchmark: validatedData.knownBenchmark || null,
          significance: validatedData.significance,
          proposedDate: validatedData.proposedDate ? new Date(validatedData.proposedDate) : null,
          location: validatedData.location,
          expectedParticipants: validatedData.expectedParticipants,
          attemptType: validatedData.attemptType,
          evidencePlan: JSON.stringify(validatedData.evidencePlan),
          additionalNotes: validatedData.additionalNotes || null,
          status: uploadedFiles.length > 0 || application.evidences.length > 0 ? "EVIDENCE_SUBMITTED" : "SUBMITTED",
          evidenceTypes: {
            create: validatedData.evidencePlan.map((planItem: string) => ({
              type: LABEL_TO_CODE[planItem] || planItem.toUpperCase().replace(/[^A-Z0-9]/g, "_"),
            })),
          },
          statusHistory: {
            create: {
              status: uploadedFiles.length > 0 || application.evidences.length > 0 ? "EVIDENCE_SUBMITTED" : "SUBMITTED",
              note: `Initial application submitted via official online portal with ${application.evidences.length} evidence file(s).`,
            },
          },
        },
        include: {
          evidenceTypes: true,
          evidences: true,
        },
      });
    } else {
      // Count existing applications to generate serial sequence
      const count = await prisma.application.count();
      const applicationNumber = generateApplicationNumber(count + 1, new Date().getFullYear());

      application = await prisma.application.create({
        data: {
          applicationNumber,
          applicantType: validatedData.applicantType,
          applicantName: validatedData.applicantName,
          organizationName: validatedData.organizationName || null,
          email: validatedData.email,
          phone: validatedData.phone,
          country: validatedData.country,
          stateRegion: validatedData.stateRegion || null,
          city: validatedData.city,
          proposedTitle: validatedData.proposedTitle,
          categoryName: validatedData.categoryName,
          description: validatedData.description,
          measuredMetric: validatedData.measuredMetric,
          knownBenchmark: validatedData.knownBenchmark || null,
          significance: validatedData.significance,
          proposedDate: validatedData.proposedDate ? new Date(validatedData.proposedDate) : null,
          location: validatedData.location,
          expectedParticipants: validatedData.expectedParticipants,
          attemptType: validatedData.attemptType,
          evidencePlan: JSON.stringify(validatedData.evidencePlan),
          additionalNotes: validatedData.additionalNotes || null,
          status: uploadedFiles.length > 0 ? "EVIDENCE_SUBMITTED" : "SUBMITTED",
          evidenceTypes: {
            create: validatedData.evidencePlan.map((planItem: string) => ({
              type: LABEL_TO_CODE[planItem] || planItem.toUpperCase().replace(/[^A-Z0-9]/g, "_"),
            })),
          },
          ...(uploadedFiles.length > 0
            ? {
                evidences: {
                  create: uploadedFiles.map((f: any) => ({
                    fileName: f.key?.split("/").pop() || f.name,
                    originalName: f.name,
                    fileType: f.type || "application/octet-stream",
                    fileSize: f.size || 0,
                    fileUrl: f.url,
                    storageProvider: f.provider || "LOCAL",
                    evidenceCategory: f.category || "GENERAL",
                    uploadedBy: "APPLICANT",
                    status: "PENDING",
                  })),
                },
              }
            : {}),
          statusHistory: {
            create: {
              status: uploadedFiles.length > 0 ? "EVIDENCE_SUBMITTED" : "SUBMITTED",
              note:
                uploadedFiles.length > 0
                  ? `Initial application submitted with ${uploadedFiles.length} supporting evidence file(s).`
                  : "Initial application submitted via official online portal.",
            },
          },
        },
        include: {
          evidenceTypes: true,
          evidences: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      applicationNumber: application.applicationNumber,
      id: application.id,
    });
  } catch (error: any) {
    console.error("Application submission error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    if (error.code === "P2021" || error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          success: false,
          error: "Database tables have not been created yet. Please run 'npx prisma migrate deploy'.",
        },
        { status: 503 }
      );
    }
    if (error.code === "P1001" || error.message?.includes("Can't reach database server")) {
      return NextResponse.json(
        {
          success: false,
          error: "Database server is currently unreachable. Please check PostgreSQL connection.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error occurred while processing application." },
      { status: 500 }
    );
  }
}
