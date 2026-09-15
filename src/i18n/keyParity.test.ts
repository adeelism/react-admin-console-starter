import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import ar from './locales/ar.json';

/** Flatten a nested resource to dotted leaf keys, e.g. "users.perm.note". */
function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === 'object'
      ? flatten(value as Record<string, unknown>, path)
      : [path];
  });
}

describe('locale key parity', () => {
  it('en and ar expose an identical set of keys', () => {
    const enKeys = flatten(en).sort();
    const arKeys = flatten(ar).sort();
    // toEqual gives a readable diff naming any key that drifted between locales.
    expect(arKeys).toEqual(enKeys);
  });
});
