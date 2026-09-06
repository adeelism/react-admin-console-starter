import { http, HttpResponse } from 'msw';
import type { CreateUserInput, User } from './types';

const seed: User[] = [
  { id: 'u_1', name: 'Ada Admin', email: 'ada@example.com', role: 'admin' },
  { id: 'u_2', name: 'Ivan Auditor', email: 'ivan@example.com', role: 'auditor' },
];

let store: User[] = [...seed];
let counter = store.length;

/** Reset mock state between tests. */
export function resetUsersStore(): void {
  store = [...seed];
  counter = store.length;
}

export const usersHandlers = [
  http.get('*/api/users', () => HttpResponse.json(store)),

  http.post('*/api/users', async ({ request }) => {
    const input = (await request.json()) as CreateUserInput;
    counter += 1;
    const user: User = { id: `u_${counter}`, ...input };
    store = [...store, user];
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
    return HttpResponse.json(updated);
  }),

  http.delete('*/api/users/:id', ({ params }) => {
    const id = String(params.id);
    store = store.filter((user) => user.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
