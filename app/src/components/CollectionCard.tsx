import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Collection } from '@/types';
import { formatEth, formatNumber } from '@/utils/format';
import { generateGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard = memo(function CollectionCard({ collection }: CollectionCardProps) {
  const [coverError, setCoverError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { isDark } = useTheme();

  return (
    <Link
      to={`/collections/${collection.slug}`}
      className={`group block rounded-2xl overflow-hidden nft-card-hover ${
        isDark ? 'bg-nft-card/60 border border-nft-border/30' : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      <div className="relative h-40 overflow-hidden">
        {coverError ? (
          <div className="w-full h-full" style={{ background: generateGradient(collection.id) }} />
        ) : (
          <img
            src={collection.coverImage}
            alt={collection.name}
            loading="lazy"
            onError={() => setCoverError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="relative px-5 pb-5">
        <div className="-mt-8 mb-3 relative z-10 flex items-end gap-3">
          {avatarError ? (
            <div className="w-16 h-16 rounded-xl border-4 border-nft-dark" style={{ background: generateGradient(collection.id + '-avatar') }} />
          ) : (
            <img
              src={collection.avatarImage}
              alt=""
              onError={() => setAvatarError(true)}
              className={`w-16 h-16 rounded-xl object-cover border-4 ${isDark ? 'border-nft-card' : 'border-white'}`}
            />
          )}
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-bold text-white text-shadow">{collection.name}</h3>
            {collection.verified && (
              <svg className="w-4 h-4 text-nft-cyan flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>

        <p className={`text-sm line-clamp-2 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {collection.description}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Floor', value: `${formatEth(collection.floorPrice)} ETH` },
            { label: 'Объём', value: `${formatNumber(collection.totalVolume)} ETH` },
            { label: 'Элементы', value: formatNumber(collection.itemCount) },
          ].map(stat => (
            <div key={stat.label} className={`text-center p-2 rounded-lg ${isDark ? 'bg-nft-dark/50' : 'bg-gray-50'}`}>
              <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
              <p className="text-sm font-semibold mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
});
