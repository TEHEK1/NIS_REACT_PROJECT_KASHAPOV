import { useState, useCallback, useMemo } from 'react';
import { COLLECTIONS } from '@/config/contracts';
import { NFTGrid } from '@/components/NFTGrid';
import { NFTListRow } from '@/components/NFTListRow';
import { NftCardSkeleton } from '@/components/NftCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { StatsCard } from '@/components/StatsCard';
import { ViewToggle, type ViewMode } from '@/components/ViewToggle';
import { Pagination } from '@/components/Pagination';
import { useAllNfts } from '@/hooks/useAllNfts';
import { useGalleryFilters } from '@/hooks/useGalleryFilters';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/context/ToastContext';
import { useTheme } from '@/context/ThemeContext';

const PAGE_SIZE = 8;

export default function GalleryPage() {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const { toggleFavorite: rawToggle, isFavorite } = useFavorites();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);

  const { nfts: allNfts, loading, error, progress } = useAllNfts();

  const toggleFavorite = useCallback((id: string) => {
    const was = isFavorite(id);
    rawToggle(id);
    toast(was ? 'Удалено из избранного' : 'Добавлено в избранное', was ? 'info' : 'success');
  }, [rawToggle, isFavorite, toast]);

  const {
    filters, filteredNfts, activeFilterCount,
    setSearch, setCollectionSlug, setSort, resetFilters,
  } = useGalleryFilters(allNfts);

  const paginatedNfts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredNfts.slice(start, start + PAGE_SIZE);
  }, [filteredNfts, page]);

  const handleFilterChange = useCallback(<T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-nft-violet/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-nft-pink/10 rounded-full blur-3xl animate-float animate-delay-200" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-nft-cyan/10 rounded-full blur-3xl animate-float animate-delay-400" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
            <span className="gradient-text">NFT Gallery</span>
          </h1>
          <p className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Реальные NFT-метаданные напрямую из Ethereum через Web3.js. Никаких моков — только блокчейн.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>}
              label="Загружено NFT"
              value={loading ? `${progress.loaded}/${progress.total}` : allNfts.length.toString()}
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
              label="Коллекции"
              value={COLLECTIONS.length.toString()}
              gradient="from-nft-cyan to-blue-500"
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>}
              label="Сеть"
              value="Ethereum"
              gradient="from-nft-pink to-rose-500"
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              label="Источник"
              value="On-chain"
              gradient="from-nft-lime to-emerald-500"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0 space-y-4">
            <SearchBar value={filters.search} onChange={handleFilterChange(setSearch)} />
            <FilterPanel
              collectionSlug={filters.collectionSlug}
              sort={filters.sort}
              activeCount={activeFilterCount}
              onCollectionChange={handleFilterChange(setCollectionSlug)}
              onSortChange={handleFilterChange(setSort)}
              onReset={() => { resetFilters(); setPage(1); }}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Все NFT
                <span className={`ml-2 text-sm font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {loading ? 'Загрузка из блокчейна...' : `${filteredNfts.length} из ${allNfts.length}`}
                </span>
              </h2>
              <ViewToggle mode={viewMode} onChange={setViewMode} />
            </div>

            {error && !loading && (
              <div className={`mb-6 p-4 rounded-xl text-sm ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                {error}
              </div>
            )}

            {loading && allNfts.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <NftCardSkeleton key={i} />
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <NFTGrid nfts={paginatedNfts} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
            ) : (
              <div className="space-y-3">
                {paginatedNfts.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
                    <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Попробуйте изменить параметры поиска</p>
                  </div>
                ) : (
                  paginatedNfts.map(nft => (
                    <NFTListRow
                      key={nft.id}
                      nft={nft}
                      isFavorite={isFavorite(nft.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))
                )}
              </div>
            )}

            <Pagination
              currentPage={page}
              totalItems={filteredNfts.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
