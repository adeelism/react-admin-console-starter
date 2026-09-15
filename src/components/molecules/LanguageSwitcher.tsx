import { useTranslation } from 'react-i18next';
import { LOCALES } from '../../i18n/locales';

/**
 * Language picker. Options are derived from the locale registry, so adding a
 * locale needs no change here. Each option shows its endonym (e.g. "العربية").
 */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted">
      {t('language.label')}
      <select
        aria-label={t('language.label')}
        value={i18n.language}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        className="rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent"
      >
        {Object.values(LOCALES).map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
