import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NFTGrid } from '@/components/NFTGrid';
import { NftCardSkeleton } from '@/components/NftCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { useFavorites } from '@/hooks/useFavorites';
import { useCollectionNfts } from '@/hooks/useCollectionNfts';
import { useContractInfo } from '@/hooks/useContractInfo';
import { truncateAddress, formatNumber } from '@/utils/format';
import { generateGradient, generateAvatarGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');

  const { nfts, loading, loadingMore, error, collection, totalSupply, hasMore, loadMore } = useCollectionNfts(slug);
  const { info: contractInfo, loading: infoLoading } = useContractInfo(collection?.contractAddress);

  const displayName = contractInfo?.name ?? (collection ? truncateAddress(collection.contractAddress) : '...');

  const filteredNfts = useMemo(() => {
    if (!search) return nfts;
    const q = search.toLowerCase();
    return nfts.filter(n => n.name.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
  }, [nfts, search]);

  if (!collection) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Коллекция не найдена</h1>
        <button onClick={() => navigate('/collections')} className="btn-primary">Все коллекции</button>
      </div>
    );
  }

  const cardClass = `p-4 rounded-xl border ${isDark ? 'bg-nft-card/60 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'}`;
  const labelClass = `text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`;

  return (
    <div>
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <div className="w-full h-full" style={{ background: generateGradient(collection.contractAddress) }} />
        <div className="absolute inset-0 bg-gradient-to-t from-nft-dark via-nft-dark/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-10">
        <div className="flex items-end gap-4 mb-6">
          <div
            className="w-24 h-24 rounded-2xl border-4 border-nft-dark shadow-xl flex items-center justify-center text-2xl font-black text-white/80"
            style={{ background: generateAvatarGradient(collection.slug) }}
          >
            {contractInfo?.symbol?.slice(0, 4) ?? '...'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {infoLoading ? (
                <div className="h-8 w-48 rounded-lg animate-pulse bg-white/20" />
              ) : (
                <h1 className="text-3xl font-black text-white">{displayName}</h1>
              )}
            </div>
            {contractInfo && (
              <p className="text-sm text-gray-400 font-mono mt-1">{contractInfo.symbol}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className={cardClass}>
            <p className={labelClass}>Контракт</p>
            <a
              href={`https://etherscan.io/address/${collection.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono font-bold mt-1 block text-nft-violet hover:text-nft-pink transition-colors"
            >
              {truncateAddress(collection.contractAddress)}
            </a>
          </div>
          <div className={cardClass}>
            <p className={labelClass}>Total Supply</p>
            <p className="text-lg font-bold mt-1">
              {totalSupply !== null ? formatNumber(totalSupply) : contractInfo ? formatNumber(Number(contractInfo.totalSupply)) : '...'}
            </p>
          </div>
          <div className={cardClass}>
            <p className={labelClass}>Загружено</p>
            <p className="text-lg font-bold mt-1">
              {nfts.length}{totalSupply !== null ? ` / ${formatNumber(totalSupply)}` : ''}
            </p>
          </div>
          <div className={cardClass}>
            <p className={labelClass}>Стандарт</p>
            <p className="text-lg font-bold mt-1">ERC-721</p>
          </div>
        </div>

        <div className="max-w-md mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder={`Поиск в ${displayName}...`} />
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <NftCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <NFTGrid nfts={filteredNfts} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />

            {hasMore && !search && (
              <InfiniteScrollSentinel loading={loadingMore} onVisible={loadMore}>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Загружено {nfts.length} из {totalSupply !== null ? formatNumber(totalSupply) : '?'}
                </p>
              </InfiniteScrollSentinel>
            )}

            {!hasMore && nfts.length > 0 && !search && (
              <p className={`mt-8 text-center text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Все {nfts.length} NFT загружены
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InfiniteScrollSentinel({ loading, onVisible, children }: { loading: boolean; onVisible: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onVisibleRef = useRef(onVisible);
  onVisibleRef.current = onVisible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onVisibleRef.current();
      },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-8 flex flex-col items-center gap-3 py-4">
      {loading && (
        <div className="flex items-center gap-2 text-nft-violet">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 019.95 9" />
          </svg>
          <span className="text-sm font-medium">Загрузка...</span>
        </div>
      )}
      {children}
    </div>
  );
}
