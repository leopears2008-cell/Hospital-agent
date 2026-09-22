export type UserRole = 'patient' | 'doctor' | 'admin' | 'super_admin';

export interface Permission {
  resource: 'appointments' | 'hospitals' | 'doctors' | 'users' | 'audit_logs' | 'ai_assistant';
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  patient: [
    { resource: 'appointments', action: 'create' },
    { resource: 'appointments', action: 'read' },
    { resource: 'appointments', action: 'update' }, // Can cancel their own
    { resource: 'hospitals', action: 'read' },
    { resource: 'doctors', action: 'read' },
    { resource: 'ai_assistant', action: 'execute' },
  ],
  doctor: [
    { resource: 'appointments', action: 'read' },
    { resource: 'appointments', action: 'update' }, // Can confirm/complete
    { resource: 'hospitals', action: 'read' },
    { resource: 'doctors', action: 'read' },
    { resource: 'users', action: 'read' },
    { resource: 'ai_assistant', action: 'execute' },
  ],
  admin: [
    { resource: 'appointments', action: 'create' },
    { resource: 'appointments', action: 'read' },
    { resource: 'appointments', action: 'update' },
    { resource: 'appointments', action: 'delete' },
    { resource: 'hospitals', action: 'create' },
    { resource: 'hospitals', action: 'read' },
    { resource: 'hospitals', action: 'update' },
    { resource: 'hospitals', action: 'delete' },
    { resource: 'doctors', action: 'create' },
    { resource: 'doctors', action: 'read' },
    { resource: 'doctors', action: 'update' },
    { resource: 'doctors', action: 'delete' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'audit_logs', action: 'read' },
    { resource: 'ai_assistant', action: 'execute' },
  ],
  super_admin: [
    { resource: 'appointments', action: 'create' },
    { resource: 'appointments', action: 'read' },
    { resource: 'appointments', action: 'update' },
    { resource: 'appointments', action: 'delete' },
    { resource: 'hospitals', action: 'create' },
    { resource: 'hospitals', action: 'read' },
    { resource: 'hospitals', action: 'update' },
    { resource: 'hospitals', action: 'delete' },
    { resource: 'doctors', action: 'create' },
    { resource: 'doctors', action: 'read' },
    { resource: 'doctors', action: 'update' },
    { resource: 'doctors', action: 'delete' },
    { resource: 'users', action: 'create' },
    { resource: 'users', action: 'read' },
    { resource: 'users', action: 'update' },
    { resource: 'users', action: 'delete' },
    { resource: 'audit_logs', action: 'read' },
    { resource: 'ai_assistant', action: 'execute' },
  ],
};

export function hasPermission(role: UserRole | string, resource: Permission['resource'], action: Permission['action']): boolean {
  const normalizedRole = (role as UserRole) || 'patient';
  const permissions = ROLE_PERMISSIONS[normalizedRole] || ROLE_PERMISSIONS['patient'];
  return permissions.some(p => p.resource === resource && p.action === action);
}

export function isValidRole(role: string): role is UserRole {
  return ['patient', 'doctor', 'admin', 'super_admin'].includes(role);
}
