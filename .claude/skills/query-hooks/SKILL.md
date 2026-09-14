---
name: query-hooks
description: Enforces TanStack Query v5 hook isolation. All useQuery/useMutation/useQueryClient calls live in a module's hooks file — never inline in page or component files. Covers hook naming, loading/error/empty rendering, the mutation dual-callback pattern, query keys, and enabled guards. Activate when writing or reviewing any file that fetches data.
---

# Query Hooks Pattern

All server state uses **TanStack Query v5**. Requests go through the single typed
client in `src/lib/http.ts`; the mock/in-memory layer sits behind it via MSW.

## The hard rule

> `useQuery`, `useMutation`, and `useQueryClient` must **never** appear in a page
> or component file. They live in the module's `hooks.ts` (small modules) or
> `hooks/` directory.

## Hook file template

```ts
// src/modules/users/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './api';
import type { UserFilters, CreateUserDto } from './types';

const usersKey = (filters?: UserFilters) => ['users', filters ?? {}] as const;

export function useUsersQuery(filters: UserFilters) {
  return useQuery({
    queryKey: usersKey(filters),
    queryFn: () => usersApi.list(filters),
  });
}

export function useCreateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserDto) => usersApi.create(data),
    // Hook owns cache invalidation only.
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
```

## Dual-callback pattern

Cache invalidation lives in the **hook's** `onSuccess`. UI feedback (toast, close
modal, reset form) lives in the **caller's** `mutate(payload, { onSuccess })`.
Never do both in one place.

```ts
const createUser = useCreateUserMutation();
createUser.mutate(payload, {
  onSuccess: () => {
    closeModal();
    toast.success(t('users.created'));
  },
});
```

## Every fetch renders three states

```tsx
const { data = [], isPending, isError, refetch } = useUsersQuery(filters);
if (isPending) return <UsersTableSkeleton />;        // loading — skeleton, not spinner
if (isError) return <ErrorState onRetry={refetch} />; // recoverable error
if (data.length === 0) return <EmptyState … />;       // empty / no-match
```

## Rules

- Query keys include **every** variable the query depends on (`['users', filters]`).
- `enabled: !!id` whenever the key contains a param that may be undefined.
- Mutations always invalidate (or update) the cache on success — no stale reads after writes.
- Loading uses a **skeleton**; error is **recoverable** (retry); empty is a **designed** state.

## Report format

```
BLOCKING — Inline query hook in a page
  UsersPage.tsx:12  useQuery({ queryKey: ['users'] }) inline
                    → const { data, isPending, isError } = useUsersQuery(filters)
BLOCKING — Missing state guard
  UsersPage.tsx     no isError guard after useUsersQuery()
```
