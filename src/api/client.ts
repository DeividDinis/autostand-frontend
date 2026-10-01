import { storage } from '../utils/storage';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '');
export class ApiError extends Error { constructor(public status: number, public data: unknown, message: string) { super(message); } }

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown; query?: Record<string, string | number | undefined | null>; publicRequest?: boolean };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`);
  Object.entries(options.query || {}).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value)); });
  const token = storage.getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token && !options.publicRequest) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(url, { ...options, headers, body: options.body === undefined ? undefined : JSON.stringify(options.body) });
  const text = await response.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (response.status === 401) {
    if (options.publicRequest) throw new ApiError(401, data, 'O catálogo público não está disponível.');
    storage.clear(); window.location.assign('/login'); throw new ApiError(401, data, 'Sessão expirada.');
  }
  if (response.status === 403) throw new ApiError(403, data, 'Não tens permissão para executar esta operação.');
  if (!response.ok) { const message = typeof data === 'object' && data && 'message' in data ? String((data as { message: unknown }).message) : `Pedido falhou (${response.status}).`; throw new ApiError(response.status, data, message); }
  return data as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query']) => request<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  publicGet: <T>(path: string, query?: RequestOptions['query']) => request<T>(path, { method: 'GET', query, publicRequest: true })
};
export { API_URL };
