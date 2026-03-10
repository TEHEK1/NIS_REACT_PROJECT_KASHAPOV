import { useState, useEffect } from 'react';
import { web3Service } from '@/services/web3';

export interface ContractInfo {
  name: string;
  symbol: string;
  totalSupply: string;
}

const cache = new Map<string, ContractInfo>();

export function useContractInfo(contractAddress: string | undefined) {
  const [info, setInfo] = useState<ContractInfo | null>(
    contractAddress ? cache.get(contractAddress.toLowerCase()) ?? null : null
  );
  const [loading, setLoading] = useState(!info && !!contractAddress);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contractAddress) return;
    const key = contractAddress.toLowerCase();
    const cached = cache.get(key);
    if (cached) {
      setInfo(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    web3Service.getContractInfo(contractAddress)
      .then(result => {
        cache.set(key, result);
        setInfo(result);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      })
      .finally(() => setLoading(false));
  }, [contractAddress]);

  return { info, loading, error };
}
