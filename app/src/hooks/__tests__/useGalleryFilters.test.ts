import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGalleryFilters } from '../useGalleryFilters';
import type { NFT } from '@/types';

const mockNfts: NFT[] = [
  {
    id: '1', tokenId: 1, name: 'Alpha NFT', description: 'First', image: '',
    price: 1.5, currency: 'ETH', collectionId: 'col-a',
    creator: { address: '0x1', name: 'Creator A', avatar: '', verified: true },
    ownerAddress: '0x2', traits: [], createdAt: '2026-01-10T00:00:00Z',
    likes: 100, isAuction: false,
  },
  {
    id: '2', tokenId: 2, name: 'Beta NFT', description: 'Second', image: '',
    price: 5.0, currency: 'ETH', collectionId: 'col-b',
    creator: { address: '0x3', name: 'Creator B', avatar: '', verified: false },
    ownerAddress: '0x4', traits: [], createdAt: '2026-02-15T00:00:00Z',
    likes: 250, isAuction: true, auctionEndsAt: '2027-01-01T00:00:00Z',
  },
  {
    id: '3', tokenId: 3, name: 'Gamma NFT', description: 'Third by creator A', image: '',
    price: 10.0, currency: 'ETH', collectionId: 'col-a',
    creator: { address: '0x1', name: 'Creator A', avatar: '', verified: true },
    ownerAddress: '0x5', traits: [], createdAt: '2026-03-01T00:00:00Z',
    likes: 50, isAuction: false,
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

  it('фильтрует по поисковому запросу (создатель)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => result.current.setSearch('Creator A'));

    expect(result.current.filteredNfts).toHaveLength(2);
  });

  it('фильтрует по коллекции', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => result.current.setCollectionId('col-a'));

    expect(result.current.filteredNfts).toHaveLength(2);
    expect(result.current.filteredNfts.every(n => n.collectionId === 'col-a')).toBe(true);
  });

  it('фильтрует по диапазону цен', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => result.current.setPriceRange(2, 8));

    expect(result.current.filteredNfts).toHaveLength(1);
    expect(result.current.filteredNfts[0]!.id).toBe('2');
  });

  it('фильтрует только аукционы', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => result.current.setOnlyAuctions(true));

    expect(result.current.filteredNfts).toHaveLength(1);
    expect(result.current.filteredNfts[0]!.isAuction).toBe(true);
  });

  it('сортирует по цене (возрастание)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => result.current.setSort('price-asc'));

    const prices = result.current.filteredNfts.map(n => n.price);
    expect(prices).toEqual([1.5, 5.0, 10.0]);
  });

  it('сортирует по цене (убывание)', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => result.current.setSort('price-desc'));

    const prices = result.current.filteredNfts.map(n => n.price);
    expect(prices).toEqual([10.0, 5.0, 1.5]);
  });

  it('сортирует по популярности', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => result.current.setSort('most-liked'));

    const likes = result.current.filteredNfts.map(n => n.likes);
    expect(likes).toEqual([250, 100, 50]);
  });

  it('считает количество активных фильтров', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    expect(result.current.activeFilterCount).toBe(0);

    act(() => {
      result.current.setSearch('test');
      result.current.setCollectionId('col-a');
      result.current.setOnlyAuctions(true);
    });

    expect(result.current.activeFilterCount).toBe(3);
  });

  it('сбрасывает фильтры', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => {
      result.current.setSearch('test');
      result.current.setCollectionId('col-a');
      result.current.setSort('price-desc');
    });

    act(() => result.current.resetFilters());

    expect(result.current.filteredNfts).toHaveLength(3);
    expect(result.current.activeFilterCount).toBe(0);
  });

  it('комбинирует несколько фильтров', () => {
    const { result } = renderHook(() => useGalleryFilters(mockNfts));

    act(() => {
      result.current.setCollectionId('col-a');
      result.current.setPriceRange(5, null);
    });

    expect(result.current.filteredNfts).toHaveLength(1);
    expect(result.current.filteredNfts[0]!.id).toBe('3');
  });
});
