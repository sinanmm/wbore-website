/**
 * World Book of Record Excellence (WBRE)
 * Permissions & Role-Based Access Control (RBAC) Definitions
 * 
 * Prepares the platform for multi-tier institutional roles:
 * - SUPER_ADMIN: Supreme authority across all desks
 * - ADMIN: Operations manager & registrar
 * - REVIEWER: Technical assessor of submitted evidence
 * - ADJUDICATOR: Certified on-site adjudication official
 * - ORGANIZATION: Corporate or institutional record partners
 * - APPLICANT: Registered public claimants
 */

export const PLATFORM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  REVIEWER: "REVIEWER",
  ADJUDICATOR: "ADJUDICATOR",
  ORGANIZATION: "ORGANIZATION",
  APPLICANT: "APPLICANT",
} as const;

export type PlatformRole = keyof typeof PLATFORM_ROLES;

export const PERMISSIONS = {
  RECORDS_READ: "records:read",
  RECORDS_CREATE: "records:create",
  RECORDS_EDIT: "records:edit",
  RECORDS_PUBLISH: "records:publish",
  RECORDS_REVOKE: "records:revoke",
  
  APPLICATIONS_READ: "applications:read",
  APPLICATIONS_REVIEW: "applications:review",
  APPLICATIONS_APPROVE: "applications:approve",
  APPLICATIONS_REJECT: "applications:reject",
  
  CERTIFICATES_ISSUE: "certificates:issue",
  CERTIFICATES_REVOKE: "certificates:revoke",
  
  OFFICES_MANAGE: "offices:manage",
  USERS_MANAGE: "users:manage",
  AUDIT_LOGS_VIEW: "audit_logs:view",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<PlatformRole, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.RECORDS_READ,
    PERMISSIONS.RECORDS_CREATE,
    PERMISSIONS.RECORDS_EDIT,
    PERMISSIONS.RECORDS_PUBLISH,
    PERMISSIONS.APPLICATIONS_READ,
    PERMISSIONS.APPLICATIONS_REVIEW,
    PERMISSIONS.APPLICATIONS_APPROVE,
    PERMISSIONS.CERTIFICATES_ISSUE,
    PERMISSIONS.OFFICES_MANAGE,
    PERMISSIONS.AUDIT_LOGS_VIEW,
  ],
  REVIEWER: [
    PERMISSIONS.RECORDS_READ,
    PERMISSIONS.APPLICATIONS_READ,
    PERMISSIONS.APPLICATIONS_REVIEW,
  ],
  ADJUDICATOR: [
    PERMISSIONS.RECORDS_READ,
    PERMISSIONS.RECORDS_CREATE,
    PERMISSIONS.APPLICATIONS_READ,
    PERMISSIONS.APPLICATIONS_REVIEW,
  ],
  ORGANIZATION: [
    PERMISSIONS.RECORDS_READ,
    PERMISSIONS.APPLICATIONS_READ,
  ],
  APPLICANT: [
    PERMISSIONS.RECORDS_READ,
  ],
};
