import { http } from '../../lib/http';
import type { CreateUserInput, User } from './types';

export const usersApi = {
  list: (): Promise<User[]> => http.get<User[]>('/users'),
  create: (input: CreateUserInput): Promise<User> => http.post<User>('/users', input),
  update: (id: string, input: CreateUserInput): Promise<User> =>
    http.patch<User>(`/users/${id}`, input),
  remove: (id: string): Promise<void> => http.delete<void>(`/users/${id}`),
};
