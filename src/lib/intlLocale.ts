/**
 * Maps an app locale to the BCP-47 tag used for `Intl` formatting.
 *
 * Arabic uses the `-u-nu-latn` numbering-system extension so figures render as
 * Western (Latin) digits — a deliberate project convention (Latin digits in
 * both locales) while the surrounding words still localize. Requires a full-ICU
 * runtime (Node 22 in `.nvmrc`; all evergreen browsers).
 */
const INTL_LOCALE: Record<string, string> = {
  ar: 'ar-AE-u-nu-latn',
};

export function resolveIntlLocale(locale: string): string {
  return INTL_LOCALE[locale] ?? locale;
}
