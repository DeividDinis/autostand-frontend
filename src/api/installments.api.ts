import { api } from './client';
import type { Installment } from '../types/domain';
export const installmentsApi = {
  list: (query?: Record<string, string | number | undefined>) =>
    api.get<{ data: Installment[]; total?: number }>('/installments', query),
  get: (id: number) => api.get<Installment>(`/installments/${id}`),
  create: (body: Partial<Installment>) =>
    api.post<Installment>('/installments', body),
};
