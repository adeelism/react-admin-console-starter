import { useTranslation } from 'react-i18next';

/**
 * Language picker. `xx` is a pseudo-locale that proves the i18n wiring; it is
 * replaced by Arabic (with full RTL) in a later phase.
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
        <option value="en">English</option>
        <option value="xx">XX (pseudo)</option>
      </select>
    </label>
  );
}
