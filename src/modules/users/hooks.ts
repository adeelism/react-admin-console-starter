import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './api';
import type { CreateUserInput, UserListParams } from './types';

const USERS_KEY = ['users'] as const;
const AUDIT_KEY = ['audit-log'] as const;

export function useUsers(params: UserListParams) {
  return useQuery({
    // The params are part of the key so each filter/sort/page combination is cached.
    queryKey: [...USERS_KEY, params],
    queryFn: () => usersApi.list(params),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.create(input),
    onSuccess: () => {
      // A write changes both the users list and the audit log.
      void queryClient.invalidateQueries({ queryKey: USERS_KEY });
      void queryClient.invalidateQueries({ queryKey: AUDIT_KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateUserInput }) =>
      usersApi.update(id, input),
    onSuccess: () => {
      // A write changes both the users list and the audit log.
      void queryClient.invalidateQueries({ queryKey: USERS_KEY });
      void queryClient.invalidateQueries({ queryKey: AUDIT_KEY });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      // A write changes both the users list and the audit log.
      void queryClient.invalidateQueries({ queryKey: USERS_KEY });
      void queryClient.invalidateQueries({ queryKey: AUDIT_KEY });
    },
  });
}
