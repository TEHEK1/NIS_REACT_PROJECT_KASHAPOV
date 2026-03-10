import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { CollectionConfig } from '@/types';
import { useContractInfo } from '@/hooks/useContractInfo';
import { truncateAddress } from '@/utils/format';
import { generateGradient, generateAvatarGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';

interface CollectionCardProps {
  collection: CollectionConfig;
}

export const CollectionCard = memo(function CollectionCard({ collection }: CollectionCardProps) {
  const { isDark } = useTheme();
  const { info, loading } = useContractInfo(collection.contractAddress);

  return (
    <Link
      to={`/collections/${collection.slug}`}
      className={`group block rounded-2xl overflow-hidden nft-card-hover ${
        isDark ? 'bg-nft-card/60 border border-nft-border/30' : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      <div className="relative h-40 overflow-hidden">
        <div
          className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          style={{ background: generateGradient(collection.contractAddress) }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="relative px-5 pb-5">
        <div className="-mt-8 mb-3 relative z-10 flex items-end gap-3">
          <div
            className={`w-16 h-16 rounded-xl border-4 flex items-center justify-center text-xl font-black text-white/80 ${isDark ? 'border-nft-card' : 'border-white'}`}
            style={{ background: generateAvatarGradient(collection.slug) }}
          >
            {info?.symbol?.slice(0, 3) ?? '...'}
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            {loading ? (
              <div className={`h-5 w-32 rounded animate-pulse ${isDark ? 'bg-nft-border/30' : 'bg-gray-300'}`} />
            ) : (
              <h3 className="font-bold text-white text-shadow">{info?.name ?? truncateAddress(collection.contractAddress)}</h3>
            )}
          </div>
        </div>

        <p className={`text-sm mb-4 font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {info ? `${info.symbol} · Total Supply: ${Number(info.totalSupply).toLocaleString()}` : truncateAddress(collection.contractAddress)}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-nft-dark/50' : 'bg-gray-50'}`}>
            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Контракт</p>
            <p className="text-sm font-mono font-semibold mt-0.5">{truncateAddress(collection.contractAddress)}</p>
          </div>
          <div className={`text-center p-2 rounded-lg ${isDark ? 'bg-nft-dark/50' : 'bg-gray-50'}`}>
            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Supply</p>
            <p className="text-sm font-semibold mt-0.5">{info ? Number(info.totalSupply).toLocaleString() : '...'}</p>
          </div>
        </div>
      </div>
    </Link>
  );
});
