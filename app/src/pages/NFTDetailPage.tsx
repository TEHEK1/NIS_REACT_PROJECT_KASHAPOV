import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { nfts } from '@/data/nfts';
import { collections } from '@/data/collections';
import { TraitBadge } from '@/components/TraitBadge';
import { NFTCard } from '@/components/NFTCard';
import { useFavorites } from '@/hooks/useFavorites';
import { formatEth, timeAgo, timeRemaining, truncateAddress } from '@/utils/format';
import { generateGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';

export default function NFTDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isConnected } = useWallet();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imgError, setImgError] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const nft = useMemo(() => nfts.find(n => n.id === id), [id]);
  const collection = useMemo(() => nft ? collections.find(c => c.id === nft.collectionId) : null, [nft]);
  const relatedNfts = useMemo(() =>
    nft ? nfts.filter(n => n.collectionId === nft.collectionId && n.id !== nft.id).slice(0, 4) : [],
    [nft]
  );

  if (!nft) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">NFT не найден</h1>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Запрошенный NFT не существует</p>
        <button onClick={() => navigate('/')} className="btn-primary">Вернуться в галерею</button>
      </div>
    );
  }

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
          {imgError ? (
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
          {collection && (
            <Link
              to={`/collections/${collection.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-nft-violet hover:text-nft-pink transition-colors font-medium mb-2"
            >
              {collection.name}
              {collection.verified && (
                <svg className="w-3.5 h-3.5 text-nft-cyan" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </Link>
          )}

          <h1 className="text-3xl sm:text-4xl font-black mb-4">{nft.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <img
              src={nft.creator.avatar}
              alt={nft.creator.name}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.background = generateGradient(nft.creator.address);
                (e.target as HTMLImageElement).src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
              }}
            />
            <div>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Создатель</p>
              <p className="text-sm font-medium">{nft.creator.name}</p>
            </div>
            <div className={`ml-4 pl-4 border-l ${isDark ? 'border-nft-border/30' : 'border-gray-200'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Владелец</p>
              <p className="text-sm font-medium">{truncateAddress(nft.ownerAddress)}</p>
            </div>
          </div>

          <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {nft.description}
          </p>

          <div className={`p-5 rounded-2xl border mb-6 ${
            isDark ? 'bg-nft-card/60 border-nft-border/30' : 'bg-gray-50 border-gray-200'
          }`}>
            {nft.isAuction && nft.auctionEndsAt ? (
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-medium">Аукцион завершится через {timeRemaining(nft.auctionEndsAt)}</span>
              </div>
            ) : (
              <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Текущая цена</p>
            )}
            <div className="flex items-baseline gap-2 mb-4">
              <svg className="w-6 h-6 text-nft-violet" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
              <span className="text-3xl font-black">{formatEth(nft.price)} ETH</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyModal(true)}
                className="btn-primary flex-1"
              >
                {nft.isAuction ? 'Сделать ставку' : 'Купить'}
              </button>
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

          <div className="flex items-center gap-4 text-sm">
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              Создан {timeAgo(nft.createdAt)}
            </span>
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              ❤ {nft.likes} отметок
            </span>
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              Token ID: #{nft.tokenId}
            </span>
          </div>
        </div>
      </div>

      {nft.traits.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Свойства</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {nft.traits.map(trait => (
              <TraitBadge key={trait.traitType} trait={trait} />
            ))}
          </div>
        </section>
      )}

      {relatedNfts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Ещё из {collection?.name}</h2>
            {collection && (
              <Link
                to={`/collections/${collection.slug}`}
                className="text-sm text-nft-violet hover:text-nft-pink transition-colors font-medium"
              >
                Смотреть все →
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedNfts.map(relNft => (
              <NFTCard key={relNft.id} nft={relNft} isFavorite={isFavorite(relNft.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        </section>
      )}

      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl p-6 border animate-slide-up ${
            isDark ? 'bg-nft-surface border-nft-border/30' : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-xl font-bold mb-2">{nft.isAuction ? 'Сделать ставку' : 'Подтвердить покупку'}</h3>
            <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {isConnected
                ? `Вы собираетесь ${nft.isAuction ? 'сделать ставку на' : 'купить'} "${nft.name}" за ${formatEth(nft.price)} ETH`
                : 'Для покупки необходимо подключить кошелёк MetaMask'
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowBuyModal(false)} className="btn-secondary flex-1">Отмена</button>
              <button
                onClick={() => setShowBuyModal(false)}
                className="btn-primary flex-1"
                disabled={!isConnected}
              >
                {isConnected ? 'Подтвердить' : 'Кошелёк не подключён'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
