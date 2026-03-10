export interface NFT {
  id: string;
  contractAddress: string;
  tokenId: number;
  name: string;
  description: string;
  image: string;
  ownerAddress: string;
  traits: Trait[];
  collectionSlug: string;
}

export interface CollectionConfig {
  contractAddress: string;
  slug: string;
}

export interface Trait {
  traitType: string;
  value: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'token-asc' | 'token-desc';

export interface GalleryFilters {
  search: string;
  collectionSlug: string | null;
  sort: SortOption;
}

export interface TransferEvent {
  txHash: string;
  from: string;
  to: string;
  blockNumber: number;
  timestamp: number;
  type: 'mint' | 'transfer';
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

export function makeNftId(contractAddress: string, tokenId: number): string {
  return `${contractAddress.toLowerCase()}-${tokenId}`;
}

export function parseNftId(id: string): { contractAddress: string; tokenId: number } | null {
  const idx = id.lastIndexOf('-');
  if (idx === -1) return null;
  const contractAddress = id.substring(0, idx);
  const tokenId = parseInt(id.substring(idx + 1), 10);
  if (isNaN(tokenId) || !contractAddress.startsWith('0x')) return null;
  return { contractAddress, tokenId };
}
