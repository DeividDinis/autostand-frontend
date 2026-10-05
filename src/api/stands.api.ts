import { api } from './client';
import type { Stand } from '../types/domain';
export const standsApi = {
  list: (query?: Record<string, string | number | undefined>) =>
    api.get<{ data: Stand[]; total?: number }>('/stands', query),
  get: (id: number) => api.get<Stand>(`/stands/${id}`),
  create: (body: Partial<Stand>) => api.post<Stand>('/stands', body),
  update: (id: number, body: Partial<Stand>) =>
    api.patch<Stand>(`/stands/${id}`, body),
};
