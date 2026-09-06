import { useTranslation } from 'react-i18next';
import { useTheme } from './useTheme';
import { Button } from '../components/atoms/Button';

export function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const { t } = useTranslation();

  return (
    <Button variant="ghost" onClick={toggle} aria-label={t('theme.toggle')}>
      {mode === 'light' ? t('theme.dark') : t('theme.light')}
    </Button>
  );
}
