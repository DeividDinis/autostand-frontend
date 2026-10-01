import { api } from './client';
import type { AuthUser } from '../types/domain';
import { isOfflineMode, offlineLogin, offlineMe } from './offline-auth';
import { storage } from '../utils/storage';

export type AuthLoginResponse = {
  accessToken?: string;
  token?: string;
  user?: AuthUser;
};

export const authApi = {
  async login(body: { email: string; password: string }): Promise<AuthLoginResponse> {
    if (isOfflineMode()) return offlineLogin(body.email, body.password);
    return api.post<AuthLoginResponse>('/auth/login', body);
  },

  async me(): Promise<AuthUser> {
    if (isOfflineMode()) return offlineMe(storage.getToken());
    return api.get<AuthUser>('/auth/me');
  },
};
