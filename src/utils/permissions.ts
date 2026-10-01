import type { AuthUser, Role } from '../types/domain';

export const isAdminGlobal = (user?: AuthUser | null) => user?.role === 'ADMIN_GLOBAL';
export const isMiniAdmin = (user?: AuthUser | null) => user?.role === 'MINI_ADMIN';
export const isGestor = (user?: AuthUser | null) => user?.role === 'GESTOR';
export const isClient = (user?: AuthUser | null) => user?.role === 'CLIENTE';

export const canCreateVehicle = (user?: AuthUser | null) => ['ADMIN_GLOBAL', 'MINI_ADMIN'].includes(user?.role ?? '');
export const canManageStand = (user?: AuthUser | null, standId?: number) => {
  if (isAdminGlobal(user)) return true;
  return isMiniAdmin(user) && (standId === undefined || user?.standIds.includes(standId));
};
export const canApproveTransfer = (user?: AuthUser | null) => isAdminGlobal(user);
export const canManageTransfers = (user?: AuthUser | null) => ['ADMIN_GLOBAL', 'MINI_ADMIN'].includes(user?.role ?? '');
export const canManageUsers = (user?: AuthUser | null) => isAdminGlobal(user);
export const canAccessReports = (user?: AuthUser | null) => isAdminGlobal(user);
export const canAccessAudit = (user?: AuthUser | null) => isAdminGlobal(user);
export const allowedStaffRoles: Role[] = ['ADMIN_GLOBAL', 'MINI_ADMIN', 'GESTOR'];
