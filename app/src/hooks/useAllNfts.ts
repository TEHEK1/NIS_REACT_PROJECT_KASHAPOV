import { useState, useEffect, useCallback } from 'react';
import { nftService } from '@/services/nftService';
import { web3Service } from '@/services/web3';
import { contractStore } from '@/config/contracts';
import type { NFT } from '@/types';

const PER_COLLECTION = 6;

export function useAllNfts() {
  const [nfts, setNfts] = useState<NFT[]>(() => nftService.getAllCached());
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const contracts = contractStore.getAll();
    setLoading(true);
    setError(null);

    const totalTokens = contracts.length * PER_COLLECTION;
    let globalLoaded = 0;
    setProgress({ loaded: 0, total: totalTokens });

    try {
      const batches = await Promise.allSettled(
        contracts.map(async (col) => {
          const sId = await nftService.detectStartId(col.contractAddress);

          let supply = PER_COLLECTION;
          try {
            const info = await web3Service.getContractInfo(col.contractAddress);
            supply = Math.min(PER_COLLECTION, parseInt(info.totalSupply, 10) || PER_COLLECTION);
          } catch { /* use default */ }

          return nftService.fetchRange(col.contractAddress, col.slug, sId, supply, () => {
            globalLoaded++;
            setProgress({ loaded: globalLoaded, total: totalTokens });
          });
        })
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
