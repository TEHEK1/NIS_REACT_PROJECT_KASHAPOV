export interface NFT {
  id: string;
  tokenId: number;
  name: string;
  description: string;
  image: string;
  price: number;
  currency: 'ETH';
  collectionId: string;
  creator: Creator;
  ownerAddress: string;
  traits: Trait[];
  createdAt: string;
  likes: number;
  isAuction: boolean;
  auctionEndsAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  avatarImage: string;
  floorPrice: number;
  totalVolume: number;
  itemCount: number;
  ownerCount: number;
  verified: boolean;
}

export interface Creator {
  address: string;
  name: string;
  avatar: string;
  verified: boolean;
}

export interface Trait {
  traitType: string;
  value: string;
  rarity: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'oldest' | 'most-liked';

export interface GalleryFilters {
  search: string;
  collectionId: string | null;
  priceMin: number | null;
  priceMax: number | null;
  sort: SortOption;
  onlyAuctions: boolean;
}

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  chainId: number | null;
  chainName: string | null;
  isConnecting: boolean;
  error: string | null;
}
