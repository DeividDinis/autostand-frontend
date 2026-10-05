import { api } from './client';
import type { Client } from '../types/domain';
export const clientsApi = {
  list: (query: Record<string, string | number | undefined>) =>
    api.get<{ data: Client[]; total?: number }>('/clients', query),
  get: (id: number) => api.get<Client>(`/clients/${id}`),
  create: (body: Partial<Client>) => api.post<Client>('/clients', body),
  update: (id: number, body: Partial<Client>) =>
    api.patch<Client>(`/clients/${id}`, body),
};
