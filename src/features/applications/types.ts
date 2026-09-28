import { Application, ApplicationStatusHistory } from "@prisma/client";

export type ApplicationWithHistory = Application & {
  statusHistory?: ApplicationStatusHistory[];
};

export interface ApplicationQueryParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}
