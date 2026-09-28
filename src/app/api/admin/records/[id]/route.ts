import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PUT(
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

    const updated = await prisma.record.update({
      where: { id },
      data: {
        title: body.title,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        resultValue: body.resultValue,
        measurementUnit: body.measurementUnit,
        country: body.country,
        location: body.location,
        status: body.status,
        isDemo: body.isDemo !== undefined ? Boolean(body.isDemo) : undefined,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        evidenceSummary: body.evidenceSummary,
        verificationMethod: body.verificationMethod,
        witnessInfo: body.witnessInfo,
        adjudicatorInfo: body.adjudicatorInfo,
        featuredImage: body.featuredImage,
        videoUrl: body.videoUrl,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "UPDATE_RECORD",
        entity: "Record",
        entityId: id,
        details: `Updated record ${updated.recordId}`,
      },
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error: any) {
    console.error("Record update error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update record" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.record.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
