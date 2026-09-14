import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../auth/AuthProvider';
import { DemoBanner } from './DemoBanner';

describe('DemoBanner', () => {
  it('switches role and can be dismissed', async () => {
    render(
      <AuthProvider>
        <DemoBanner />
      </AuthProvider>,
    );
    expect(screen.getByText('Live demo')).toBeInTheDocument();

    const viewer = screen.getByRole('button', { name: 'Viewer' });
    await userEvent.click(viewer);
    expect(viewer).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Live demo')).not.toBeInTheDocument();
  });
});
