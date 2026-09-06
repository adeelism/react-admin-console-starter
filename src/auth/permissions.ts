export type Permission = 'users:read' | 'users:write' | 'audit-log:read';

export type Role = 'admin' | 'auditor' | 'viewer';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: ['users:read', 'users:write', 'audit-log:read'],
  auditor: ['users:read', 'audit-log:read'],
  viewer: ['users:read'],
};

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}
