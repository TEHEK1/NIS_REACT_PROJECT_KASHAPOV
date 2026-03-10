import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGalleryFilters } from '../useGalleryFilters';
import type { NFT } from '@/types';

const mockNfts: NFT[] = [
  {
    id: '0xabc-1', contractAddress: '0xabc', tokenId: 1,
    name: 'Alpha NFT', description: 'First', image: '',
    ownerAddress: '0x1', traits: [], collectionSlug: 'col-a',
  },
  {
    id: '0xabc-2', contractAddress: '0xabc', tokenId: 2,
    name: 'Beta NFT', description: 'Second', image: '',
    ownerAddress: '0x2', traits: [], collectionSlug: 'col-b',
  },
  {
    id: '0xabc-3', contractAddress: '0xabc', tokenId: 3,
    name: 'Gamma NFT', description: 'Third', image: '',
    ownerAddress: '0x3', traits: [], collectionSlug: 'col-a',
  },
];

describe('useGalleryFilters', () => {
  it('возвращает все NFT без фильтров', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    expect(result.current.filteredNfts).toHaveLength(3);
  });

  it('фильтрует по поисковому запросу (имя)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    act(() => result.current.setSearch('Alpha'));
    expect(result.current.filteredNfts).toHaveLength(1);
    expect(result.current.filteredNfts[0]!.name).toBe('Alpha NFT');
  });

  it('фильтрует по поисковому запросу (описание)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    act(() => result.current.setSearch('Second'));
    expect(result.current.filteredNfts).toHaveLength(1);
    expect(result.current.filteredNfts[0]!.name).toBe('Beta NFT');
  });

  it('фильтрует по коллекции', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    act(() => result.current.setCollectionSlug('col-a'));
    expect(result.current.filteredNfts).toHaveLength(2);
    expect(result.current.filteredNfts.every(n => n.collectionSlug === 'col-a')).toBe(true);
  });

  it('сортирует по имени (возрастание)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    act(() => result.current.setSort('name-asc'));
    const names = result.current.filteredNfts.map(n => n.name);
    expect(names).toEqual(['Alpha NFT', 'Beta NFT', 'Gamma NFT']);
  });

  it('сортирует по имени (убывание)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    act(() => result.current.setSort('name-desc'));
    const names = result.current.filteredNfts.map(n => n.name);
    expect(names).toEqual(['Gamma NFT', 'Beta NFT', 'Alpha NFT']);
  });

  it('сортирует по Token ID (возрастание)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    act(() => result.current.setSort('token-asc'));
    const ids = result.current.filteredNfts.map(n => n.tokenId);
    expect(ids).toEqual([1, 2, 3]);
  });

  it('сортирует по Token ID (убывание)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    act(() => result.current.setSort('token-desc'));
    const ids = result.current.filteredNfts.map(n => n.tokenId);
    expect(ids).toEqual([3, 2, 1]);
  });

  it('считает количество активных фильтров', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));
    expect(result.current.activeFilterCount).toBe(0);

    act(() => {
      result.current.setSearch('test');
      result.current.setCollectionSlug('col-a');
    });

    expect(result.current.activeFilterCount).toBe(2);
  });

  it('сбрасывает фильтры', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => {
      result.current.setSearch('test');
      result.current.setCollectionSlug('col-a');
      result.current.setSort('name-desc');
    });

    act(() => result.current.resetFilters());

    expect(result.current.filteredNfts).toHaveLength(3);
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('комбинирует несколько фильтров', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => {
      result.current.setCollectionSlug('col-a');
      result.current.setSearch('Alpha');
    });

    expect(result.current.filteredNfts).toHaveLength(1);
    expect(result.current.filteredNfts[0]!.id).toBe('0xabc-1');
  });
});
