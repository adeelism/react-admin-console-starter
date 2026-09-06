import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeState | null>(null);
