import { useMemo } from 'react';
import { nfts } from '@/data/nfts';
import { collections } from '@/data/collections';
import { NFTGrid } from '@/components/NFTGrid';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { StatsCard } from '@/components/StatsCard';
import { useGalleryFilters } from '@/hooks/useGalleryFilters';
import { useFavorites } from '@/hooks/useFavorites';
import { formatNumber, formatEth } from '@/utils/format';
import { useTheme } from '@/context/ThemeContext';

export default function GalleryPage() {
  const { isDark } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const {
    filters, filteredNfts, activeFilterCount,
    setSearch, setCollectionId, setPriceRange, setSort, setOnlyAuctions, resetFilters,
  } = useGalleryFilters(nfts);

  const stats = useMemo(() => ({
    totalNfts: formatNumber(nfts.length),
    totalCollections: collections.length.toString(),
    totalVolume: formatEth(collections.reduce((sum, c) => sum + c.totalVolume, 0)),
    avgPrice: formatEth(nfts.reduce((sum, n) => sum + n.price, 0) / nfts.length),
  }), []);

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
            Откройте для себя мир цифрового искусства. Исследуйте коллекции, находите уникальные NFT и подключайте кошелёк.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>}
              label="Всего NFT"
              value={stats.totalNfts}
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
              label="Коллекции"
              value={stats.totalCollections}
              gradient="from-nft-cyan to-blue-500"
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>}
              label="Объём торгов"
              value={`${stats.totalVolume} ETH`}
              gradient="from-nft-pink to-rose-500"
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              label="Средняя цена"
              value={`${stats.avgPrice} ETH`}
              gradient="from-nft-lime to-emerald-500"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0 space-y-4">
            <SearchBar value={filters.search} onChange={setSearch} />
            <FilterPanel
              collectionId={filters.collectionId}
              sort={filters.sort}
              onlyAuctions={filters.onlyAuctions}
              priceMin={filters.priceMin}
              priceMax={filters.priceMax}
              activeCount={activeFilterCount}
              onCollectionChange={setCollectionId}
              onSortChange={setSort}
              onAuctionsChange={setOnlyAuctions}
              onPriceChange={setPriceRange}
              onReset={resetFilters}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Все NFT
                <span className={`ml-2 text-sm font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {filteredNfts.length} из {nfts.length}
                </span>
              </h2>
            </div>
            <NFTGrid nfts={filteredNfts} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
          </div>
        </div>
      </section>
    </div>
  );
}
