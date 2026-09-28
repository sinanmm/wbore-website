import db from "@/lib/db";
import { generateApplicationNumber } from "@/lib/utils";
import { ApplicationFormData } from "@/lib/validations";
import { ApplicationWithHistory } from "../types";

export class ApplicationService {
  /**
   * Submits a new record application
   */
  static async submitApplication(data: ApplicationFormData) {
    const applicationNumber = generateApplicationNumber();

    return db.application.create({
      data: {
        applicationNumber,
        applicantType: data.applicantType,
        applicantName: data.applicantName,
        organizationName: data.organizationName || null,
        email: data.email,
        phone: data.phone,
        country: data.country,
        stateRegion: data.stateRegion || null,
        city: data.city,
        proposedTitle: data.proposedTitle,
        categoryName: data.categoryName,
        description: data.description,
        measuredMetric: data.measuredMetric,
        knownBenchmark: data.knownBenchmark || null,
        significance: data.significance,
        proposedDate: data.proposedDate ? new Date(data.proposedDate) : null,
        location: data.location,
        expectedParticipants: data.expectedParticipants || 1,
        attemptType: data.attemptType,
        evidencePlan: JSON.stringify(data.evidencePlan),
        additionalNotes: data.additionalNotes || null,
        status: "SUBMITTED",
        statusHistory: {
          create: {
            status: "SUBMITTED",
            note: "Application dossier logged through online registry portal.",
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });
  }

  /**
   * Retrieves an application by applicationNumber and matching email
   */
  static async getApplicationStatus(
    applicationNumber: string,
    email: string
  ): Promise<ApplicationWithHistory | null> {
    return db.application.findFirst({
      where: {
        applicationNumber: { equals: applicationNumber },
        email: { equals: email },
      },
      include: {
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Updates an application status (for admin/reviewer workflows)
   */
  static async updateStatus(
    id: string,
    status: string,
    note?: string,
    updatedBy?: string
  ) {
    return db.application.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note: note || `Status updated to ${status}`,
            updatedBy: updatedBy || "Secretariat Desk",
          },
        },
      },
    });
  }
}
