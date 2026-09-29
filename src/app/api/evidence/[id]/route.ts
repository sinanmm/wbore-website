import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evidenceId = id?.trim();

    if (!evidenceId) {
      return NextResponse.json(
        { success: false, error: "Evidence ID is required." },
        { status: 400 }
      );
    }

    const evidence = await prisma.applicationEvidence.findUnique({
      where: { id: evidenceId },
    });

    if (!evidence) {
      return NextResponse.json(
        { success: false, error: "Evidence record not found." },
        { status: 404 }
      );
    }

    // Attempt to delete physical file from storage
    if (evidence.fileUrl) {
      try {
        const fileKey = evidence.fileName;
        await storage.deleteFile(fileKey);
      } catch (err) {
        console.warn(`Storage delete error for evidence ${evidenceId}:`, err);
      }
    }

    // Delete record from database
    await prisma.applicationEvidence.delete({
      where: { id: evidenceId },
    });

    return NextResponse.json({
      success: true,
      message: "Evidence file deleted successfully.",
    });
  } catch (error: any) {
    console.error("Delete evidence error:", error);
    if (error.code === "P2021" || error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          success: false,
          error: "The table 'public.ApplicationEvidence' does not exist. Please run 'npx prisma migrate deploy'.",
        },
        { status: 503 }
      );
    }
    if (error.code === "P1001" || error.message?.includes("Can't reach database server")) {
      return NextResponse.json(
        {
          success: false,
          error: "Database server is unreachable.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete evidence file.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/evidence/[id]
 * Used by Admin to approve or reject evidence
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const evidenceId = id?.trim();
    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!evidenceId) {
      return NextResponse.json(
        { success: false, error: "Evidence ID is required." },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be APPROVED, REJECTED, or PENDING." },
        { status: 400 }
      );
    }

    const updated = await prisma.applicationEvidence.update({
      where: { id: evidenceId },
      data: {
        status,
        rejectionReason: status === "REJECTED" ? rejectionReason || "Evidence does not meet verification criteria." : null,
      },
    });

    return NextResponse.json({
      success: true,
      evidence: updated,
    });
  } catch (error: any) {
    console.error("Update evidence status error:", error);
    if (error.code === "P2021" || error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          success: false,
          error: "The table 'public.ApplicationEvidence' does not exist. Please run 'npx prisma migrate deploy'.",
        },
        { status: 503 }
      );
    }
    if (error.code === "P1001" || error.message?.includes("Can't reach database server")) {
      return NextResponse.json(
        {
          success: false,
          error: "Database server is unreachable.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update evidence status.",
      },
      { status: 500 }
    );
  }
}
