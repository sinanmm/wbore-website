import { NextResponse } from "next/server";
import { ApplicationService } from "@/features/applications/services/application.service";
import { ApplicationFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedData = ApplicationFormSchema.parse(json);

    const application = await ApplicationService.submitApplication(validatedData);

    return NextResponse.json({
      success: true,
      data: {
        id: application.id,
        applicationNumber: application.applicationNumber,
        status: application.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit application" },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("id");
    const email = searchParams.get("email");

    if (!applicationId || !email) {
      return NextResponse.json(
        { success: false, error: "Application ID and Email are required" },
        { status: 400 }
      );
    }

    const application = await ApplicationService.getApplicationStatus(applicationId, email);

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
