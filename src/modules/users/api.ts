import { http } from '../../lib/http';
import type { CreateUserInput, User, UserListParams, UserListResponse } from './types';

function toQuery(params: UserListParams): string {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.role !== 'all') query.set('role', params.role);
  if (params.status !== 'all') query.set('status', params.status);
  query.set('sort', params.sort);
  query.set('order', params.order);
  query.set('page', String(params.page));
  query.set('pageSize', String(params.pageSize));
  return query.toString();
}

export const usersApi = {
  list: (params: UserListParams): Promise<UserListResponse> =>
    http.get<UserListResponse>(`/users?${toQuery(params)}`),
  create: (input: CreateUserInput): Promise<User> => http.post<User>('/users', input),
  update: (id: string, input: CreateUserInput): Promise<User> =>
    http.patch<User>(`/users/${id}`, input),
  remove: (id: string): Promise<void> => http.delete<void>(`/users/${id}`),
};
