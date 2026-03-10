import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NFTCard } from '../NFTCard';
import { renderWithProviders } from '@/test/utils';
import type { NFT } from '@/types';

const mockNft: NFT = {
  id: 'test-1',
  tokenId: 42,
  name: 'Test NFT #42',
  description: 'A test NFT',
  image: 'https://example.com/image.png',
  price: 2.5,
  currency: 'ETH',
  collectionId: 'cosmic-apes',
  creator: {
    address: '0x1234567890abcdef',
    name: 'TestCreator',
    avatar: 'https://example.com/avatar.png',
    verified: true,
  },
  ownerAddress: '0xabcdef1234567890',
  traits: [],
  createdAt: '2026-01-15T00:00:00Z',
  likes: 150,
  isAuction: false,
};

describe('NFTCard', () => {
  it('отображает название NFT', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('Test NFT #42')).toBeInTheDocument();
  });

  it('отображает имя создателя', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText(/TestCreator/)).toBeInTheDocument();
  });

  it('отображает цену в ETH', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText(/2\.50 ETH/)).toBeInTheDocument();
  });

  it('отображает количество лайков', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('содержит ссылку на детальную страницу', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/nft/test-1');
  });

  it('вызывает onToggleFavorite при клике на кнопку избранного', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={onToggle} />
    );

    const buttons = screen.getAllByRole('button');
    const heartBtn = buttons.find(b => b.querySelector('svg'));
    if (heartBtn) await user.click(heartBtn);

    expect(onToggle).toHaveBeenCalledWith('test-1');
  });

  it('отображает "Ставка" для аукционов', () => {
    const auctionNft: NFT = {
      ...mockNft,
      isAuction: true,
      auctionEndsAt: new Date(Date.now() + 86_400_000).toISOString(),
    };

    renderWithProviders(
      <NFTCard nft={auctionNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('Ставка')).toBeInTheDocument();
  });

  it('отображает "Цена" для обычных NFT', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('Цена')).toBeInTheDocument();
  });
});
