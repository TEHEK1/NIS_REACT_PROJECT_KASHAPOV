import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';

const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const NFTDetailPage = lazy(() => import('@/pages/NFTDetailPage'));
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('@/pages/CollectionDetailPage'));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'));
const WalletPage = lazy(() => import('@/pages/WalletPage'));
const AddressPage = lazy(() => import('@/pages/AddressPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-nft-violet/30 border-t-nft-violet rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Загрузка...</span>
      </div>
    </div>
  );
}

function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(GalleryPage) },
      { path: 'nft/:contract/:tokenId', element: withSuspense(NFTDetailPage) },
      { path: 'collections', element: withSuspense(CollectionsPage) },
      { path: 'collections/:slug', element: withSuspense(CollectionDetailPage) },
      { path: 'favorites', element: withSuspense(FavoritesPage) },
      { path: 'address/:address', element: withSuspense(AddressPage) },
      { path: 'wallet', element: withSuspense(WalletPage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);
