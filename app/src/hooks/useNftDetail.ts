import { useState, useEffect, useCallback } from 'react';
import { nftService } from '@/services/nftService';
import { getCollectionByAddress } from '@/config/contracts';
import type { NFT } from '@/types';

export function useNftDetail(contractAddress: string | undefined, tokenId: number | undefined) {
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!contractAddress || tokenId === undefined) {
      setLoading(false);
      return;
    }

    const col = getCollectionByAddress(contractAddress);
    const slug = col?.slug ?? 'unknown';

    setLoading(true);
    setError(null);

    try {
      const result = await nftService.fetchNft(contractAddress, tokenId, slug);
      setNft(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить NFT');
    } finally {
      setLoading(false);
    }
  }, [contractAddress, tokenId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { nft, loading, error, refetch: fetch };
}
