import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NFT } from '@/types';
import { getCollectionByAddress } from '@/config/contracts';
import { truncateAddress } from '@/utils/format';
import { generateGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';

interface NFTListRowProps {
  nft: NFT;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const NFTListRow = memo(function NFTListRow({ nft, isFavorite, onToggleFavorite }: NFTListRowProps) {
  const [imgError, setImgError] = useState(false);
  const { isDark } = useTheme();
  const collection = getCollectionByAddress(nft.contractAddress);

  return (
    <Link
      to={`/nft/${nft.contractAddress}/${nft.tokenId}`}
      className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:-translate-y-0.5 ${
        isDark
          ? 'bg-nft-card/60 border border-nft-border/30 hover:border-nft-violet/30'
          : 'bg-white border border-gray-200 hover:border-violet-300 shadow-sm'
      }`}
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        {imgError || !nft.image ? (
          <div className="w-full h-full" style={{ background: generateGradient(nft.id) }} />
        ) : (
          <img src={nft.image} alt={nft.name} loading="lazy" onError={() => setImgError(true)}
               className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm truncate">{nft.name}</h3>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono flex-shrink-0 ${
            isDark ? 'bg-nft-violet/20 text-nft-violet' : 'bg-purple-100 text-purple-700'
          }`}>
            #{nft.tokenId}
          </span>
        </div>
        <p className={`text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {collection?.name ?? truncateAddress(nft.contractAddress)}
        </p>
      </div>

      <div className={`text-right flex-shrink-0 font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {truncateAddress(nft.ownerAddress)}
      </div>

      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(nft.id); }}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
          isFavorite ? 'text-red-500' : isDark ? 'text-gray-600 hover:text-white' : 'text-gray-300 hover:text-gray-600'
        }`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </Link>
  );
});
