import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ContactFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedData = ContactFormSchema.parse(json);

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        country: validatedData.country,
        organization: validatedData.organization || null,
        enquiryType: validatedData.enquiryType,
        message: validatedData.message,
        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      id: enquiry.id,
    });
  } catch (error: any) {
    console.error("Contact form error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
