import db from "@/lib/db";
import { RecordQueryParams, RecordWithDetails } from "../types";

export class RecordService {
  /**
   * Fetches records with optional filters (search, category, status)
   */
  static async getRecords(params?: RecordQueryParams): Promise<RecordWithDetails[]> {
    const where: any = {};

    if (params?.status) {
      where.status = params.status;
    }

    if (params?.category) {
      where.category = { name: params.category };
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search } },
        { shortDescription: { contains: params.search } },
        { recordId: { contains: params.search } },
        { holder: { name: { contains: params.search } } },
      ];
    }

    return (await db.record.findMany({
      where,
      include: {
        category: true,
        holder: true,
        organization: true,
        certificates: true,
      },
      orderBy: { createdAt: "desc" },
      take: params?.limit,
      skip: params?.page && params?.limit ? (params.page - 1) * params.limit : undefined,
    })) as RecordWithDetails[];
  }

  /**
   * Fetches featured records for homepage
   */
  static async getFeaturedRecords(limit = 6): Promise<RecordWithDetails[]> {
    return (await db.record.findMany({
      where: { isFeatured: true, status: "ACTIVE" },
      include: {
        category: true,
        holder: true,
        organization: true,
        certificates: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })) as RecordWithDetails[];
  }

  /**
   * Fetches a record by its unique slug
   */
  static async getRecordBySlug(slug: string): Promise<RecordWithDetails | null> {
    return (await db.record.findUnique({
      where: { slug },
      include: {
        category: true,
        holder: true,
        organization: true,
        certificates: true,
      },
    })) as RecordWithDetails | null;
  }

  /**
   * Fetches a record by its recordId (e.g. WBRE-WR-2026-...)
   */
  static async getRecordById(recordId: string): Promise<RecordWithDetails | null> {
    return (await db.record.findUnique({
      where: { recordId },
      include: {
        category: true,
        holder: true,
        organization: true,
        certificates: true,
      },
    })) as RecordWithDetails | null;
  }
}
