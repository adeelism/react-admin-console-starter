import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { renderWithProviders } from '../test/utils';

describe('ThemeToggle', () => {
  it('toggles the document theme between light and dark', async () => {
    renderWithProviders(<ThemeToggle />);
    expect(document.documentElement.dataset.theme).toBe('light');
    await userEvent.click(screen.getByRole('button'));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
