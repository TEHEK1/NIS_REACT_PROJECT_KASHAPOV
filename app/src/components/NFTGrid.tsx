import { memo } from 'react';
import type { NFT } from '@/types';
import { NFTCard } from './NFTCard';
import { useTheme } from '@/context/ThemeContext';

interface NFTGridProps {
  nfts: NFT[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export const NFTGrid = memo(function NFTGrid({ nfts, isFavorite, onToggleFavorite }: NFTGridProps) {
  const { isDark } = useTheme();

  if (nfts.length === 0) {
    return (
      <div className="text-center py-20">
        <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
        <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Попробуйте изменить параметры поиска</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {nfts.map((nft, index) => (
        <div
          key={nft.id}
          className="animate-fade-in"
          style={{ animationDelay: `${Math.min(index * 50, 400)}ms`, animationFillMode: 'both' }}
        >
          <NFTCard nft={nft} isFavorite={isFavorite(nft.id)} onToggleFavorite={onToggleFavorite} />
        </div>
      ))}
    </div>
  );
});
