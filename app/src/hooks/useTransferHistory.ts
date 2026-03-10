import { useState, useEffect, useCallback } from 'react';
import { web3Service } from '@/services/web3';
import { useWallet } from '@/context/WalletContext';
import type { TransferEvent } from '@/types';

interface TransferHistoryState {
  events: TransferEvent[];
  loading: boolean;
  error: string | null;
  contractName: string | null;
  contractSymbol: string | null;
}

export function useTransferHistory(contractAddress?: string, tokenId?: number) {
  const wallet = useWallet();

  const [data, setData] = useState<TransferHistoryState>({
    events: [],
    loading: false,
    error: null,
    contractName: null,
    contractSymbol: null,
  });

  const fetchHistory = useCallback(async (address: string, id: number) => {
    if (!wallet.isConnected) {
      setData(prev => ({ ...prev, error: 'Подключите кошелёк для загрузки on-chain истории', loading: false }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null, events: [] }));

    try {
      const [events, info] = await Promise.all([
        web3Service.getTransferHistory(address, id),
        web3Service.getContractInfo(address).catch(() => null),
      ]);

      setData({
        events,
        loading: false,
        error: events.length === 0 ? 'Нет Transfer-событий за последние ~50,000 блоков' : null,
        contractName: info?.name ?? null,
        contractSymbol: info?.symbol ?? null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setData(prev => ({
        ...prev,
        loading: false,
        error: `Ошибка загрузки: ${message}`,
      }));
    }
  }, [wallet.isConnected]);

  useEffect(() => {
    if (contractAddress && tokenId !== undefined) {
      fetchHistory(contractAddress, tokenId);
    }
  }, [contractAddress, tokenId, fetchHistory]);

  return {
    ...data,
    refetch: fetchHistory,
  };
}
