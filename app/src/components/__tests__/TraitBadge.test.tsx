import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { TraitBadge } from '../TraitBadge';
import { renderWithProviders } from '@/test/utils';

describe('TraitBadge', () => {
  it('отображает тип и значение свойства', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Фон', value: 'Космос', rarity: 5 }} />
    );

    expect(screen.getByText('Фон')).toBeInTheDocument();
    expect(screen.getByText('Космос')).toBeInTheDocument();
  });

  it('отображает "Легендарный" для rarity <= 1', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Глаза', value: 'Лазерные', rarity: 1 }} />
    );
    expect(screen.getByText('Легендарный')).toBeInTheDocument();
  });

  it('отображает "Эпический" для rarity 2-5', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Шерсть', value: 'Золотая', rarity: 4 }} />
    );
    expect(screen.getByText('Эпический')).toBeInTheDocument();
  });

  it('отображает "Редкий" для rarity 6-10', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Одежда', value: 'Скафандр', rarity: 8 }} />
    );
    expect(screen.getByText('Редкий')).toBeInTheDocument();
  });

  it('отображает "Обычный" для rarity > 20', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Погода', value: 'Ясно', rarity: 30 }} />
    );
    expect(screen.getByText('Обычный')).toBeInTheDocument();
  });

  it('показывает процент', () => {
    renderWithProviders(
      <TraitBadge trait={{ traitType: 'Test', value: 'Val', rarity: 12 }} />
    );
    expect(screen.getByText('12% имеют')).toBeInTheDocument();
  });
});
