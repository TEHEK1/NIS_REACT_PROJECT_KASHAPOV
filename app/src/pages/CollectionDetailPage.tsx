import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NFTGrid } from '@/components/NFTGrid';
import { NftCardSkeleton } from '@/components/NftCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { useFavorites } from '@/hooks/useFavorites';
import { useCollectionNfts } from '@/hooks/useCollectionNfts';
import { truncateAddress } from '@/utils/format';
import { generateGradient, generateAvatarGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');

  const { nfts, loading, error, collection } = useCollectionNfts(slug);

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

  return (
    <div>
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <div className="w-full h-full" style={{ background: generateGradient(collection.contractAddress) }} />
        <div className="absolute inset-0 bg-gradient-to-t from-nft-dark via-nft-dark/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-10">
        <div className="flex items-end gap-4 mb-6">
          <div
            className="w-24 h-24 rounded-2xl border-4 border-nft-dark shadow-xl"
            style={{ background: generateAvatarGradient(collection.slug) }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white">{collection.name}</h1>
              {collection.verified && (
                <svg className="w-5 h-5 text-nft-cyan" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <p className={`max-w-3xl mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {collection.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-nft-card/60 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Контракт</p>
            <a
              href={`https://etherscan.io/address/${collection.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono font-bold mt-1 block text-nft-violet hover:text-nft-pink transition-colors"
            >
              {truncateAddress(collection.contractAddress)}
            </a>
          </div>
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-nft-card/60 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Загружено</p>
            <p className="text-lg font-bold mt-1">{nfts.length} / {collection.tokenIds.length}</p>
          </div>
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-nft-card/60 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'}`}>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Стандарт</p>
            <p className="text-lg font-bold mt-1">ERC-721</p>
          </div>
        </div>

        <div className="max-w-md mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder={`Поиск в ${collection.name}...`} />
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: collection.tokenIds.length }).map((_, i) => (
              <NftCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <NFTGrid nfts={filteredNfts} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
        )}
      </div>
    </div>
  );
}
