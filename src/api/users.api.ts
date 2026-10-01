import { api } from './client'; import type { User } from '../types/domain';
export const usersApi = { list:(query?:Record<string,string|number|undefined>)=>api.get<{data:User[];total?:number}>('/users',query), get:(id:number)=>api.get<User>(`/users/${id}`), create:(body:unknown)=>api.post<User>('/users',body), update:(id:number,body:unknown)=>api.patch<User>(`/users/${id}`,body) };
