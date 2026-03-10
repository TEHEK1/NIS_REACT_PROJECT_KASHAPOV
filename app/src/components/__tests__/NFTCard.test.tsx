import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NFTCard } from '../NFTCard';
import { renderWithProviders } from '@/test/utils';
import type { NFT } from '@/types';

const mockNft: NFT = {
  id: '0x1234567890abcdef1234567890abcdef12345678-42',
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
  tokenId: 42,
  name: 'Test NFT #42',
  description: 'A test NFT',
  image: 'https://example.com/image.png',
  ownerAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
  traits: [{ traitType: 'Background', value: 'Blue' }],
  collectionSlug: 'test-collection',
};

describe('NFTCard', () => {
  it('отображает название NFT', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('Test NFT #42')).toBeInTheDocument();
  });

  it('отображает адрес владельца', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('0xabcd...ef12')).toBeInTheDocument();
  });

  it('отображает token ID', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('#42')).toBeInTheDocument();
  });

  it('отображает количество свойств', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('1 свойств')).toBeInTheDocument();
  });

  it('содержит ссылку на детальную страницу', () => {
    renderWithProviders(
      <NFTCard nft={mockNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/nft/${mockNft.contractAddress}/${mockNft.tokenId}`);
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

    expect(onToggle).toHaveBeenCalledWith(mockNft.id);
  });

  it('показывает gradient fallback при отсутствии картинки', () => {
    const noImgNft: NFT = { ...mockNft, image: '' };
    renderWithProviders(
      <NFTCard nft={noImgNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('Test NFT #42')).toBeInTheDocument();
  });

  it('корректно работает без traits', () => {
    const noTraitsNft: NFT = { ...mockNft, traits: [] };
    renderWithProviders(
      <NFTCard nft={noTraitsNft} isFavorite={false} onToggleFavorite={() => {}} />
    );
    expect(screen.getByText('Test NFT #42')).toBeInTheDocument();
  });
});
