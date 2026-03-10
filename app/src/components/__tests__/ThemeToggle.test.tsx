import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../ThemeToggle';
import { renderWithProviders } from '@/test/utils';

describe('ThemeToggle', () => {
  it('рендерится с кнопкой', () => {
    renderWithProviders(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /переключить тему/i })).toBeInTheDocument();
  });

  it('переключает тему при клике', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /переключить тему/i });
    await user.click(button);

    expect(localStorage.getItem('nft-gallery-theme')).toBe('light');
  });

  it('переключает обратно при двойном клике', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /переключить тему/i });
    await user.click(button);
    await user.click(button);

    expect(localStorage.getItem('nft-gallery-theme')).toBe('dark');
  });
});
