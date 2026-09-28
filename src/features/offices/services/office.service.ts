import db from "@/lib/db";
import { OFFICIAL_OFFICES, OfficeInfo } from "@/config/offices";

export class OfficeService {
  /**
   * Retrieves all offices from DB with fallback to official configuration
   */
  static async getOffices(): Promise<OfficeInfo[]> {
    try {
      const dbOffices = await db.office.findMany({
        orderBy: { displayOrder: "asc" },
      });

      if (dbOffices.length > 0) {
        return dbOffices.map((o) => ({
          id: o.id,
          name: o.name,
          city: o.city,
          country: o.country,
          building: o.building,
          street: o.street,
          area: o.area || undefined,
          postalCode: o.postalCode || undefined,
          email: o.email || "info@wbore.com",
          phone: o.phone || undefined,
          isPrimary: o.isPrimary,
        }));
      }
    } catch (error) {
      console.error("Using default office configuration fallback:", error);
    }

    return OFFICIAL_OFFICES;
  }
}
