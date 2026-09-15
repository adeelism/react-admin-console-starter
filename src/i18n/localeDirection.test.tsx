import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import i18n from './index';
import { LOCALE_STORAGE_KEY } from './localeStorage';
import { useLocaleDirection } from './useLocaleDirection';

function Harness() {
  useLocaleDirection();
  return null;
}

// The jsdom test environment doesn't ship a working Storage, so stub a minimal
// in-memory one. The app tolerates a missing store (localeStorage.ts try/catch);
// here we want to assert the choice is actually persisted.
beforeEach(() => {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  });
});

afterEach(() => {
  void i18n.changeLanguage('en');
  document.documentElement.lang = 'en';
  document.documentElement.dir = 'ltr';
  vi.unstubAllGlobals();
});

describe('useLocaleDirection', () => {
  it('reflects the default locale as ltr / en and persists it', () => {
    render(<Harness />);
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
  });

  it('flips the document to rtl and persists Arabic on change', async () => {
    render(<Harness />);
    await act(async () => {
      await i18n.changeLanguage('ar');
    });
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('ar');
  });
});
