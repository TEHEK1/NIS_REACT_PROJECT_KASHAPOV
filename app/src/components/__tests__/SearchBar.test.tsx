import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { SearchBar } from '../SearchBar';
import { renderWithProviders } from '@/test/utils';

describe('SearchBar', () => {
  it('рендерится с placeholder', () => {
    renderWithProviders(<SearchBar value="" onChange={() => {}} placeholder="Поиск..." />);
    expect(screen.getByPlaceholderText('Поиск...')).toBeInTheDocument();
  });

  it('отображает переданное значение', () => {
    renderWithProviders(<SearchBar value="test query" onChange={() => {}} />);
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('вызывает onChange с задержкой (debounce)', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();

    renderWithProviders(<SearchBar value="" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Поиск NFT...');

    fireEvent.change(input, { target: { value: 'hello' } });

    expect(onChange).not.toHaveBeenCalled();

    act(() => { vi.advanceTimersByTime(300); });

    expect(onChange).toHaveBeenCalledWith('hello');

    vi.useRealTimers();
  });

  it('показывает кнопку очистки при непустом поле', () => {
    renderWithProviders(<SearchBar value="something" onChange={() => {}} />);
    const clearBtn = screen.getByRole('button');
    expect(clearBtn).toBeInTheDocument();
    expect(clearBtn).toHaveTextContent('×');
  });

  it('кнопка очистки сбрасывает поле', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();

    renderWithProviders(<SearchBar value="text" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button'));

    act(() => { vi.advanceTimersByTime(300); });

    expect(onChange).toHaveBeenCalledWith('');

    vi.useRealTimers();
  });

  it('не показывает кнопку очистки при пустом поле', () => {
    renderWithProviders(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
