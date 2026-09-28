import { NextResponse } from "next/server";
import { VerificationService } from "@/features/verification/services/verification.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("code") || searchParams.get("cert");

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Verification code or certificate number required" },
        { status: 400 }
      );
    }

    const certificate = await VerificationService.verifyCertificate(query);

    if (!certificate) {
      return NextResponse.json(
        { success: false, verified: false, message: "No matching record or certificate found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      data: {
        certificateNumber: certificate.certificateNumber,
        verificationCode: certificate.verificationCode,
        issueDate: certificate.issueDate,
        status: certificate.status,
        record: certificate.record,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}
