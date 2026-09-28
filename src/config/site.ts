/**
 * World Book of Record Excellence (WBRE)
 * Global Site Configuration & Metadata Constants
 */

export const SITE_CONFIG = {
  name: "WORLD BOOK OF RECORD EXCELLENCE",
  shortName: "WBRE",
  primaryBrandLine: "RECOGNIZING DISTINCTION",
  marketingLine: "WHERE EXCELLENCE BECOMES HISTORY.",
  description:
    "World Book of Record Excellence recognizes and verifies extraordinary achievements through structured standards, evidence-led review and global record recognition.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://wbore.com",
  email: "info@wbore.com",
  emblemPath: "/WBRE.png",
  keywords: [
    "World Book of Record Excellence",
    "WBRE",
    "WBORE",
    "World Records",
    "Record Verification",
    "Achievement Registry",
    "Recognizing Distinction",
    "Official Certification",
  ],
  categories: [
    {
      name: "Sports & Endurance",
      slug: "sports-and-endurance",
      description: "Feats of extraordinary physical capability, endurance, athletic precision, and record-setting sporting milestones.",
      icon: "Trophy",
    },
    {
      name: "Arts & Culture",
      slug: "arts-and-culture",
      description: "Monumental artistic masterworks, cultural preservation achievements, performance literature, and creative distinction.",
      icon: "Palette",
    },
    {
      name: "Science & Technology",
      slug: "science-and-technology",
      description: "Breakthrough inventions, engineering marvels, computational benchmarks, and scientific discoveries.",
      icon: "Atom",
    },
    {
      name: "Education",
      slug: "education",
      description: "Academic excellence, massive educational initiatives, institutional achievements, and pedagogical milestones.",
      icon: "GraduationCap",
    },
    {
      name: "Business & Innovation",
      slug: "business-and-innovation",
      description: "Pioneering enterprise models, industrial speed records, corporate leadership, and disruptive commercial breakthroughs.",
      icon: "TrendingUp",
    },
    {
      name: "Mass Participation",
      slug: "mass-participation",
      description: "Large-scale community assemblies, synchronized global gatherings, and unified collective human efforts.",
      icon: "Users",
    },
    {
      name: "Social Impact",
      slug: "social-impact",
      description: "Humanitarian initiatives, philanthropic milestones, societal transformations, and charitable campaigns.",
      icon: "HeartHandshake",
    },
    {
      name: "Sustainability",
      slug: "sustainability",
      description: "Renewable energy records, ecological preservation projects, zero-waste achievements, and environmental conservation.",
      icon: "Leaf",
    },
    {
      name: "Youth Achievement",
      slug: "youth-achievement",
      description: "Exceptional prodigies, young innovators, and unprecedented achievements accomplished by rising generations.",
      icon: "Sparkles",
    },
    {
      name: "Human Achievement",
      slug: "human-achievement",
      description: "Unique personal accomplishments, remarkable human resilience, memory feats, and historic milestones.",
      icon: "Medal",
    },
    {
      name: "Innovation",
      slug: "innovation",
      description: "Patented solutions, novel structural designs, cutting-edge automated systems, and transformative breakthroughs.",
      icon: "Lightbulb",
    },
    {
      name: "Community Achievement",
      slug: "community-achievement",
      description: "Regional unity initiatives, civic milestones, heritage preservation, and collective civic triumphs.",
      icon: "Building2",
    },
  ],
  verificationPrinciples: [
    {
      number: "01",
      title: "MEASURABLE",
      description: "The result must be quantifiable using a clearly defined metric, international standard unit, or exact verifiable count.",
    },
    {
      number: "02",
      title: "REPEATABLE",
      description: "Another eligible challenger should be able to attempt the record under equivalent rules, conditions, and standards.",
    },
    {
      number: "03",
      title: "VERIFIABLE",
      description: "The achievement must be supported by sufficient documentary, photographic, multi-angle video, and technical evidence.",
    },
    {
      number: "04",
      title: "OBJECTIVE",
      description: "Clear empirical benchmarks must apply. Subjective titles such as 'best', 'most beautiful', or 'most creative' are ineligible.",
    },
    {
      number: "05",
      title: "SAFE",
      description: "Record attempts must comply strictly with international safety protocols and avoid reckless endangerment of human life.",
    },
    {
      number: "06",
      title: "LEGAL",
      description: "All attempts must strictly comply with local, national, and international laws, permits, and regulatory requirements.",
    },
    {
      number: "07",
      title: "ETHICAL",
      description: "WBRE explicitly rejects record concepts involving unnecessary animal harm, human exploitation, or ethical degradation.",
    },
  ],
  howItWorksSteps: [
    {
      step: "01",
      title: "APPLY",
      subtitle: "Submit Proposal",
      description: "Submit your proposed achievement and record concept through our standardized multi-step application portal.",
    },
    {
      step: "02",
      title: "DEFINE",
      subtitle: "Criteria Establishment",
      description: "WBRE adjudicators establish measurable criteria, strict guidelines, measurement protocols, and evidence requirements.",
    },
    {
      step: "03",
      title: "ATTEMPT",
      subtitle: "Execute Attempt",
      description: "Conduct the official record attempt in strict compliance with the issued guidelines before certified witnesses or adjudicators.",
    },
    {
      step: "04",
      title: "VERIFY",
      subtitle: "Evidence Adjudication",
      description: "Comprehensive multi-angle video, logs, expert statements, and witness documentation are examined by the WBRE review board.",
    },
    {
      step: "05",
      title: "REGISTER",
      subtitle: "Official Archival",
      description: "Approved achievements receive official certification, unique Record IDs, and permanent inclusion in the global WBRE registry.",
    },
  ],
} as const;

// Backward-compatible alias for existing imports
export const WBRE_CONFIG = {
  ...SITE_CONFIG,
  url: SITE_CONFIG.url,
};
