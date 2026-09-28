import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify, generateRecordNumber, generateCertificateNumber } from "@/lib/utils";
import QRCode from "qrcode";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const {
      title,
      categoryId,
      holderName,
      organizationName,
      country,
      location,
      resultValue,
      measurementUnit,
      recordDate,
      verificationDate,
      shortDescription,
      fullDescription,
      status = "ACTIVE",
      isDemo = false,
      isFeatured = false,
      evidenceSummary,
      verificationMethod,
      witnessInfo,
      adjudicatorInfo,
      featuredImage,
      videoUrl,
    } = json;

    if (!title || !categoryId || !resultValue || !country || !location) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const count = await prisma.record.count();
    const recordId = generateRecordNumber(count + 101, new Date().getFullYear());
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Math.floor(Math.random() * 900) + 100}`;
    const certificateNumber = generateCertificateNumber(count + 101, new Date().getFullYear());

    // Create or find holder
    let holderId = null;
    if (holderName) {
      const holderSlug = slugify(holderName);
      const holder = await prisma.recordHolder.upsert({
        where: { slug: holderSlug },
        update: {},
        create: {
          name: holderName,
          slug: holderSlug,
          country,
        },
      });
      holderId = holder.id;
    }

    // Create or find organization
    let organizationId = null;
    if (organizationName) {
      const orgSlug = slugify(organizationName);
      const org = await prisma.organization.upsert({
        where: { slug: orgSlug },
        update: {},
        create: {
          name: organizationName,
          slug: orgSlug,
          country,
        },
      });
      organizationId = org.id;
    }

    const record = await prisma.record.create({
      data: {
        recordId,
        slug,
        title,
        shortDescription: shortDescription || title,
        fullDescription: fullDescription || shortDescription || title,
        resultValue,
        measurementUnit: measurementUnit || "Units",
        recordDate: new Date(recordDate || Date.now()),
        verificationDate: new Date(verificationDate || Date.now()),
        country,
        location,
        status,
        isDemo: Boolean(isDemo),
        isFeatured: Boolean(isFeatured),
        categoryId,
        holderId,
        organizationId,
        evidenceSummary,
        verificationMethod,
        witnessInfo,
        adjudicatorInfo,
        featuredImage,
        videoUrl,
        certificateNumber,
        historyEntries: {
          create: {
            eventDate: new Date(recordDate || Date.now()),
            eventType: "ESTABLISHED",
            title: "Record Formally Established",
            description: `Adjudicated and ratified under official WBRE protocols.`,
          },
        },
      },
    });

    // Generate QR Code for certificate
    const qrUrl = `https://wbre.org/verify/${certificateNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      color: { dark: "#07192F", light: "#FFFFFF" },
      margin: 1,
      width: 256,
    });

    // Create Certificate
    await prisma.certificate.create({
      data: {
        certificateNumber,
        recordId: record.id,
        recipientName: holderName || organizationName || "Official Laureate",
        recordTitle: record.title,
        achievementResult: record.resultValue,
        achievementDate: record.recordDate,
        location: `${location}, ${country}`,
        verificationCode: certificateNumber.replace("WBRE-CERT-", ""),
        qrCodeDataUrl,
        status: "ACTIVE",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "CREATE_RECORD",
        entity: "Record",
        entityId: record.id,
        details: `Created and certified record ${record.recordId}: "${record.title}"`,
      },
    });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error("Create record error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create record" }, { status: 500 });
  }
}
