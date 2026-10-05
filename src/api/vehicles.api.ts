import { api } from './client';
import type { Vehicle } from '../types/domain';
import { isOfflineMode } from './offline-auth';
import { offlineVehicle, offlineVehicleList } from './offline-vehicles';
export const vehiclesApi = {
  list: (query: Record<string, string | number | undefined>) =>
    api.get<{ data: Vehicle[]; total?: number }>('/vehicles', query),
  get: (id: number) => api.get<Vehicle>(`/vehicles/${id}`),
  create: (body: Partial<Vehicle>) => api.post<Vehicle>('/vehicles', body),
  update: (id: number, body: Partial<Vehicle>) =>
    api.patch<Vehicle>(`/vehicles/${id}`, body),
  async listPublicAvailable(
    query: Record<string, string | number | undefined>
  ) {
    if (isOfflineMode()) return offlineVehicleList();
    return api.publicGet<{ data: Vehicle[]; total?: number }>('/vehicles', {
      ...query,
      status: 'AVAILABLE',
    });
  },
  async getPublic(id: number) {
    if (isOfflineMode()) return offlineVehicle(id);
    return api.publicGet<Vehicle>(`/vehicles/${id}`);
  },
};
