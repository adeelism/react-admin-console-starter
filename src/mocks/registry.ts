import type { RequestHandler } from 'msw';
import { usersHandlers } from '../modules/users/mocks';
import { auditLogHandlers } from '../modules/audit-log/mocks';

const MODULE_HANDLERS: Record<string, RequestHandler[]> = {
  users: usersHandlers,
  'audit-log': auditLogHandlers,
};

/** Handlers for the named modules, or all of them when `all` is present. */
export function handlersForModules(modules: string[]): RequestHandler[] {
  if (modules.includes('all')) {
    return allHandlers();
  }
  return modules.flatMap((name) => MODULE_HANDLERS[name] ?? []);
}

export function allHandlers(): RequestHandler[] {
  return Object.values(MODULE_HANDLERS).flat();
}

/** Parses which modules to mock from the environment (per-module toggle). */
export function enabledModulesFromEnv(env: {
  VITE_ENABLE_MOCKS?: string;
  VITE_MOCK_MODULES?: string;
}): string[] {
  if (env.VITE_ENABLE_MOCKS !== 'true') {
    return [];
  }
  const raw = env.VITE_MOCK_MODULES?.trim();
  if (!raw) {
    return [];
  }
  return raw
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}
