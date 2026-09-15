import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { directionOf } from './locales';
import { storeLocale } from './localeStorage';

/**
 * Reflects the active locale onto `<html lang/dir>` and persists the choice.
 * Mount once (in AppLayout). The pre-paint script in index.html handles the very
 * first load; this keeps the document in sync on every subsequent change.
 */
export function useLocaleDirection(): void {
  const { i18n } = useTranslation();

  useEffect(() => {
    const code = i18n.language;
    document.documentElement.lang = code;
    document.documentElement.dir = directionOf(code);
    storeLocale(code);
  }, [i18n.language]);
}
