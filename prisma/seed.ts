import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding WBRE database...");

  // 1. Seed Admin User
  const passwordHash = await bcrypt.hash("WBRE@Admin2026!", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "info@wbore.com" },
    update: {
      passwordHash,
      role: "SUPER_ADMIN",
    },
    create: {
      email: "info@wbore.com",
      name: "WBRE Chief Adjudicator",
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log("Admin user created:", adminUser.email);

  // 2. Seed Global Offices
  const offices = [
    {
      name: "Dubai Office",
      city: "Dubai",
      country: "United Arab Emirates",
      building: "World Book of Record Excellence",
      street: "Suite #1209, Mai Tower",
      area: "Al Nahda First, Dubai",
      postalCode: "PO Box 98451",
      email: "info@wbore.com",
      phone: "+971 4 288 9450",
      isPrimary: true,
      displayOrder: 1,
    },
    {
      name: "United Kingdom Office",
      city: "London",
      country: "United Kingdom",
      building: "World Book of Record Excellence",
      street: "7274 Edgware Road",
      area: "Marble Arch, London",
      postalCode: "W2 2EG",
      email: "info@wbore.com",
      phone: "+44 20 7946 0912",
      isPrimary: false,
      displayOrder: 2,
    },
    {
      name: "United States Office",
      city: "Pittsfield, Massachusetts",
      country: "USA",
      building: "Harvard Square",
      street: "82 Wendell Ave., STE 100",
      area: "Pittsfield, Massachusetts",
      postalCode: "01201",
      email: "info@wbore.com",
      phone: "+1 (413) 555-0199",
      isPrimary: false,
      displayOrder: 3,
    },
  ];

  for (const office of offices) {
    const existing = await prisma.office.findFirst({
      where: { name: office.name },
    });
    if (!existing) {
      await prisma.office.create({ data: office });
    }
  }
  console.log("Global offices seeded.");

  // 3. Seed Categories
  const categoriesData = [
    {
      name: "Sports & Endurance",
      slug: "sports-and-endurance",
      description: "Feats of extraordinary physical capability, endurance, athletic precision, and record-setting sporting milestones.",
      iconName: "Trophy",
      displayOrder: 1,
    },
    {
      name: "Arts & Culture",
      slug: "arts-and-culture",
      description: "Monumental artistic masterworks, cultural preservation achievements, performance literature, and creative distinction.",
      iconName: "Palette",
      displayOrder: 2,
    },
    {
      name: "Science & Technology",
      slug: "science-and-technology",
      description: "Breakthrough inventions, engineering marvels, computational benchmarks, and scientific discoveries.",
      iconName: "Atom",
      displayOrder: 3,
    },
    {
      name: "Education",
      slug: "education",
      description: "Academic excellence, massive educational initiatives, institutional achievements, and pedagogical milestones.",
      iconName: "GraduationCap",
      displayOrder: 4,
    },
    {
      name: "Business & Innovation",
      slug: "business-and-innovation",
      description: "Pioneering enterprise models, industrial speed records, corporate leadership, and disruptive commercial breakthroughs.",
      iconName: "TrendingUp",
      displayOrder: 5,
    },
    {
      name: "Mass Participation",
      slug: "mass-participation",
      description: "Large-scale community assemblies, synchronized global gatherings, and unified collective human efforts.",
      iconName: "Users",
      displayOrder: 6,
    },
    {
      name: "Social Impact",
      slug: "social-impact",
      description: "Humanitarian initiatives, philanthropic milestones, societal transformations, and charitable campaigns.",
      iconName: "HeartHandshake",
      displayOrder: 7,
    },
    {
      name: "Sustainability",
      slug: "sustainability",
      description: "Renewable energy records, ecological preservation projects, zero-waste achievements, and environmental conservation.",
      iconName: "Leaf",
      displayOrder: 8,
    },
    {
      name: "Youth Achievement",
      slug: "youth-achievement",
      description: "Exceptional prodigies, young innovators, and unprecedented achievements accomplished by rising generations.",
      iconName: "Sparkles",
      displayOrder: 9,
    },
    {
      name: "Human Achievement",
      slug: "human-achievement",
      description: "Unique personal accomplishments, remarkable human resilience, memory feats, and historic milestones.",
      iconName: "Medal",
      displayOrder: 10,
    },
    {
      name: "Innovation",
      slug: "innovation",
      description: "Patented solutions, novel structural designs, cutting-edge automated systems, and transformative breakthroughs.",
      iconName: "Lightbulb",
      displayOrder: 11,
    },
    {
      name: "Community Achievement",
      slug: "community-achievement",
      description: "Regional unity initiatives, civic milestones, heritage preservation, and collective civic triumphs.",
      iconName: "Building2",
      displayOrder: 12,
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const upserted = await prisma.recordCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = upserted.id;
  }
  console.log("Categories seeded.");

  // 4. Seed Demo Record Holders & Organizations
  const holder1 = await prisma.recordHolder.upsert({
    where: { slug: "dr-aaron-vance" },
    update: {},
    create: {
      name: "Dr. Aaron Vance",
      slug: "dr-aaron-vance",
      country: "United Kingdom",
      bio: "Oceanographic researcher and high-altitude endurance navigator with over 15 years of expedition leadership.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      organization: "Institute of Global Polar Research",
    },
  });

  const org1 = await prisma.organization.upsert({
    where: { slug: "global-clean-water-alliance" },
    update: {},
    create: {
      name: "Global Clean Water Alliance",
      slug: "global-clean-water-alliance",
      country: "Switzerland",
      website: "https://example.org/clean-water",
      logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=400&q=80",
      description: "International non-governmental organization working towards universal potable water access.",
    },
  });

  // 5. Seed Demonstration Records (Clearly labeled DEMO RECORD as instructed)
  const demoRecords = [
    {
      recordId: "WBRE-WR-2026-000101",
      slug: "longest-continuous-solar-powered-unmanned-flight",
      title: "Longest Continuous Solar-Powered Unmanned Flight",
      shortDescription: "Continuous autonomous flight powered entirely by onboard photovoltaic solar conversion cells across 14 consecutive diurnal cycles.",
      fullDescription: "On March 14, 2026, the Helios-X autonomous atmospheric research drone completed 336 consecutive hours (14 complete 24-hour cycles) of continuous unassisted flight over the desert testing range in the UAE. The entire flight path and power generation logs were continuously monitored by international telemetry adjudicators.",
      resultValue: "336.5 Hours (14 Days)",
      measurementUnit: "Hours of continuous flight",
      recordDate: new Date("2026-03-14"),
      verificationDate: new Date("2026-03-18"),
      country: "United Arab Emirates",
      location: "Al Ain Aerospace Testing Facility, Abu Dhabi",
      status: "ACTIVE",
      isDemo: true,
      isFeatured: true,
      categoryId: categoryMap["science-and-technology"],
      organizationId: org1.id,
      evidenceSummary: "Dual redundant telemetry logs, GPS flight tracking data, calibrated solar battery output records, and 3 independent witness affidavits.",
      verificationMethod: "Continuous High-Precision Telemetry & Ground Radar Adjudication",
      witnessInfo: "Certified by International Aerospace Verification Council (IAVC)",
      adjudicatorInfo: "Chief Adjudicator Dr. E. Sterling, WBRE Technical Division",
      featuredImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
      galleryJson: JSON.stringify([
        "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517976487588-43e60ac034c5?auto=format&fit=crop&w=1200&q=80",
      ]),
      certificateNumber: "WBRE-CERT-2026-000101",
    },
    {
      recordId: "WBRE-WR-2026-000102",
      slug: "largest-simultaneous-tree-planting-community-initiative",
      title: "Largest Synchronized Native Mangrove Planting Initiative",
      shortDescription: "Over 250,000 native mangrove saplings planted within a strictly verified four-hour window across 12 coastal biosphere zones.",
      fullDescription: "A collective mobilization of 14,800 registered conservation volunteers planted 264,120 indigenous mangrove saplings in certified wetland zones. Each seedling batch was geo-tagged, photographed, and cataloged by certified environmental surveyors.",
      resultValue: "264,120 Saplings",
      measurementUnit: "Individually verified native saplings",
      recordDate: new Date("2026-02-21"),
      verificationDate: new Date("2026-02-25"),
      country: "United Kingdom",
      location: "Coastal Biosphere Reserve, Devon",
      status: "ACTIVE",
      isDemo: true,
      isFeatured: true,
      categoryId: categoryMap["sustainability"],
      holderId: holder1.id,
      evidenceSummary: "Drone aerial mapping before and after, barcode-scanned sapling registry, and 48 independent sector marshals.",
      verificationMethod: "Grid-Based Physical Barcode Adjudication & Drone Photogrammetry",
      witnessInfo: "National Forestry Society & Royal Geographical Observers",
      adjudicatorInfo: "WBRE Senior Adjudication Officer M. Chen",
      featuredImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      galleryJson: JSON.stringify([
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      ]),
      certificateNumber: "WBRE-CERT-2026-000102",
    },
    {
      recordId: "WBRE-WR-2026-000103",
      slug: "highest-altitude-acoustic-symphonic-performance",
      title: "Highest Altitude Live Acoustic Symphonic Performance",
      shortDescription: "A full 40-piece acoustic philharmonic orchestra performed an original 4-movement symphony at an altitude of 5,180 meters above sea level.",
      fullDescription: "Conducted under extreme atmospheric pressure and sub-zero conditions, forty professional orchestral musicians performed Beethoven's 9th Symphony and an original composition without amplified electronic assistance at 5,180m elevation. Sound pressure levels and biometric vitals were recorded continuously.",
      resultValue: "5,180 Meters Elevation",
      measurementUnit: "Barometric & GPS Altitude above Mean Sea Level",
      recordDate: new Date("2026-01-18"),
      verificationDate: new Date("2026-01-22"),
      country: "United States",
      location: "High Altitude Research Plateau, Colorado",
      status: "ACTIVE",
      isDemo: true,
      isFeatured: true,
      categoryId: categoryMap["arts-and-culture"],
      holderId: holder1.id,
      evidenceSummary: "Calibrated multi-track audio master, 360-degree 8K video documentation, barometric altimeter logs, and weather station data.",
      verificationMethod: "Barometric Sensor Calibrated Altitude & Acoustic Spectrum Analysis",
      witnessInfo: "International Alpine Federation & Acoustical Society Examiners",
      adjudicatorInfo: "WBRE Adjudication Board - Cultural & Arts Division",
      featuredImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
      galleryJson: JSON.stringify([
        "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
      ]),
      certificateNumber: "WBRE-CERT-2026-000103",
    },
  ];

  for (const recordData of demoRecords) {
    const rec = await prisma.record.upsert({
      where: { recordId: recordData.recordId },
      update: recordData,
      create: recordData,
    });

    // Create record history entry
    const historyExists = await prisma.recordHistory.findFirst({
      where: { recordId: rec.id },
    });
    if (!historyExists) {
      await prisma.recordHistory.create({
        data: {
          recordId: rec.id,
          eventDate: rec.recordDate,
          eventType: "ESTABLISHED",
          title: "Record Formally Established",
          description: `Initial achievement verified and registered under WBRE standard evaluation protocols.`,
        },
      });
    }

    // Generate QR verification data URL
    const qrUrl = `https://wbre.org/verify/${recordData.certificateNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      color: {
        dark: "#07192F",
        light: "#FFFFFF",
      },
      margin: 1,
      width: 256,
    });

    // Create Certificate
    await prisma.certificate.upsert({
      where: { certificateNumber: recordData.certificateNumber },
      update: {
        qrCodeDataUrl,
      },
      create: {
        certificateNumber: recordData.certificateNumber,
        recordId: rec.id,
        recipientName: holder1.name,
        recordTitle: rec.title,
        achievementResult: rec.resultValue,
        achievementDate: rec.recordDate,
        location: `${rec.location}, ${rec.country}`,
        verificationCode: recordData.certificateNumber.replace("WBRE-CERT-", ""),
        qrCodeDataUrl,
        status: "ACTIVE",
      },
    });
  }

  // 6. Seed Sample Applications
  const sampleApp = await prisma.application.upsert({
    where: { applicationNumber: "WBRE-APP-2026-000001" },
    update: {},
    create: {
      applicationNumber: "WBRE-APP-2026-000001",
      applicantType: "Institution",
      applicantName: "Cambridge Advanced Robotics Lab",
      organizationName: "University Research Consortium",
      email: "robotics@example.ac.uk",
      phone: "+44 1223 765000",
      country: "United Kingdom",
      city: "Cambridge",
      proposedTitle: "Fastest Sub-Millimeter Micro-Surgical Autonomous Robot",
      categoryName: "Science & Technology",
      description: "Proposed autonomous micro-surgical suture execution benchmark measuring speed and precision down to 50-micron tolerance.",
      measuredMetric: "Precision sutures completed per minute at 50-micron scale",
      knownBenchmark: "Previous laboratory benchmark was 18 sutures/min",
      significance: "Demonstrates unprecedented micro-robotic surgical accuracy for future non-invasive neurological procedures.",
      location: "Cambridge Biomedical Campus",
      expectedParticipants: 12,
      attemptType: "Institutional",
      evidencePlan: JSON.stringify([
        "High-Speed Microscopic 4K Video",
        "Sensor Telemetry Logs",
        "Independent Surgical Panel Witnesses",
      ]),
      status: "UNDER_INITIAL_REVIEW",
    },
  });

  const appHistory = await prisma.applicationStatusHistory.findFirst({
    where: { applicationId: sampleApp.id },
  });
  if (!appHistory) {
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: sampleApp.id,
        status: "SUBMITTED",
        note: "Initial proposal submitted via official WBRE online portal.",
      },
    });
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: sampleApp.id,
        status: "UNDER_INITIAL_REVIEW",
        note: "Assigned to Science & Technology Adjudications Committee.",
      },
    });
  }

  // 7. Seed Website Settings
  const settings = [
    { key: "SITE_TITLE", value: "World Book of Record Excellence" },
    { key: "PRIMARY_BRAND_LINE", value: "RECOGNIZING DISTINCTION" },
    { key: "MARKETING_HEADLINE", value: "WHERE EXCELLENCE BECOMES HISTORY." },
    { key: "MAINTENANCE_MODE", value: "false" },
    { key: "APPLICATIONS_OPEN", value: "true" },
  ];

  for (const set of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: set.key },
      update: { value: set.value },
      create: set,
    });
  }

  console.log("Database seeded successfully with institutional demo data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
