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
    {
      name: "Humanitarian Service",
      slug: "humanitarian-service",
      description: "Lifelong philanthropic service, international crisis relief, disaster recovery, and sustained cross-border humanitarian missions.",
      iconName: "HeartHandshake",
      displayOrder: 13,
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

  // 4. Seed Verified Record Holders & Organizations
  const holders = [
    {
      name: "Dr. Alexander Bennett",
      slug: "dr-alexander-bennett",
      country: "United States",
      bio: "Distinguished researcher in cognitive computing and artificial intelligence neural architectures, advancing responsible next-generation technologies.",
      photoUrl: "/reccords/63cd1984-b809-412d-93ff-c15bf4604fbf.png",
      organization: "Institute of Advanced Computing, Boston",
    },
    {
      name: "Sophia Williams",
      slug: "sophia-williams",
      country: "Canada",
      bio: "Social innovator and civic development leader whose nationwide youth programs and community resilience hubs empower tens of thousands.",
      photoUrl: "/reccords/8881130c-399b-4c23-ae19-35936dcb8171.png",
      organization: "Community Resilience Network",
    },
    {
      name: "Olivia Grace Morgan",
      slug: "olivia-grace-morgan",
      country: "France",
      bio: "Acclaimed international contemporary artist and sculptor pioneering monumental multi-sensory exhibitions that connect cultures worldwide.",
      photoUrl: "/reccords/9b54ab05-dd14-41e9-b9c3-10f4858f4c91.png",
      organization: "Paris Contemporary Arts Foundation",
    },
    {
      name: "Lucas James Parker",
      slug: "lucas-james-parker",
      country: "Australia",
      bio: "Youth pioneer and clean-tech environmental engineer inventing solar biosensing water purification systems for remote communities.",
      photoUrl: "/reccords/e93d10d2-99c4-4e2b-8c79-97bc6cdfc99d.png",
      organization: "Clean Horizons Youth Tech",
    },
    {
      name: "Charlotte Elizabeth Hayes",
      slug: "charlotte-elizabeth-hayes",
      country: "Switzerland",
      bio: "Renowned international humanitarian director who has coordinated life-saving healthcare and crisis relief aid across 28 vulnerable nations.",
      photoUrl: "/reccords/4a0842d3-751c-4787-9d53-db07966fdab9.png",
      organization: "Global Humanitarian Initiative",
    },
  ];

  const holderMap: Record<string, string> = {};
  for (const h of holders) {
    const upserted = await prisma.recordHolder.upsert({
      where: { slug: h.slug },
      update: h,
      create: h,
    });
    holderMap[h.slug] = upserted.id;
  }
  console.log("Record holders seeded.");

  const org1 = await prisma.organization.upsert({
    where: { slug: "global-excellence-consortium" },
    update: {},
    create: {
      name: "Global Excellence Consortium",
      slug: "global-excellence-consortium",
      country: "Switzerland",
      website: "https://wbore.com",
      logoUrl: "/wbre-logo.png",
      description: "International accreditation and archival body overseeing standards of human achievement.",
    },
  });

  // 5. Seed Authenticated Registry Records (Matching official presentation certificates in public/reccords)
  const officialRecords = [
    {
      recordId: "WBRE-TEC-2026-000101",
      slug: "outstanding-achievement-in-artificial-intelligence-innovation",
      title: "Outstanding Achievement in Artificial Intelligence Innovation",
      shortDescription: "Pioneering cognitive neural architecture and responsible autonomous computing systems evaluated and ratified under official WBRE protocols.",
      fullDescription: "Dr. Alexander Bennett has been officially recognized by the World Book of Record Excellence for outstanding achievements in Artificial Intelligence innovation. This exceptional achievement demonstrates remarkable innovation, leadership, and contribution to advancing technology for a better world through high-efficiency autonomous neural computation and verifiable decision boundaries.",
      resultValue: "Cognitive Neural Architecture & AI Innovation Benchmark",
      measurementUnit: "Algorithmic Efficiency & Deployment Scale",
      recordDate: new Date("2026-09-20"),
      verificationDate: new Date("2026-09-22"),
      country: "United States",
      location: "Boston, Massachusetts",
      status: "ACTIVE",
      isDemo: false,
      isFeatured: true,
      categoryId: categoryMap["science-and-technology"],
      holderId: holderMap["dr-alexander-bennett"],
      organizationId: org1.id,
      evidenceSummary: "Audited neural training latency telemetry, verified institutional deployment logs across 12 research universities, and multi-round peer adjudication.",
      verificationMethod: "Continuous Algorithmic Telemetry & Institutional Peer Verification",
      witnessInfo: "International Council of Computing Engineers & Global AI Forum",
      adjudicatorInfo: "Sir Richard Coleman, Chief Verification Officer & Dr. Isabella Martinez, Chairperson",
      featuredImage: "/reccords/63cd1984-b809-412d-93ff-c15bf4604fbf.png",
      galleryJson: JSON.stringify([
        "/reccords/63cd1984-b809-412d-93ff-c15bf4604fbf.png",
      ]),
      certificateNumber: "WBRE-CERT-2026-000101",
    },
    {
      recordId: "WBRE-SOC-2024-000105",
      slug: "exceptional-contribution-to-community-development",
      title: "Exceptional Contribution to Community Development",
      shortDescription: "Nationwide youth empowerment and civic development framework establishing 42 sustainable community resilience centers.",
      fullDescription: "Sophia Williams has been officially recognized by the World Book of Record Excellence for exceptional contribution to community development. This outstanding achievement demonstrates exceptional initiative, positive social impact, and dedication to building stronger communities for a better world through inclusive vocational training and youth leadership.",
      resultValue: "100,000+ Beneficiaries Across 42 Community Hubs",
      measurementUnit: "Certified Community Hubs & Direct Youth Beneficiaries",
      recordDate: new Date("2024-12-07"),
      verificationDate: new Date("2024-12-10"),
      country: "Canada",
      location: "Toronto, Ontario",
      status: "ACTIVE",
      isDemo: false,
      isFeatured: true,
      categoryId: categoryMap["social-impact"],
      holderId: holderMap["sophia-williams"],
      organizationId: org1.id,
      evidenceSummary: "Certified municipal registry records, audited attendance registries from 42 community hubs, and independent civic audit reports.",
      verificationMethod: "Municipal Census Cross-Referencing & Physical On-Site Adjudication",
      witnessInfo: "North American Community Development Council & Canadian Civic Observers",
      adjudicatorInfo: "Sir Richard Coleman, Chief Verification Officer & Dr. Isabella Martinez, Chairperson",
      featuredImage: "/reccords/8881130c-399b-4c23-ae19-35936dcb8171.png",
      galleryJson: JSON.stringify([
        "/reccords/8881130c-399b-4c23-ae19-35936dcb8171.png",
      ]),
      certificateNumber: "WBRE-CERT-2024-000105",
    },
    {
      recordId: "WBRE-ART-2024-000107",
      slug: "outstanding-achievement-in-contemporary-creative-arts",
      title: "Outstanding Achievement in Contemporary Creative Arts",
      shortDescription: "Landmark multi-sensory international art exhibition uniting global audiences through large-scale kinetic and cultural fine art.",
      fullDescription: "Olivia Grace Morgan has been officially recognized by the World Book of Record Excellence for outstanding achievement in contemporary creative arts. This recognition acknowledges an exceptional contribution to the advancement of contemporary creative arts, inspiring positive global impact through creativity, culture, and the arts.",
      resultValue: "520,000 Verified Attendees Across 36 Nations",
      measurementUnit: "Authenticated Museum Turnstile Visitors & Curatorial Reach",
      recordDate: new Date("2024-10-12"),
      verificationDate: new Date("2024-10-15"),
      country: "France",
      location: "Paris",
      status: "ACTIVE",
      isDemo: false,
      isFeatured: true,
      categoryId: categoryMap["arts-and-culture"],
      holderId: holderMap["olivia-grace-morgan"],
      organizationId: org1.id,
      evidenceSummary: "Electronic museum turnstile ticketing records, curatorial accreditation from the Ministry of Culture, and comprehensive catalog documentation.",
      verificationMethod: "Electronic Turnstile Telemetry & International Curatorial Review",
      witnessInfo: "European Fine Arts Directorate & UNESCO Cultural Observers",
      adjudicatorInfo: "Dr. Marcus L. Chen, Chief Verification Officer & Prof. Eleanor Whitaker, President",
      featuredImage: "/reccords/9b54ab05-dd14-41e9-b9c3-10f4858f4c91.png",
      galleryJson: JSON.stringify([
        "/reccords/9b54ab05-dd14-41e9-b9c3-10f4858f4c91.png",
      ]),
      certificateNumber: "WBRE-CERT-2024-000107",
    },
    {
      recordId: "WBRE-YTH-2025-000109",
      slug: "exceptional-youth-achievement-in-innovation-leadership",
      title: "Exceptional Youth Achievement in Innovation & Leadership",
      shortDescription: "Inventive youth-led clean-water engineering initiative deploying 15 autonomous solar biosensing purification systems.",
      fullDescription: "Lucas James Parker has been officially recognized by the World Book of Record Excellence for exceptional youth achievement in innovation and leadership. This recognition is in appreciation of his outstanding initiative, leadership, and positive impact in empowering young people and advancing a brighter future through innovation.",
      resultValue: "15 Autonomous Biosensing Water Filtration Micro-Plants",
      measurementUnit: "Operational Solar-Powered Clean Water Micro-Plants",
      recordDate: new Date("2025-03-21"),
      verificationDate: new Date("2025-03-24"),
      country: "Australia",
      location: "Sydney, New South Wales",
      status: "ACTIVE",
      isDemo: false,
      isFeatured: true,
      categoryId: categoryMap["youth-achievement"],
      holderId: holderMap["lucas-james-parker"],
      organizationId: org1.id,
      evidenceSummary: "IoT telemetry sensor logs, certified water purity microbiological assays, and local council deployment verification affidavits.",
      verificationMethod: "In-Situ Sensor Telemetry & Certified Laboratory Water Assay",
      witnessInfo: "Australasian Youth Innovation Council & Clean Waters Engineering Board",
      adjudicatorInfo: "Dr. Marcus L. Chen, Chief Verification Officer & Prof. Eleanor Whitaker, President",
      featuredImage: "/reccords/e93d10d2-99c4-4e2b-8c79-97bc6cdfc99d.png",
      galleryJson: JSON.stringify([
        "/reccords/e93d10d2-99c4-4e2b-8c79-97bc6cdfc99d.png",
      ]),
      certificateNumber: "WBRE-CERT-2025-000109",
    },
    {
      recordId: "WBRE-HUM-2024-000110",
      slug: "distinguished-humanitarian-leadership-global-service",
      title: "Distinguished Humanitarian Leadership & Global Service",
      shortDescription: "Distinguished cross-border humanitarian coordination delivering emergency healthcare, essential aid, and relief to over 250,000 vulnerable individuals.",
      fullDescription: "Charlotte Elizabeth Hayes has been officially recognized by the World Book of Record Excellence for distinguished humanitarian leadership and global service. In recognition of exceptional humanitarian leadership, outstanding contribution to global communities, and a lasting positive impact on people's lives around the world.",
      resultValue: "250,000+ Individuals Aided Across 28 Nations",
      measurementUnit: "Documented Medical & Emergency Aid Deliveries",
      recordDate: new Date("2024-12-10"),
      verificationDate: new Date("2024-12-14"),
      country: "Switzerland",
      location: "Geneva",
      status: "ACTIVE",
      isDemo: false,
      isFeatured: true,
      categoryId: categoryMap["humanitarian-service"] || categoryMap["social-impact"],
      holderId: holderMap["charlotte-elizabeth-hayes"],
      organizationId: org1.id,
      evidenceSummary: "Cross-border humanitarian aid manifests, verified clinical reports, international NGO audit certifications, and UN-affiliated observer documentation.",
      verificationMethod: "Multi-National Aid Consignment Audit & On-Ground NGO Verification",
      witnessInfo: "International Humanitarian Standards Committee & Geneva Diplomatic Corps Observers",
      adjudicatorInfo: "Dr. Marcus L. Chen, Chief Verification Officer & Prof. Eleanor Whitaker, President",
      featuredImage: "/reccords/4a0842d3-751c-4787-9d53-db07966fdab9.png",
      galleryJson: JSON.stringify([
        "/reccords/4a0842d3-751c-4787-9d53-db07966fdab9.png",
      ]),
      certificateNumber: "WBRE-CERT-2024-000110",
    },
  ];

  // Clean up any legacy demo records and certificates if they exist
  await prisma.certificate.deleteMany({});
  await prisma.recordHistory.deleteMany({});
  await prisma.record.deleteMany({});

  for (const recordData of officialRecords) {
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
          title: "Record Formally Established & Ratified",
          description: `Achievement verified and permanently registered under official WBRE evaluation protocols.`,
        },
      });
    }

    // Generate QR verification data URL
    const qrUrl = `https://wbore.com/verify/${recordData.certificateNumber}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      color: {
        dark: "#07192F",
        light: "#FFFFFF",
      },
      margin: 1,
      width: 256,
    });

    // Find recipient name
    const holder = holders.find((h) => holderMap[h.slug] === recordData.holderId);

    // Create Certificate
    await prisma.certificate.upsert({
      where: { certificateNumber: recordData.certificateNumber },
      update: {
        qrCodeDataUrl,
        recordId: rec.id,
        recipientName: holder?.name || "Official Laureate",
        recordTitle: rec.title,
        achievementResult: rec.resultValue,
        achievementDate: rec.recordDate,
        location: `${rec.location}, ${rec.country}`,
        verificationCode: recordData.certificateNumber.replace("WBRE-CERT-", ""),
      },
      create: {
        certificateNumber: recordData.certificateNumber,
        recordId: rec.id,
        recipientName: holder?.name || "Official Laureate",
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
