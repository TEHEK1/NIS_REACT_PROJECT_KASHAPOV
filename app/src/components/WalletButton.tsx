import { memo } from 'react';
import { useWallet } from '@/context/WalletContext';
import { truncateAddress } from '@/utils/format';

export const WalletButton = memo(function WalletButton() {
  const { isConnected, account, balance, isConnecting, connect, disconnect, isMetaMaskInstalled } = useWallet();

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl text-sm">
          <span className="text-nft-cyan font-medium">{balance} ETH</span>
        </div>
        <button
          onClick={disconnect}
          className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-medium
                     hover:border-red-500/30 transition-colors group"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="group-hover:hidden">{truncateAddress(account)}</span>
          <span className="hidden group-hover:inline text-red-400">Отключить</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50"
    >
      {isConnecting ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Подключение...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </svg>
          <span>{isMetaMaskInstalled ? 'Подключить' : 'Установить MetaMask'}</span>
        </>
      )}
    </button>
  );
});
