import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { TraitBadge } from '../TraitBadge';
import { renderWithProviders } from '@/test/utils';

describe('TraitBadge', () => {
  it('отображает тип и значение свойства', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Background', value: 'Blue' }} />
    );
    expect(screen.getByText('Background')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('корректно отображает кириллицу', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Фон', value: 'Космос' }} />
    );
    expect(screen.getByText('Фон')).toBeInTheDocument();
    expect(screen.getByText('Космос')).toBeInTheDocument();
  });

  it('отображает длинные значения', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Special Ability', value: 'Super Mega Ultra Power Beam Attack' }} />
    );
    expect(screen.getByText('Special Ability')).toBeInTheDocument();
    expect(screen.getByText('Super Mega Ultra Power Beam Attack')).toBeInTheDocument();
  });
});
