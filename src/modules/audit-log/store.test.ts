import { beforeEach, describe, expect, it } from 'vitest';
import { addAuditEntry, getAuditEntries, resetAuditStore } from './store';

describe('audit store', () => {
  beforeEach(resetAuditStore);

  it('prepends new entries so recent actions surface first', () => {
    const startCount = getAuditEntries().length;
    addAuditEntry({
      actor: 'x@example.com',
      action: 'user.created',
      target: 'z@example.com',
      before: null,
      after: { name: 'Z' },
    });
    const entries = getAuditEntries();
    expect(entries).toHaveLength(startCount + 1);
    expect(entries[0].action).toBe('user.created');
    expect(entries[0].id).toBeTruthy();
    expect(entries[0].createdAt).toBeTruthy();
  });
});
