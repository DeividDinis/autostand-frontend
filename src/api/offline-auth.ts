import type { AuthUser, Role } from '../types/domain';

export type OfflineCredential = {
  name: string;
  email: string;
  password: string;
  role: Role;
  standIds: number[];
};

export const OFFLINE_CREDENTIALS: OfflineCredential[] = [
  {
    name: 'Admin Superior',
    email: 'admin@autostand.local',
    password: 'Admin@123',
    role: 'ADMIN_GLOBAL',
    standIds: [1, 2, 3],
  },
  {
    name: 'Admin da Revendedora',
    email: 'miniadmin@autostand.local',
    password: 'Mini@123',
    role: 'MINI_ADMIN',
    standIds: [2],
  },
  {
    name: 'Gestor Operacional',
    email: 'gestor@autostand.local',
    password: 'Gestor@123',
    role: 'GESTOR',
    standIds: [2],
  },
  {
    name: 'Cliente Demo',
    email: 'cliente@autostand.local',
    password: 'Cliente@123',
    role: 'CLIENTE',
    standIds: [2],
  },
];

export function isOfflineMode(): boolean {
  return String(import.meta.env.VITE_OFFLINE_MODE).toLowerCase() === 'true';
}

export function offlineLogin(email: string, password: string) {
  const credential = OFFLINE_CREDENTIALS.find(
    (item) =>
      item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password
  );

  if (!credential) throw new Error('Credenciais offline inválidas.');

  const id = OFFLINE_CREDENTIALS.indexOf(credential) + 1;
  const user: AuthUser = {
    id,
    name: credential.name,
    email: credential.email,
    role: credential.role,
    standIds: credential.standIds,
  };

  return { accessToken: `offline-token-${user.id}`, user };
}

export function offlineMe(token: string | null): AuthUser {
  if (!token?.startsWith('offline-token-'))
    throw new Error('Sessão offline inválida.');

  const id = Number(token.replace('offline-token-', ''));
  const credential = OFFLINE_CREDENTIALS[id - 1];
  if (!credential) throw new Error('Sessão offline inválida.');

  return {
    id,
    name: credential.name,
    email: credential.email,
    role: credential.role,
    standIds: credential.standIds,
  };
}
