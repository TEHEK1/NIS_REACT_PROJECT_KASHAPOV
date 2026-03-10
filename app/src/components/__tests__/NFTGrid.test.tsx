import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { NFTGrid } from '../NFTGrid';
import { renderWithProviders } from '@/test/utils';
import type { NFT } from '@/types';

const makeNft = (id: string, name: string): NFT => ({
  id, tokenId: 1, name, description: '', image: '',
  price: 1, currency: 'ETH', collectionId: 'col',
  creator: { address: '0x', name: 'C', avatar: '', verified: false },
  ownerAddress: '0x', traits: [], createdAt: '2026-01-01T00:00:00Z',
  likes: 0, isAuction: false,
});

describe('NFTGrid', () => {
  it('рендерит карточки для каждого NFT', () => {
    const nfts = [makeNft('1', 'First'), makeNft('2', 'Second'), makeNft('3', 'Third')];

    renderWithProviders(
      <NFTGrid nfts={nfts} isFavorite={() => false} onToggleFavorite={() => {}} />
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });

  it('показывает пустое состояние когда нет NFT', () => {
    renderWithProviders(
      <NFTGrid nfts={[]} isFavorite={() => false} onToggleFavorite={() => {}} />
    );

    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
    expect(screen.getByText('Попробуйте изменить параметры поиска')).toBeInTheDocument();
  });
});
