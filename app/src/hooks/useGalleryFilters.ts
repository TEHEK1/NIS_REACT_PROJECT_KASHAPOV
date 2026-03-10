import { useState, useMemo, useCallback } from 'react';
import type { NFT, GalleryFilters, SortOption } from '@/types';

const defaultFilters: GalleryFilters = {
  search: '',
  collectionId: null,
  priceMin: null,
  priceMax: null,
  sort: 'newest',
  onlyAuctions: false,
};

export function useGalleryFilters(allNfts: NFT[]) {
  const [filters, setFilters] = useState<GalleryFilters>(defaultFilters);

  const setSearch = useCallback((search: string) =>
    setFilters(prev => ({ ...prev, search })), []);

  const setCollectionId = useCallback((collectionId: string | null) =>
    setFilters(prev => ({ ...prev, collectionId })), []);

  const setPriceRange = useCallback((priceMin: number | null, priceMax: number | null) =>
    setFilters(prev => ({ ...prev, priceMin, priceMax })), []);

  const setSort = useCallback((sort: SortOption) =>
    setFilters(prev => ({ ...prev, sort })), []);

  const setOnlyAuctions = useCallback((onlyAuctions: boolean) =>
    setFilters(prev => ({ ...prev, onlyAuctions })), []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const filteredNfts = useMemo(() => {
    let result = [...allNfts];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(nft =>
        nft.name.toLowerCase().includes(query) ||
        nft.description.toLowerCase().includes(query) ||
        nft.creator.name.toLowerCase().includes(query)
      );
    }

    if (filters.collectionId) {
      result = result.filter(nft => nft.collectionId === filters.collectionId);
    }

    if (filters.priceMin !== null) {
      result = result.filter(nft => nft.price >= filters.priceMin!);
    }

    if (filters.priceMax !== null) {
      result = result.filter(nft => nft.price <= filters.priceMax!);
    }

    if (filters.onlyAuctions) {
      result = result.filter(nft => nft.isAuction);
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'most-liked':
        result.sort((a, b) => b.likes - a.likes);
        break;
    }

    return result;
  }, [allNfts, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.collectionId) count++;
    if (filters.priceMin !== null) count++;
    if (filters.priceMax !== null) count++;
    if (filters.onlyAuctions) count++;
    if (filters.sort !== 'newest') count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredNfts,
    activeFilterCount,
    setSearch,
    setCollectionId,
    setPriceRange,
    setSort,
    setOnlyAuctions,
    resetFilters,
  };
}
