import db from "@/lib/db";

export class VerificationService {
  /**
   * Verifies an official record by certificate number or verification code
   */
  static async verifyCertificate(query: string) {
    const trimmed = query.trim();

    return db.certificate.findFirst({
      where: {
        OR: [
          { verificationCode: { equals: trimmed } },
          { certificateNumber: { equals: trimmed } },
        ],
      },
      include: {
        record: {
          include: {
            category: true,
            holder: true,
            organization: true,
          },
        },
      },
    });
  }
}
