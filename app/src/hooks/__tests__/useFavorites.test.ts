import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../useFavorites';

describe('useFavorites', () => {
  it('начинает с пустого набора', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.count).toBe(0);
    expect(result.current.isFavorite('any')).toBe(false);
  });

  it('добавляет элемент в избранное', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.toggleFavorite('nft-1'));

    expect(result.current.isFavorite('nft-1')).toBe(true);
    expect(result.current.count).toBe(1);
  });

  it('удаляет элемент из избранного при повторном toggle', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.toggleFavorite('nft-1'));
    act(() => result.current.toggleFavorite('nft-1'));

    expect(result.current.isFavorite('nft-1')).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it('поддерживает несколько элементов', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite('nft-1');
      result.current.toggleFavorite('nft-2');
      result.current.toggleFavorite('nft-3');
    });

    expect(result.current.count).toBe(3);
    expect(result.current.isFavorite('nft-1')).toBe(true);
    expect(result.current.isFavorite('nft-2')).toBe(true);
    expect(result.current.isFavorite('nft-3')).toBe(true);
    expect(result.current.isFavorite('nft-4')).toBe(false);
  });

  it('сохраняет состояние в localStorage', () => {
    const { result } = renderHook(() => useFavorites());

    act(() => result.current.toggleFavorite('nft-1'));

    const stored = localStorage.getItem('nft-gallery-favorites');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toContain('nft-1');
  });

  it('восстанавливает состояние из localStorage', () => {
    localStorage.setItem('nft-gallery-favorites', JSON.stringify(['nft-a', 'nft-b']));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite('nft-a')).toBe(true);
    expect(result.current.isFavorite('nft-b')).toBe(true);
    expect(result.current.count).toBe(2);
  });
});
