import { NextResponse } from "next/server";
import { RecordService } from "@/features/records/services/record.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || "ACTIVE";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const records = await RecordService.getRecords({
      search,
      category,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: records,
      pagination: { page, limit, count: records.length },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch records" },
      { status: 500 }
    );
  }
}
