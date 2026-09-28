import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApplicationFormSchema } from "@/lib/validations";
import { generateApplicationNumber } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedData = ApplicationFormSchema.parse(json);

    // Count existing applications to generate serial sequence
    const count = await prisma.application.count();
    const applicationNumber = generateApplicationNumber(count + 1, new Date().getFullYear());

    const application = await prisma.application.create({
      data: {
        applicationNumber,
        applicantType: validatedData.applicantType,
        applicantName: validatedData.applicantName,
        organizationName: validatedData.organizationName || null,
        email: validatedData.email,
        phone: validatedData.phone,
        country: validatedData.country,
        stateRegion: validatedData.stateRegion || null,
        city: validatedData.city,
        proposedTitle: validatedData.proposedTitle,
        categoryName: validatedData.categoryName,
        description: validatedData.description,
        measuredMetric: validatedData.measuredMetric,
        knownBenchmark: validatedData.knownBenchmark || null,
        significance: validatedData.significance,
        proposedDate: validatedData.proposedDate ? new Date(validatedData.proposedDate) : null,
        location: validatedData.location,
        expectedParticipants: validatedData.expectedParticipants,
        attemptType: validatedData.attemptType,
        evidencePlan: JSON.stringify(validatedData.evidencePlan),
        additionalNotes: validatedData.additionalNotes || null,
        status: "SUBMITTED",
        statusHistory: {
          create: {
            status: "SUBMITTED",
            note: "Initial application submitted via official online portal.",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      applicationNumber: application.applicationNumber,
      id: application.id,
    });
  } catch (error: any) {
    console.error("Application submission error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Internal server error occurred while processing application." },
      { status: 500 }
    );
  }
}
