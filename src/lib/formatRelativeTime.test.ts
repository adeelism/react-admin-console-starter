import { describe, expect, it } from 'vitest';
import { formatRelativeTime } from './formatRelativeTime';

const now = new Date('2026-09-14T12:00:00Z');

describe('formatRelativeTime', () => {
  it('formats past times at the right granularity', () => {
    expect(formatRelativeTime('2026-09-14T11:59:30Z', now)).toContain('30 seconds');
    expect(formatRelativeTime('2026-09-14T11:30:00Z', now)).toContain('30 minutes');
    expect(formatRelativeTime('2026-09-14T09:00:00Z', now)).toContain('3 hours');
    expect(formatRelativeTime('2026-09-10T12:00:00Z', now)).toContain('4 days');
  });

  it('formats future times', () => {
    expect(formatRelativeTime('2026-09-14T14:00:00Z', now)).toContain('in 2 hours');
  });
});
