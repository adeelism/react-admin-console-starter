import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import SettingsPage from './pages/SettingsPage';
import { renderWithProviders } from '../../test/utils';

describe('SettingsPage', () => {
  it('renders the settings page shell', () => {
    renderWithProviders(<SettingsPage />);
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });
});
