import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, note, internalNotes, guidelinesDocument } = body;

    const application = await prisma.application.update({
      where: { id },
      data: {
        status: status || undefined,
        internalNotes: internalNotes !== undefined ? internalNotes : undefined,
        guidelinesDocument: guidelinesDocument !== undefined ? guidelinesDocument : undefined,
        statusHistory: status
          ? {
              create: {
                status,
                note: note || `Status updated to ${status} by ${session.name}`,
                updatedBy: session.name,
              },
            }
          : undefined,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "UPDATE_APPLICATION_STATUS",
        entity: "Application",
        entityId: id,
        details: `Updated application ${application.applicationNumber} to ${status || "same status"}`,
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update application" },
      { status: 500 }
    );
  }
}
