import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, building, street, area, postalCode, email, phone } = await request.json();

    const office = await prisma.office.update({
      where: { id },
      data: {
        building,
        street,
        area: area || null,
        postalCode: postalCode || null,
        email: email || null,
        phone: phone || null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "UPDATE_OFFICE",
        entity: "Office",
        entityId: id,
        details: `Updated postal/contact details for ${office.name}`,
      },
    });

    return NextResponse.json({ success: true, office });
  } catch (error: any) {
    console.error("Office update error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
