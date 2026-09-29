import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Raw connectivity ping
    await prisma.$queryRaw`SELECT 1 as ping`;

    // 2. Test core queries
    const [officeCount, recordCount, categoryCount] = await Promise.all([
      prisma.office.count().catch(() => 0),
      prisma.record.count().catch(() => 0),
      prisma.recordCategory.count().catch(() => 0),
    ]);

    // 3. Test relational query
    const sampleRecord = await prisma.record.findFirst({
      include: {
        category: true,
      },
    }).catch(() => null);

    return NextResponse.json({
      status: "connected",
      database: "postgresql",
      timestamp: new Date().toISOString(),
      counts: {
        offices: officeCount,
        records: recordCount,
        categories: categoryCount,
      },
      hasSampleRelation: !!sampleRecord,
    });
  } catch (error: any) {
    console.error("Database health check error:", error);
    return NextResponse.json(
      {
        status: "disconnected",
        database: "postgresql",
        error: error.message || "Failed to establish PostgreSQL connection.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
