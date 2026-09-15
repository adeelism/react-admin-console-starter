import { resolveIntlLocale } from './intlLocale';

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

// One formatter per resolved locale, built lazily and reused.
const formatters = new Map<string, Intl.RelativeTimeFormat>();

function formatterFor(locale: string): Intl.RelativeTimeFormat {
  const resolved = resolveIntlLocale(locale);
  let formatter = formatters.get(resolved);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(resolved, { numeric: 'auto' });
    formatters.set(resolved, formatter);
  }
  return formatter;
}

/**
 * Human relative time, e.g. "3 days ago" / "in 2 hours" (Arabic: "منذ ٣ أيام"
 * with Latin digits). `now` is injectable for tests; `locale` defaults to `en`.
 */
export function formatRelativeTime(iso: string, now: Date = new Date(), locale = 'en'): string {
  const formatter = formatterFor(locale);
  let duration = (new Date(iso).getTime() - now.getTime()) / 1000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return formatter.format(Math.round(duration), 'year');
}
