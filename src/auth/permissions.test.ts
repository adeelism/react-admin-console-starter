import { describe, expect, it } from 'vitest';
import { permissionsForRole } from './permissions';

describe('permissionsForRole', () => {
  it('grants admin every permission', () => {
    expect(permissionsForRole('admin')).toEqual(
      expect.arrayContaining(['users:read', 'users:write', 'audit-log:read']),
    );
  });

  it('grants auditor read but not write', () => {
    expect(permissionsForRole('auditor')).toContain('audit-log:read');
    expect(permissionsForRole('auditor')).not.toContain('users:write');
  });

  it('limits viewer to reading users', () => {
    expect(permissionsForRole('viewer')).toEqual(['users:read']);
  });
});
