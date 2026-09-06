import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  it('throws when used outside a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/);
  });
});
