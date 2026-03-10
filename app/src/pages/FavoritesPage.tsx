import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { nfts } from '@/data/nfts';
import { NFTGrid } from '@/components/NFTGrid';
import { useFavorites } from '@/hooks/useFavorites';
import { useTheme } from '@/context/ThemeContext';

export default function FavoritesPage() {
  const { isDark } = useTheme();
  const { favorites, isFavorite, toggleFavorite, count } = useFavorites();

  const favoriteNfts = useMemo(
    () => nfts.filter(nft => favorites.has(nft.id)),
    [favorites]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">
          Избранное
          {count > 0 && (
            <span className="ml-3 text-lg font-normal text-nft-violet">{count}</span>
          )}
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          Ваши сохранённые NFT
        </p>
      </div>

      {favoriteNfts.length > 0 ? (
        <NFTGrid nfts={favoriteNfts} isFavorite={isFavorite} onToggleFavorite={toggleFavorite} />
      ) : (
        <div className="text-center py-20">
          <svg className={`w-20 h-20 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">У вас пока нет избранных NFT</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Нажмите на сердечко на любой карточке, чтобы добавить в избранное
          </p>
          <Link to="/" className="btn-primary inline-flex">Перейти в галерею</Link>
        </div>
      )}
    </div>
  );
}
