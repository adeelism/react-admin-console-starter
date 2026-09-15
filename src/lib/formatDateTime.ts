import { resolveIntlLocale } from './intlLocale';

/**
 * Absolute, localized date-time for tooltips (e.g. the audit entry's exact
 * timestamp). Arabic keeps Latin digits via {@link resolveIntlLocale}.
 */
export function formatDateTime(iso: string, locale = 'en'): string {
  return new Date(iso).toLocaleString(resolveIntlLocale(locale));
}
