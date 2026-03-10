import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collections } from '@/data/collections';
import { nfts } from '@/data/nfts';
import { NFTGrid } from '@/components/NFTGrid';
import { SearchBar } from '@/components/SearchBar';
import { useFavorites } from '@/hooks/useFavorites';
import { formatEth, formatNumber } from '@/utils/format';
import { generateGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [coverError, setCoverError] = useState(false);

  const collection = useMemo(() => collections.find(c => c.slug === slug), [slug]);

  const collectionNfts = useMemo(() => {
    if (!collection) return [];
    let result = nfts.filter(n => n.collectionId === collection.id);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(n => n.name.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
    }
    return result;
  }, [collection, search]);

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
        {coverError ? (
          <div className="w-full h-full" style={{ background: generateGradient(collection.id) }} />
        ) : (
          <img
            src={collection.coverImage}
            alt={collection.name}
            onError={() => setCoverError(true)}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-nft-dark via-nft-dark/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-10">
        <div className="flex items-end gap-4 mb-6">
          <img
            src={collection.avatarImage}
            alt=""
            className="w-24 h-24 rounded-2xl object-cover border-4 border-nft-dark shadow-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).style.background = generateGradient(collection.id + '-avatar');
              (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }}
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Floor Price', value: `${formatEth(collection.floorPrice)} ETH` },
            { label: 'Объём торгов', value: `${formatNumber(collection.totalVolume)} ETH` },
            { label: 'Элементы', value: formatNumber(collection.itemCount) },
            { label: 'Владельцы', value: formatNumber(collection.ownerCount) },
          ].map(stat => (
            <div key={stat.label} className={`p-4 rounded-xl border ${
              isDark ? 'bg-nft-card/60 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
              <p className="text-lg font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="max-w-md mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder={`Поиск в ${collection.name}...`} />
        </div>

        <NFTGrid nfts={collectionNfts} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
      </div>
    </div>
  );
}
