import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { contractStore } from '@/config/contracts';
import { useContractInfo } from '@/hooks/useContractInfo';
import { TraitBadge } from '@/components/TraitBadge';
import { ActivityTable } from '@/components/ActivityTable';
import { NftCardSkeleton } from '@/components/NftCardSkeleton';
import { useNftDetail } from '@/hooks/useNftDetail';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { truncateAddress } from '@/utils/format';
import { generateGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { makeNftId } from '@/types';
import { useEffect } from 'react';

export default function NFTDetailPage() {
  const { contract, tokenId: tokenIdParam } = useParams<{ contract: string; tokenId: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isFavorite, toggleFavorite: rawToggle } = useFavorites();
  const { addViewed } = useRecentlyViewed();
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);

  const tokenId = tokenIdParam ? parseInt(tokenIdParam, 10) : undefined;
  const { nft, loading, error } = useNftDetail(contract, tokenId);
  const entry = contract ? contractStore.getByAddress(contract) : undefined;
  const { info: contractInfo } = useContractInfo(contract);
  const nftIdStr = contract && tokenId !== undefined ? makeNftId(contract, tokenId) : '';

  useEffect(() => {
    if (nftIdStr) addViewed(nftIdStr);
  }, [nftIdStr, addViewed]);

  const toggleFavorite = useCallback((id: string) => {
    const was = isFavorite(id);
    rawToggle(id);
    toast(was ? 'Удалено из избранного' : 'Добавлено в избранное', was ? 'info' : 'success');
  }, [rawToggle, isFavorite, toast]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NftCardSkeleton />
          <div className="space-y-4">
            <div className={`h-8 rounded-lg w-3/4 animate-pulse ${isDark ? 'bg-nft-border/20' : 'bg-gray-200'}`} />
            <div className={`h-4 rounded-lg w-1/2 animate-pulse ${isDark ? 'bg-nft-border/20' : 'bg-gray-200'}`} />
            <div className={`h-20 rounded-lg animate-pulse ${isDark ? 'bg-nft-border/20' : 'bg-gray-200'}`} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">NFT не найден</h1>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {error ?? 'Не удалось загрузить данные с блокчейна'}
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">Вернуться в галерею</button>
      </div>
    );
  }

  const etherscanBase = 'https://etherscan.io';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${
          isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5m0 0l7 7m-7-7l7-7" />
        </svg>
        Назад
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-nft-border/30' : 'border-gray-200'}`}>
          {imgError || !nft.image ? (
            <div className="aspect-square w-full" style={{ background: generateGradient(nft.id) }} />
          ) : (
            <img
              src={nft.image}
              alt={nft.name}
              onError={() => setImgError(true)}
              className="w-full aspect-square object-cover"
            />
          )}
        </div>

        <div>
          {(entry || contractInfo) && (
            <Link
              to={entry ? `/collections/${entry.slug}` : '#'}
              className="inline-flex items-center gap-1.5 text-sm text-nft-violet hover:text-nft-pink transition-colors font-medium mb-2"
            >
              {contractInfo?.name ?? truncateAddress(contract ?? '')}
              {contractInfo && (
                <span className="text-xs text-gray-500 font-mono ml-1">({contractInfo.symbol})</span>
              )}
            </Link>
          )}

          <h1 className="text-3xl sm:text-4xl font-black mb-4">{nft.name}</h1>

          <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {nft.description || 'Описание отсутствует в метаданных.'}
          </p>

          <div className={`p-5 rounded-2xl border mb-6 space-y-4 ${
            isDark ? 'bg-nft-card/60 border-nft-border/30' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Владелец</span>
              <a
                href={`${etherscanBase}/address/${nft.ownerAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-nft-violet hover:text-nft-pink transition-colors"
              >
                {truncateAddress(nft.ownerAddress)}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Контракт</span>
              <a
                href={`${etherscanBase}/address/${nft.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-nft-violet hover:text-nft-pink transition-colors"
              >
                {truncateAddress(nft.contractAddress)}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Token ID</span>
              <span className="font-mono text-sm font-bold">#{nft.tokenId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Стандарт</span>
              <span className="text-sm font-medium">ERC-721</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Блокчейн</span>
              <span className="text-sm font-medium">Ethereum</span>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={`${etherscanBase}/nft/${nft.contractAddress}/${nft.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 text-center"
              >
                Etherscan
              </a>
              <button
                onClick={() => toggleFavorite(nft.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                  isFavorite(nft.id)
                    ? 'bg-red-500/20 border-red-500/30 text-red-500'
                    : isDark
                      ? 'bg-nft-card border-nft-border/50 text-gray-400 hover:text-white'
                      : 'bg-white border-gray-200 text-gray-400 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorite(nft.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {nft.traits.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Свойства ({nft.traits.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {nft.traits.map(trait => (
              <TraitBadge key={trait.traitType} trait={trait} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <ActivityTable
          nftId={nft.id}
          initialContract={nft.contractAddress}
          initialTokenId={nft.tokenId}
        />
      </section>
    </div>
  );
}
