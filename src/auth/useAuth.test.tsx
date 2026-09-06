import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('throws when used outside an AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/);
  });
});
