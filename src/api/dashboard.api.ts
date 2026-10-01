import { api } from './client';
import type { DashboardData } from '../types/domain';
import { isOfflineMode } from './offline-auth';
import { getOfflineDashboard } from './offline-dashboard';
import { storage } from '../utils/storage';
import { offlineMe } from './offline-auth';

export const dashboardApi = {
  get: async (query?: { standId?: number; from?: string; to?: string }) => {
    if (isOfflineMode()) {
      const user = offlineMe(storage.getToken());
      return getOfflineDashboard(user.role);
    }
    return api.get<DashboardData>('/dashboard', query);
  },
};
