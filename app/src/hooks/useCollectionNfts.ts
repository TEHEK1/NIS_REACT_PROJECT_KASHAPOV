import { useState, useEffect, useCallback, useRef } from 'react';
import { nftService } from '@/services/nftService';
import { web3Service } from '@/services/web3';
import { contractStore, type ContractEntry } from '@/config/contracts';
import type { NFT } from '@/types';

const PAGE_SIZE = 12;

export function useCollectionNfts(slug: string | undefined) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collection, setCollection] = useState<ContractEntry | null>(null);
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const nextOffset = useRef(0);
  const startId = useRef(0);

  const loadInitial = useCallback(async () => {
    if (!slug) return;
    const col = contractStore.getBySlug(slug);
    if (!col) {
      setError('Коллекция не найдена');
      setLoading(false);
      return;
    }
    setCollection(col);
    setLoading(true);
    setError(null);
    setNfts([]);

    try {
      const [info, sId] = await Promise.all([
        web3Service.getContractInfo(col.contractAddress),
        nftService.detectStartId(col.contractAddress),
      ]);

      const supply = parseInt(info.totalSupply, 10) || 0;
      setTotalSupply(supply);
      startId.current = sId;
      nextOffset.current = 0;

      const count = Math.min(PAGE_SIZE, supply);
      if (count === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const results = await nftService.fetchRange(col.contractAddress, col.slug, sId, count);
      setNfts(results);
      nextOffset.current = count;
      setHasMore(count < supply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const loadMore = useCallback(async () => {
    if (!collection || totalSupply === null || loadingMore) return;
    setLoadingMore(true);

    try {
      const from = startId.current + nextOffset.current;
      const remaining = totalSupply - nextOffset.current;
      const count = Math.min(PAGE_SIZE, remaining);

      if (count <= 0) {
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      const results = await nftService.fetchRange(collection.contractAddress, collection.slug, from, count);
      setNfts(prev => {
        const existing = new Set(prev.map(n => n.id));
        const fresh = results.filter(n => !existing.has(n.id));
        return [...prev, ...fresh].sort((a, b) => a.tokenId - b.tokenId);
      });
      nextOffset.current += count;
      setHasMore(nextOffset.current < totalSupply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoadingMore(false);
    }
  }, [collection, totalSupply, loadingMore]);

  useEffect(() => { loadInitial(); }, [loadInitial]);

  return { nfts, loading, loadingMore, error, collection, totalSupply, hasMore, loadMore, refetch: loadInitial };
}
