import { z } from "zod";

export const ApplicantTypes = [
  "Individual",
  "Team",
  "Organization",
  "Institution",
  "Company",
  "School",
  "University",
  "Community",
  "Government Entity",
  "Other",
] as const;

export const AttemptTypes = [
  "Individual",
  "Group",
  "Mass Participation",
  "Corporate",
  "Institutional",
] as const;

export const EnquiryTypes = [
  "Record Application",
  "Existing Application",
  "Verification",
  "Adjudication",
  "Corporate Record",
  "Institutional Partnership",
  "Media",
  "General Enquiry",
] as const;

export const RecordStatuses = [
  "ACTIVE",
  "BROKEN",
  "REVOKED",
  "UNDER_REVIEW",
  "ARCHIVED",
] as const;

export const ApplicationStatuses = [
  "SUBMITTED",
  "UNDER_INITIAL_REVIEW",
  "GUIDELINES_ISSUED",
  "ATTEMPT_SCHEDULED",
  "EVIDENCE_SUBMITTED",
  "UNDER_VERIFICATION",
  "APPROVED",
  "REJECTED",
  "MORE_INFORMATION_REQUIRED",
] as const;

export const ApplicationFormSchema = z.object({
  // Step 1: Applicant Information
  applicantType: z.enum(ApplicantTypes, {
    required_error: "Please select an applicant type",
  }),
  applicantName: z.string().min(2, "Name must be at least 2 characters"),
  organizationName: z.string().optional(),
  email: z.string().email("Please enter a valid official email address"),
  phone: z.string().min(6, "Please enter a valid international phone number"),
  country: z.string().min(2, "Country is required"),
  stateRegion: z.string().optional(),
  city: z.string().min(2, "City is required"),

  // Step 2: Record Proposal
  proposedTitle: z.string().min(5, "Proposed record title must be at least 5 characters"),
  categoryName: z.string().min(2, "Please select an achievement category"),
  description: z.string().min(20, "Please provide a detailed description of the achievement (min 20 chars)"),
  measuredMetric: z.string().min(3, "Please define exactly what metric will be measured (time, count, dimension, etc.)"),
  knownBenchmark: z.string().optional(),
  significance: z.string().min(10, "Please explain the cultural, athletic or scientific significance"),

  // Step 3: Attempt Information
  proposedDate: z.string().optional(),
  location: z.string().min(3, "Please specify the venue and city of the attempt"),
  expectedParticipants: z.coerce.number().min(1).default(1),
  attemptType: z.enum(AttemptTypes, {
    required_error: "Please select the attempt classification",
  }),

  // Step 4: Evidence Plan
  evidencePlan: z.array(z.string()).min(1, "Please select at least one planned evidence method"),
  additionalNotes: z.string().optional(),

  // Step 5: Declarations
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge that submission does not guarantee approval" }),
  }),
  acceptGuidelines: z.literal(true, {
    errorMap: () => ({ message: "You must agree to strictly follow WBRE adjudication rules" }),
  }),
  confirmAccuracy: z.literal(true, {
    errorMap: () => ({ message: "You must confirm the submitted information is true and accurate" }),
  }),
});

export type ApplicationFormData = z.infer<typeof ApplicationFormSchema>;

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  organization: z.string().optional(),
  enquiryType: z.enum(EnquiryTypes, {
    required_error: "Please select an enquiry category",
  }),
  message: z.string().min(15, "Please provide a detailed message (minimum 15 characters)"),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

export const AdminLoginSchema = z.object({
  email: z.string().email("Valid institutional email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type AdminLoginData = z.infer<typeof AdminLoginSchema>;

export const RecordFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  holderName: z.string().min(2, "Holder name is required"),
  organizationName: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  location: z.string().min(2, "Location is required"),
  resultValue: z.string().min(1, "Result value is required"),
  measurementUnit: z.string().min(1, "Measurement unit is required"),
  recordDate: z.string().min(1, "Record date is required"),
  verificationDate: z.string().min(1, "Verification date is required"),
  shortDescription: z.string().min(10, "Short summary is required"),
  fullDescription: z.string().min(20, "Detailed description is required"),
  status: z.enum(RecordStatuses).default("ACTIVE"),
  isDemo: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  evidenceSummary: z.string().optional(),
  verificationMethod: z.string().optional(),
  witnessInfo: z.string().optional(),
  adjudicatorInfo: z.string().optional(),
  featuredImage: z.string().optional(),
  videoUrl: z.string().optional(),
  certificateNumber: z.string().optional(),
});

export type RecordFormData = z.infer<typeof RecordFormSchema>;
