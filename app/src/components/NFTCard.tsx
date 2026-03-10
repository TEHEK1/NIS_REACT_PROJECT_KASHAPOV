import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NFT } from '@/types';
import { contractStore } from '@/config/contracts';
import { useContractInfo } from '@/hooks/useContractInfo';
import { truncateAddress } from '@/utils/format';
import { generateGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';

interface NFTCardProps {
  nft: NFT;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const NFTCard = memo(function NFTCard({ nft, isFavorite, onToggleFavorite }: NFTCardProps) {
  const [imgError, setImgError] = useState(false);
  const { isDark } = useTheme();
  const entry = contractStore.getByAddress(nft.contractAddress);
  const { info } = useContractInfo(nft.contractAddress);

  return (
    <Link
      to={`/nft/${nft.contractAddress}/${nft.tokenId}`}
      className={`group block rounded-2xl overflow-hidden nft-card-hover ${
        isDark
          ? 'bg-nft-card/60 border border-nft-border/30'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        {imgError || !nft.image ? (
          <div className="w-full h-full" style={{ background: generateGradient(nft.id) }} />
        ) : (
          <img
            src={nft.image}
            alt={nft.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-mono text-white/80">
          #{nft.tokenId}
        </div>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(nft.id); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
                      backdrop-blur-md transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500/80 text-white scale-110'
              : 'bg-black/40 text-white/70 hover:text-white hover:bg-black/60'
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {(info || entry) && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2.5 py-1 bg-nft-violet/80 backdrop-blur-md rounded-lg text-xs font-medium text-white">
              {info?.name ?? entry?.slug}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm truncate mb-2">{nft.name}</h3>

        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="font-mono">{truncateAddress(nft.ownerAddress)}</span>
          </div>
          {nft.traits.length > 0 && (
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {nft.traits.length} свойств
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});
