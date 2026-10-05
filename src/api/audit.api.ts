import { api } from './client';
import type { AuditLog } from '../types/domain';
export const auditApi = {
  list: (q?: Record<string, string | number | undefined>) =>
    api.get<{ data: AuditLog[]; total?: number }>('/audit-logs', q),
  get: (id: number) => api.get<AuditLog>(`/audit-logs/${id}`),
};
