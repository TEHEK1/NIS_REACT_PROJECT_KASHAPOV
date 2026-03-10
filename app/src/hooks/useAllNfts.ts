import { useState, useEffect, useCallback } from 'react';
import { nftService } from '@/services/nftService';
import { COLLECTIONS } from '@/config/contracts';
import type { NFT } from '@/types';

export function useAllNfts() {
  const [nfts, setNfts] = useState<NFT[]>(() => nftService.getAllCached());
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const totalTokens = COLLECTIONS.reduce((s, c) => s + c.tokenIds.length, 0);
    let globalLoaded = 0;
    setProgress({ loaded: 0, total: totalTokens });

    try {
      const batches = await Promise.allSettled(
        COLLECTIONS.map(col =>
          nftService.fetchBatch(col.contractAddress, col.tokenIds, col.slug, (n) => {
            globalLoaded++;
            setProgress({ loaded: globalLoaded, total: totalTokens });
            void n;
          })
        )
      );

      const all: NFT[] = [];
      for (const result of batches) {
        if (result.status === 'fulfilled') {
          all.push(...result.value);
        }
      }

      setNfts(all);
      if (all.length === 0) {
        setError('Не удалось загрузить NFT. Проверьте подключение к сети.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { nfts, loading, error, progress, refetch: fetchAll };
}
