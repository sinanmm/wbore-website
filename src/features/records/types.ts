import { Record, RecordCategory, RecordHolder, Organization, Certificate } from "@prisma/client";

export type RecordWithDetails = Record & {
  category: RecordCategory;
  holder?: RecordHolder | null;
  organization?: Organization | null;
  certificates?: Certificate[];
};

export interface RecordQueryParams {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}
