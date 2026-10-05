import { api } from './client';
import type { RentalReturn } from '../types/domain';
export const rentalReturnsApi = {
  list: (query?: Record<string, string | number | undefined>) =>
    api.get<{ data: RentalReturn[]; total?: number }>('/rental-returns', query),
  get: (id: number) => api.get<RentalReturn>(`/rental-returns/${id}`),
  create: (body: Partial<RentalReturn>) =>
    api.post<RentalReturn>('/rental-returns', body),
};
