import { http, HttpResponse } from 'msw';
import type { CreateUserInput, SortOrder, User, UserSortField } from './types';
import { usersSeed } from './seed';
import { addAuditEntry } from '../audit-log/store';

// The acting admin for demo purposes; a real backend would use the auth context.
const ADMIN_ACTOR = 'ada.okafor@example.com';

let store: User[] = [...usersSeed];
let counter = store.length;

/** Reset mock state between tests. */
export function resetUsersStore(): void {
  store = [...usersSeed];
  counter = store.length;
}

function compareUsers(a: User, b: User, sort: UserSortField, order: SortOrder): number {
  const dir = order === 'asc' ? 1 : -1;
  if (sort === 'lastActiveAt') {
    // Users who have never signed in always sort last, regardless of direction.
    if (a.lastActiveAt === null && b.lastActiveAt === null) return 0;
    if (a.lastActiveAt === null) return 1;
    if (b.lastActiveAt === null) return -1;
    return dir * a.lastActiveAt.localeCompare(b.lastActiveAt);
  }
  return dir * String(a[sort]).localeCompare(String(b[sort]), undefined, { numeric: true });
}

export const usersHandlers = [
  http.get('*/api/users', ({ request }) => {
    const params = new URL(request.url).searchParams;
    const search = (params.get('search') ?? '').toLowerCase();
    const role = params.get('role');
    const status = params.get('status');
    const sort = (params.get('sort') ?? 'name') as UserSortField;
    const order = (params.get('order') ?? 'asc') as SortOrder;
    const page = Number(params.get('page') ?? '1');
    const pageSize = Number(params.get('pageSize') ?? '10');

    const filtered = store.filter((user) => {
      if (search && !`${user.name} ${user.email}`.toLowerCase().includes(search)) return false;
      if (role && user.role !== role) return false;
      if (status && user.status !== status) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => compareUsers(a, b, sort, order));
    const start = (page - 1) * pageSize;

    return HttpResponse.json({
      data: sorted.slice(start, start + pageSize),
      total: filtered.length,
    });
  }),

  http.post('*/api/users', async ({ request }) => {
    const input = (await request.json()) as CreateUserInput;
    counter += 1;
    const user: User = {
      id: `u_${counter}`,
      ...input,
      status: 'invited',
      createdAt: new Date().toISOString(),
      lastActiveAt: null,
    };
    store = [user, ...store];
    addAuditEntry({
      actor: ADMIN_ACTOR,
      action: 'user.created',
      target: user.email,
      before: null,
      after: { name: user.name, email: user.email, role: user.role, status: user.status },
    });
    return HttpResponse.json(user, { status: 201 });
  }),

  http.patch('*/api/users/:id', async ({ request, params }) => {
    const id = String(params.id);
    const input = (await request.json()) as CreateUserInput;
    const existing = store.find((user) => user.id === id);
    if (!existing) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const updated: User = { ...existing, ...input };
    store = store.map((user) => (user.id === id ? updated : user));
    addAuditEntry({
      actor: ADMIN_ACTOR,
      action: 'user.updated',
      target: updated.email,
      before: { name: existing.name, email: existing.email, role: existing.role },
      after: { name: updated.name, email: updated.email, role: updated.role },
    });
    return HttpResponse.json(updated);
  }),

  http.delete('*/api/users/:id', ({ params }) => {
    const id = String(params.id);
    const existing = store.find((user) => user.id === id);
    store = store.filter((user) => user.id !== id);
    if (existing) {
      addAuditEntry({
        actor: ADMIN_ACTOR,
        action: 'user.deleted',
        target: existing.email,
        before: { name: existing.name, email: existing.email, role: existing.role },
        after: null,
      });
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
