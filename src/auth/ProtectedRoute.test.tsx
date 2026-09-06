import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { renderWithProviders } from '../test/utils';

const viewer = { id: 'u', name: 'Val Viewer', role: 'viewer' as const };

describe('ProtectedRoute', () => {
  it('renders children when the user has the permission', () => {
    renderWithProviders(
      <ProtectedRoute requires="users:read">
        <p>secret</p>
      </ProtectedRoute>,
      { user: viewer },
    );
    expect(screen.getByText('secret')).toBeInTheDocument();
  });

  it('blocks and shows a notice when the user lacks the permission', () => {
    renderWithProviders(
      <ProtectedRoute requires="users:write">
        <p>secret</p>
      </ProtectedRoute>,
      { user: viewer },
    );
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
