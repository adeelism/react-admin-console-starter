import en from './locales/en.json';
import ar from './locales/ar.json';
import { readStoredLocale } from './localeStorage';

export type Direction = 'ltr' | 'rtl';

export interface LocaleMeta {
  code: string;
  /** Endonym shown in the switcher (e.g. "العربية"). */
  nativeName: string;
  dir: Direction;
  resource: object;
}

/**
 * The locale registry — the single source of truth. Adding a locale is one
 * translation file plus one entry here; the switcher, i18n init, and the
 * document-direction effect all derive from this map.
 */
export const LOCALES = {
  en: { code: 'en', nativeName: 'English', dir: 'ltr', resource: en },
  ar: { code: 'ar', nativeName: 'العربية', dir: 'rtl', resource: ar },
} as const satisfies Record<string, LocaleMeta>;

export type LocaleCode = keyof typeof LOCALES;

export const DEFAULT_LOCALE: LocaleCode = 'en';

export function isSupportedLocale(code: string): code is LocaleCode {
  return code in LOCALES;
}

export function directionOf(code: string): Direction {
  return isSupportedLocale(code) ? LOCALES[code].dir : 'ltr';
}

/** The startup locale: a valid persisted choice, else the default. */
export function resolveInitialLocale(stored: string | null = readStoredLocale()): LocaleCode {
  return stored && isSupportedLocale(stored) ? stored : DEFAULT_LOCALE;
}
