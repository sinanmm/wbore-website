import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AdminLoginSchema } from "@/lib/validations";
import { verifyPassword, setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, password } = AdminLoginSchema.parse(json);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials or account inactive" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials or account inactive" },
        { status: 401 }
      );
    }

    await setAdminSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Log to audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "ADMIN_LOGIN",
        entity: "User",
        entityId: user.id,
        details: `Successful login by ${user.name} (${user.role})`,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
