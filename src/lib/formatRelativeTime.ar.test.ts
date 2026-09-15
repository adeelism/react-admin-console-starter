import { describe, expect, it } from 'vitest';
import { formatRelativeTime } from './formatRelativeTime';

const NOW = new Date('2026-01-15T12:00:00Z');
const daysAgo = (n: number): string => new Date(NOW.getTime() - n * 86_400_000).toISOString();
const hoursAgo = (n: number): string => new Date(NOW.getTime() - n * 3_600_000).toISOString();

// Arabic-Indic digits ٠-٩ — these must NOT appear (project uses Latin digits).
const ARABIC_INDIC = /[٠-٩]/;
const ARABIC_SCRIPT = /[؀-ۿ]/;

describe('formatRelativeTime — Arabic', () => {
  it('localizes the wording into Arabic with the correct plural', () => {
    // 3 days → CLDR "few" plural: "قبل 3 أيام".
    const out = formatRelativeTime(daysAgo(3), NOW, 'ar');
    expect(out).toMatch(ARABIC_SCRIPT);
    expect(out).toContain('أيام');
  });

  it('renders numbers as Latin digits, never Arabic-Indic', () => {
    const days = formatRelativeTime(daysAgo(3), NOW, 'ar');
    const hours = formatRelativeTime(hoursAgo(5), NOW, 'ar');
    expect(days).toMatch(/[0-9]/);
    expect(days).not.toMatch(ARABIC_INDIC);
    expect(hours).toMatch(/[0-9]/);
    expect(hours).not.toMatch(ARABIC_INDIC);
  });

  it('uses Arabic relative words for auto-cased values (no digits)', () => {
    // numeric:'auto' names ±1 day ("أمس"); assert it stays Arabic with no digits.
    const yesterday = formatRelativeTime(daysAgo(1), NOW, 'ar');
    expect(yesterday).toMatch(ARABIC_SCRIPT);
    expect(yesterday).not.toMatch(ARABIC_INDIC);
  });

  it('leaves English output unchanged (default locale)', () => {
    expect(formatRelativeTime(daysAgo(3), NOW)).toBe('3 days ago');
  });
});
