import { api } from './client';
import type { Payment } from '../types/domain';
export const paymentsApi = {
  list: (query?: Record<string, string | number | undefined>) =>
    api.get<{ data: Payment[]; total?: number }>('/payments', query),
  get: (id: number) => api.get<Payment>(`/payments/${id}`),
  create: (body: Partial<Payment>) => api.post<Payment>('/payments', body),
};
