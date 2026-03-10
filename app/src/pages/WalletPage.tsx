import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useTheme } from '@/context/ThemeContext';
import { StatsCard } from '@/components/StatsCard';
import { web3Service } from '@/services/web3';
import { truncateAddress } from '@/utils/format';

export default function WalletPage() {
  const { isDark } = useTheme();
  const { isConnected, account, balance, chainName, chainId, connect, isMetaMaskInstalled, error } = useWallet();
  const [blockNumber, setBlockNumber] = useState<string>('—');
  const [gasPrice, setGasPrice] = useState<string>('—');

  useEffect(() => {
    if (!isConnected) return;
    let cancelled = false;

    async function fetchChainData() {
      try {
        const [block, gas] = await Promise.all([
          web3Service.getBlockNumber(),
          web3Service.getGasPrice(),
        ]);
        if (!cancelled) {
          setBlockNumber(block.toLocaleString());
          setGasPrice(`${parseFloat(gas).toFixed(2)} Gwei`);
        }
      } catch { /* ignore */ }
    }

    fetchChainData();
    const interval = setInterval(fetchChainData, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [isConnected]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Кошелёк</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          Управление подключением к блокчейну через Web3.js
        </p>
      </div>

      {!isConnected ? (
        <div className={`max-w-lg mx-auto text-center p-10 rounded-2xl border ${
          isDark ? 'bg-nft-surface/50 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-nft-violet to-nft-pink flex items-center justify-center">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2.5" />
              <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold mb-3">Подключите кошелёк</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Подключите MetaMask для взаимодействия с блокчейном Ethereum через Web3.js
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {isMetaMaskInstalled ? (
            <button onClick={connect} className="btn-primary">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Подключить MetaMask
              </span>
            </button>
          ) : (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Установить MetaMask
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3" />
              </svg>
            </a>
          )}

          <div className={`mt-8 p-4 rounded-xl text-left text-sm ${
            isDark ? 'bg-nft-card/60 text-gray-300' : 'bg-gray-50 text-gray-600'
          }`}>
            <h3 className="font-semibold mb-2">Что такое Web3.js?</h3>
            <p>
              Web3.js — это JavaScript-библиотека для взаимодействия с блокчейном Ethereum.
              Она позволяет подключаться к узлам Ethereum, отправлять транзакции,
              читать данные смарт-контрактов и работать с кошельками.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-nft-surface/50 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="font-semibold text-green-400">Подключено</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Адрес</p>
                <p className="font-mono text-sm mt-1 break-all">{account}</p>
              </div>
              <div>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Сеть</p>
                <p className="text-sm mt-1 font-medium">
                  {chainName}
                  <span className={`ml-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    (Chain ID: {chainId})
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>}
              label="Баланс"
              value={`${balance} ETH`}
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>}
              label="Сеть"
              value={chainName ?? '—'}
              gradient="from-nft-cyan to-blue-500"
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>}
              label="Последний блок"
              value={blockNumber}
              gradient="from-nft-pink to-rose-500"
            />
            <StatsCard
              icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              label="Gas Price"
              value={gasPrice}
              gradient="from-nft-lime to-emerald-500"
            />
          </div>

          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-nft-surface/50 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <h2 className="text-lg font-bold mb-4">Web3.js — Взаимодействие с блокчейном</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl font-mono text-sm overflow-x-auto ${
                isDark ? 'bg-nft-dark' : 'bg-gray-50'
              }`}>
                <p className="text-nft-cyan">// Подключение к MetaMask через Web3.js</p>
                <p><span className="text-nft-pink">const</span> web3 = <span className="text-nft-pink">new</span> <span className="text-nft-lime">Web3</span>(window.ethereum);</p>
                <p><span className="text-nft-pink">const</span> accounts = <span className="text-nft-pink">await</span> web3.eth.<span className="text-nft-lime">requestAccounts</span>();</p>
                <br />
                <p className="text-nft-cyan">// Чтение баланса кошелька</p>
                <p><span className="text-nft-pink">const</span> balance = <span className="text-nft-pink">await</span> web3.eth.<span className="text-nft-lime">getBalance</span>(account);</p>
                <p><span className="text-nft-pink">const</span> ethBalance = web3.utils.<span className="text-nft-lime">fromWei</span>(balance, <span className="text-amber-400">&apos;ether&apos;</span>);</p>
                <br />
                <p className="text-nft-cyan">// Взаимодействие с ERC-721 контрактом</p>
                <p><span className="text-nft-pink">const</span> contract = <span className="text-nft-pink">new</span> web3.eth.<span className="text-nft-lime">Contract</span>(abi, address);</p>
                <p><span className="text-nft-pink">const</span> owner = <span className="text-nft-pink">await</span> contract.methods.<span className="text-nft-lime">ownerOf</span>(tokenId).<span className="text-nft-lime">call</span>();</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Ваш адрес', value: truncateAddress(account!) },
                  { label: 'Chain ID', value: chainId?.toString() ?? '—' },
                  { label: 'Провайдер', value: 'MetaMask' },
                ].map(item => (
                  <div key={item.label} className={`p-3 rounded-xl text-center ${
                    isDark ? 'bg-nft-card/60' : 'bg-gray-50'
                  }`}>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</p>
                    <p className="font-medium text-sm mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
