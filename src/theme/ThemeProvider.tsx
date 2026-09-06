import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeMode } from './theme-context';

/** Tracks light/dark and reflects it onto `document.documentElement[data-theme]`. */
export function ThemeProvider({
  children,
  initialMode = 'light',
}: {
  children: ReactNode;
  initialMode?: ThemeMode;
}) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const toggle = useCallback(() => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
