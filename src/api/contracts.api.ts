import { api } from './client';
import type { Contract } from '../types/domain';

export const contractsApi = {
  list: (query?: Record<string, string | number | undefined>) =>
    api.get<{ data: Contract[]; total?: number }>('/contracts', query),
  get: (id: number) => api.get<Contract>(`/contracts/${id}`),
  create: (body: unknown) => {
    const path = import.meta.env.VITE_CONTRACT_CREATE_PATH as
      string | undefined;
    if (!path) {
      throw new Error(
        'Endpoint de criação de contrato não configurado. Defina VITE_CONTRACT_CREATE_PATH conforme o backend real.'
      );
    }
    return api.post<Contract>(path, body);
  },
};
