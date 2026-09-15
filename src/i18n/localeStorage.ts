export const LOCALE_STORAGE_KEY = 'admin-console.locale';

export function readStoredLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeLocale(code: string): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, code);
  } catch {
    // Storage may be unavailable (private mode, disabled cookies) — non-fatal.
  }
}
