import { describe, expect, it } from 'vitest';
import { directionOf, isSupportedLocale, resolveInitialLocale } from './locales';

describe('resolveInitialLocale', () => {
  it('keeps a supported stored locale', () => {
    expect(resolveInitialLocale('ar')).toBe('ar');
    expect(resolveInitialLocale('en')).toBe('en');
  });

  it('falls back to the default for unknown, empty, or missing values', () => {
    expect(resolveInitialLocale('fr')).toBe('en');
    expect(resolveInitialLocale('')).toBe('en');
    expect(resolveInitialLocale(null)).toBe('en');
  });
});

describe('directionOf', () => {
  it('maps locales to their writing direction, defaulting to ltr', () => {
    expect(directionOf('ar')).toBe('rtl');
    expect(directionOf('en')).toBe('ltr');
    expect(directionOf('unknown')).toBe('ltr');
  });
});

describe('isSupportedLocale', () => {
  it('recognizes only registered locales', () => {
    expect(isSupportedLocale('ar')).toBe(true);
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('de')).toBe(false);
  });
});
