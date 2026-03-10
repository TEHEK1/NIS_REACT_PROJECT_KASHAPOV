import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { StatsCard } from '../StatsCard';
import { renderWithProviders } from '@/test/utils';

describe('StatsCard', () => {
  it('рендерит label и value', () => {
    renderWithProviders(
      <StatsCard
        icon={<span data-testid="icon">I</span>}
        label="Баланс"
        value="12.50 ETH"
      />
    );

    expect(screen.getByText('Баланс')).toBeInTheDocument();
    expect(screen.getByText('12.50 ETH')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
