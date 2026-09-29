import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const applicationId = id?.trim();

    if (!applicationId) {
      return NextResponse.json(
        { success: false, error: "Application identifier is required." },
        { status: 400 }
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        OR: [{ id: applicationId }, { applicationNumber: applicationId }],
      },
      include: {
        evidences: {
          orderBy: { createdAt: "desc" },
        },
        evidenceTypes: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      applicationNumber: application.applicationNumber,
      evidences: application.evidences,
      evidenceTypes: application.evidenceTypes,
    });
  } catch (error: any) {
    console.error("Fetch evidence list error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve evidence list.",
      },
      { status: 500 }
    );
  }
}
