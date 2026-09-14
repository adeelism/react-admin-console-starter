import { http, HttpResponse } from 'msw';
import type { CreateUserInput, User } from './types';
import { usersSeed } from './seed';

let store: User[] = [...usersSeed];
let counter = store.length;

/** Reset mock state between tests. */
export function resetUsersStore(): void {
  store = [...usersSeed];
  counter = store.length;
}

export const usersHandlers = [
  http.get('*/api/users', () => HttpResponse.json(store)),

  http.post('*/api/users', async ({ request }) => {
    const input = (await request.json()) as CreateUserInput;
    counter += 1;
    // New users start as invited and have never signed in; the server owns these.
    const user: User = {
      id: `u_${counter}`,
      ...input,
      status: 'invited',
      createdAt: new Date().toISOString(),
      lastActiveAt: null,
    };
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
