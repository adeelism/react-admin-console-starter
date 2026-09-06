import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './api';
import type { CreateUserInput } from './types';

const USERS_KEY = ['users'] as const;

export function useUsers() {
  return useQuery({ queryKey: USERS_KEY, queryFn: usersApi.list });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateUserInput }) =>
      usersApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
}
