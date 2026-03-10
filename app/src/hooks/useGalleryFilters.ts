import { useState, useMemo, useCallback } from 'react';
import type { NFT, GalleryFilters, SortOption } from '@/types';

const defaultFilters: GalleryFilters = {
  search: '',
  collectionSlug: null,
  sort: 'name-asc',
};

export function useGalleryFilters(allNfts: NFT[]) {
  const [filters, setFilters] = useState<GalleryFilters>(defaultFilters);

  const setSearch = useCallback((search: string) =>
    setFilters(prev => ({ ...prev, search })), []);

  const setCollectionSlug = useCallback((collectionSlug: string | null) =>
    setFilters(prev => ({ ...prev, collectionSlug })), []);

  const setSort = useCallback((sort: SortOption) =>
    setFilters(prev => ({ ...prev, sort })), []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const filteredNfts = useMemo(() => {
    let result = [...allNfts];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(nft =>
        nft.name.toLowerCase().includes(query) ||
        nft.description.toLowerCase().includes(query)
      );
    }

    if (filters.collectionSlug) {
      result = result.filter(nft => nft.collectionSlug === filters.collectionSlug);
    }

    switch (filters.sort) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'token-asc':
        result.sort((a, b) => a.tokenId - b.tokenId);
        break;
      case 'token-desc':
        result.sort((a, b) => b.tokenId - a.tokenId);
        break;
    }

    return result;
  }, [allNfts, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.collectionSlug) count++;
    if (filters.sort !== 'name-asc') count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredNfts,
    activeFilterCount,
    setSearch,
    setCollectionSlug,
    setSort,
    resetFilters,
  };
}
