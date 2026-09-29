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

    let application = null;
    try {
      application = await prisma.application.findFirst({
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
    } catch (dbError: any) {
      console.warn("Database query error in evidence list API:", dbError);
      if (dbError.code === "P2021" || dbError.message?.includes("does not exist")) {
        // Table doesn't exist yet in PostgreSQL - return empty list gracefully without crashing
        return NextResponse.json({
          success: true,
          applicationId,
          applicationNumber: applicationId,
          evidences: [],
          evidenceTypes: [],
          warning: "Database tables not yet migrated. Run 'npx prisma migrate deploy'.",
        });
      }
      if (dbError.code === "P1001" || dbError.message?.includes("Can't reach database server")) {
        return NextResponse.json({
          success: true,
          applicationId,
          applicationNumber: applicationId,
          evidences: [],
          evidenceTypes: [],
          warning: "Database server unreachable.",
        });
      }
      throw dbError;
    }

    if (!application) {
      // If it's a draft session ID, return empty list gracefully so the wizard doesn't fail
      if (applicationId.startsWith("draft-")) {
        return NextResponse.json({
          success: true,
          applicationId,
          applicationNumber: applicationId,
          evidences: [],
          evidenceTypes: [],
          isDraft: true,
        });
      }

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
