import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { NFT } from '@/types';
import { collections } from '@/data/collections';
import { formatEth, timeRemaining } from '@/utils/format';
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
  const collection = collections.find(c => c.id === nft.collectionId);

  return (
    <Link
      to={`/nft/${nft.id}`}
      className={`group block rounded-2xl overflow-hidden nft-card-hover ${
        isDark
          ? 'bg-nft-card/60 border border-nft-border/30'
          : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      <div className="relative aspect-square overflow-hidden">
        {imgError ? (
          <div
            className="w-full h-full"
            style={{ background: generateGradient(nft.id) }}
          />
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

        {nft.isAuction && nft.auctionEndsAt && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {timeRemaining(nft.auctionEndsAt)}
          </div>
        )}

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

        {collection && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2.5 py-1 bg-nft-violet/80 backdrop-blur-md rounded-lg text-xs font-medium text-white">
              {collection.name}
            </span>
          </div>
        )}
      </div>

      <div className={`p-4 ${isDark ? '' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <img
            src={nft.creator.avatar}
            alt={nft.creator.name}
            className="w-5 h-5 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.background = generateGradient(nft.creator.address);
              (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            }}
          />
          <span className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {nft.creator.name}
            {nft.creator.verified && (
              <svg className="inline w-3 h-3 ml-1 text-nft-cyan" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </span>
        </div>

        <h3 className="font-semibold text-sm truncate mb-3">{nft.name}</h3>

        <div className="flex items-center justify-between">
          <div>
            <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {nft.isAuction ? 'Ставка' : 'Цена'}
            </p>
            <p className="font-bold text-sm flex items-center gap-1">
              <svg className="w-3 h-3 text-nft-violet" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
              {formatEth(nft.price)} ETH
            </p>
          </div>
          <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {nft.likes}
          </div>
        </div>
      </div>
    </Link>
  );
});
