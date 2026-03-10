import { useState, useEffect, useCallback } from 'react';
import { nftService } from '@/services/nftService';
import { getCollectionBySlug } from '@/config/contracts';
import type { NFT, CollectionConfig } from '@/types';

export function useCollectionNfts(slug: string | undefined) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<CollectionConfig | null>(null);

  const fetch = useCallback(async () => {
    if (!slug) return;
    const col = getCollectionBySlug(slug);
    if (!col) {
      setError('Коллекция не найдена');
      setLoading(false);
      return;
    }
    setCollection(col);
    setLoading(true);
    setError(null);

    try {
      const results = await nftService.fetchBatch(col.contractAddress, col.tokenIds, col.slug);
      setNfts(results);
      if (results.length === 0) {
        setError('Не удалось загрузить NFT из этой коллекции');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetch(); }, [fetch]);

  return { nfts, loading, error, collection, refetch: fetch };
}
