import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { web3Service } from '@/services/web3';
import type { WalletState } from '@/types';

interface WalletContextValue extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  isMetaMaskInstalled: boolean;
}

const initialState: WalletState = {
  isConnected: false,
  account: null,
  balance: null,
  chainId: null,
  chainName: null,
  isConnecting: false,
  error: null,
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState);

  const updateWalletInfo = useCallback(async (account: string) => {
    try {
      const [balance, chainId] = await Promise.all([
        web3Service.getBalance(account),
        web3Service.getChainId(),
      ]);
      setState({
        isConnected: true,
        account,
        balance: parseFloat(balance).toFixed(4),
        chainId,
        chainName: web3Service.getChainName(chainId),
        isConnecting: false,
        error: null,
      });
    } catch {
      setState(prev => ({ ...prev, isConnecting: false, error: 'Не удалось получить данные кошелька' }));
    }
  }, []);

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    try {
      const accounts = await web3Service.connectWallet();
      if (accounts[0]) {
        await updateWalletInfo(accounts[0]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка подключения';
      setState(prev => ({ ...prev, isConnecting: false, error: message }));
    }
  }, [updateWalletInfo]);

  const disconnect = useCallback(() => {
    setState(initialState);
  }, []);

  useEffect(() => {
    if (!web3Service.isMetaMaskInstalled) return;

    web3Service.getAccounts().then(accounts => {
      if (accounts[0]) updateWalletInfo(accounts[0]);
    }).catch(() => {});

    const unsubAccounts = web3Service.onAccountsChanged(accounts => {
      if (accounts[0]) {
        updateWalletInfo(accounts[0]);
      } else {
        setState(initialState);
      }
    });

    const unsubChain = web3Service.onChainChanged(() => {
      if (state.account) updateWalletInfo(state.account);
    });

    return () => { unsubAccounts(); unsubChain(); };
  }, [updateWalletInfo, state.account]);

  return (
    <WalletContext.Provider
      value={{ ...state, connect, disconnect, isMetaMaskInstalled: web3Service.isMetaMaskInstalled }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}
