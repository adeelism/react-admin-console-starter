import { describe, expect, it } from 'vitest';
import { allHandlers, enabledModulesFromEnv, handlersForModules } from './registry';

describe('mock registry', () => {
  it('returns no modules when mocks are disabled', () => {
    expect(
      enabledModulesFromEnv({ VITE_ENABLE_MOCKS: 'false', VITE_MOCK_MODULES: 'users' }),
    ).toEqual([]);
  });

  it('returns no modules when the list is empty', () => {
    expect(enabledModulesFromEnv({ VITE_ENABLE_MOCKS: 'true', VITE_MOCK_MODULES: '' })).toEqual([]);
  });

  it('parses and trims the module list when enabled', () => {
    expect(
      enabledModulesFromEnv({ VITE_ENABLE_MOCKS: 'true', VITE_MOCK_MODULES: 'users, audit-log' }),
    ).toEqual(['users', 'audit-log']);
  });

  it('resolves handlers for named modules and ignores unknown ones', () => {
    expect(handlersForModules(['users']).length).toBeGreaterThan(0);
    expect(handlersForModules(['unknown'])).toEqual([]);
  });

  it('supports the "all" wildcard', () => {
    expect(handlersForModules(['all']).length).toBe(allHandlers().length);
  });
});
