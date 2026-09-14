import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '../mocks/server';
import { resetUsersStore } from '../modules/users/mocks';
import { resetAuditStore } from '../modules/audit-log/store';
import '../i18n';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  server.resetHandlers();
  resetUsersStore();
  resetAuditStore();
});

afterAll(() => server.close());
