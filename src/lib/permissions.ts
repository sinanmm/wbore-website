import { PlatformRole, Permission, ROLE_PERMISSIONS } from "@/config/permissions";

/**
 * Validates if a role has the specified permission.
 */
export function hasPermission(role: string, permission: Permission): boolean {
  const userRole = role as PlatformRole;
  const permissions = ROLE_PERMISSIONS[userRole];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Validates if a role has all of the specified permissions.
 */
export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Validates if a role has at least one of the specified permissions.
 */
export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
