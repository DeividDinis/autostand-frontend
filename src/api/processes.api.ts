import { api } from './client'; import type { Process } from '../types/domain';
export const processesApi = { list:(query:Record<string,string|number|undefined>)=>api.get<{data:Process[];total?:number}>('/processes',query), get:(id:number)=>api.get<Process>(`/processes/${id}`), create:(body:Partial<Process>)=>api.post<Process>('/processes',body) };
