import { web3Service } from './web3';
import { makeNftId } from '@/types';
import type { NFT, Trait } from '@/types';

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
];

function resolveUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('ipfs://')) return IPFS_GATEWAYS[0] + url.slice(7);
  if (url.startsWith('ar://')) return 'https://arweave.net/' + url.slice(5);
  return url;
}

interface RawMetadata {
  name?: string;
  description?: string;
  image?: string;
  image_url?: string;
  attributes?: Array<{ trait_type?: string; value?: string | number }>;
}

const CACHE_KEY = 'nft-gallery-cache-v2';
const CACHE_TTL = 1000 * 60 * 60;

function loadCache(): Record<string, { nft: NFT; ts: number }> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, { nft: NFT; ts: number }>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* quota exceeded */ }
}

class NftService {
  private memCache = new Map<string, NFT>();
  private inFlight = new Map<string, Promise<NFT>>();

  constructor() {
    const stored = loadCache();
    const now = Date.now();
    for (const [id, entry] of Object.entries(stored)) {
      if (now - entry.ts < CACHE_TTL) {
        this.memCache.set(id, entry.nft);
      }
    }
  }

  getCached(id: string): NFT | undefined {
    return this.memCache.get(id);
  }

  getAllCached(): NFT[] {
    return [...this.memCache.values()];
  }

  async fetchNft(contractAddress: string, tokenId: number, collectionSlug: string): Promise<NFT> {
    const id = makeNftId(contractAddress, tokenId);

    const cached = this.memCache.get(id);
    if (cached) return cached;

    const existing = this.inFlight.get(id);
    if (existing) return existing;

    const promise = this._doFetch(contractAddress, tokenId, collectionSlug, id);
    this.inFlight.set(id, promise);

    try {
      return await promise;
    } finally {
      this.inFlight.delete(id);
    }
  }

  private async _doFetch(contractAddress: string, tokenId: number, collectionSlug: string, id: string): Promise<NFT> {
    const [tokenURI, owner] = await Promise.all([
      web3Service.getNFTTokenURI(contractAddress, tokenId),
      web3Service.getNFTOwner(contractAddress, tokenId).catch(() => '0x0000000000000000000000000000000000000000'),
    ]);

    const metadata = await this.resolveMetadata(tokenURI);

    const nft: NFT = {
      id,
      contractAddress: contractAddress.toLowerCase(),
      tokenId,
      name: metadata.name || `#${tokenId}`,
      description: metadata.description || '',
      image: resolveUrl(metadata.image || metadata.image_url || ''),
      ownerAddress: owner,
      traits: (metadata.attributes || [])
        .filter(a => a.trait_type)
        .map((a): Trait => ({ traitType: a.trait_type!, value: String(a.value ?? '') })),
      collectionSlug,
    };

    this.memCache.set(id, nft);
    this.persistToStorage(id, nft);

    return nft;
  }

  private async resolveMetadata(tokenURI: string): Promise<RawMetadata> {
    if (tokenURI.startsWith('data:application/json;base64,')) {
      return JSON.parse(atob(tokenURI.split(',')[1]!));
    }
    if (tokenURI.startsWith('data:application/json')) {
      return JSON.parse(decodeURIComponent(tokenURI.split(',')[1]!));
    }

    const url = resolveUrl(tokenURI);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  private persistToStorage(id: string, nft: NFT) {
    const cache = loadCache();
    cache[id] = { nft, ts: Date.now() };

    const keys = Object.keys(cache);
    if (keys.length > 100) {
      const sorted = keys.sort((a, b) => (cache[a]!.ts - cache[b]!.ts));
      for (const k of sorted.slice(0, keys.length - 80)) {
        delete cache[k];
      }
    }

    saveCache(cache);
  }

  async fetchBatch(
    contractAddress: string,
    tokenIds: number[],
    collectionSlug: string,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<NFT[]> {
    const results: NFT[] = [];
    let loaded = 0;

    const promises = tokenIds.map(async (tid) => {
      try {
        const nft = await this.fetchNft(contractAddress, tid, collectionSlug);
        results.push(nft);
      } catch {
        // skip failed tokens
      } finally {
        loaded++;
        onProgress?.(loaded, tokenIds.length);
      }
    });

    await Promise.allSettled(promises);
    return results.sort((a, b) => a.tokenId - b.tokenId);
  }

  private startIdCache = new Map<string, number>();

  async detectStartId(contractAddress: string): Promise<number> {
    const key = contractAddress.toLowerCase();
    const cached = this.startIdCache.get(key);
    if (cached !== undefined) return cached;

    try {
      await web3Service.getNFTTokenURI(contractAddress, 0);
      this.startIdCache.set(key, 0);
      return 0;
    } catch {
      this.startIdCache.set(key, 1);
      return 1;
    }
  }

  async fetchRange(
    contractAddress: string,
    collectionSlug: string,
    from: number,
    count: number,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<NFT[]> {
    const ids = Array.from({ length: count }, (_, i) => from + i);
    return this.fetchBatch(contractAddress, ids, collectionSlug, onProgress);
  }
}

export const nftService = new NftService();
