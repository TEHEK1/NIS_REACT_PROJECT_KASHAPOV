import { memo, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { useTransferHistory } from '@/hooks/useTransferHistory';
import { truncateAddress } from '@/utils/format';
import type { TransferEvent } from '@/types';

const KNOWN_CONTRACTS = [
  { name: 'Bored Ape YC', address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' },
  { name: 'Azuki', address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544' },
  { name: 'Pudgy Penguins', address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8' },
  { name: 'Doodles', address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e' },
  { name: 'CryptoPunks (Wrapped)', address: '0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6' },
  { name: 'Cool Cats', address: '0x1A92f7381B9F03921564a437210bB9396471050C' },
];

interface ActivityTableProps {
  nftId: string;
  initialContract?: string;
  initialTokenId?: number;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function EventRow({ event, isDark }: { event: TransferEvent; isDark: boolean }) {
  const isMint = event.type === 'mint';
  const etherscanBase = 'https://etherscan.io';

  return (
    <tr className={`border-t ${isDark ? 'border-nft-border/20' : 'border-gray-50'} hover:bg-white/5 transition-colors`}>
      <td className="px-5 py-3">
        <span className="flex items-center gap-2">
          <span>{isMint ? '✨' : '↗️'}</span>
          <span className={`font-medium ${isMint ? 'text-nft-lime' : ''}`}>
            {isMint ? 'Mint' : 'Transfer'}
          </span>
        </span>
      </td>
      <td className={`px-5 py-3 font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {isMint ? (
          <span className="text-nft-lime">Null Address</span>
        ) : (
          <a
            href={`${etherscanBase}/address/${event.from}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-nft-violet transition-colors"
          >
            {truncateAddress(event.from)}
          </a>
        )}
      </td>
      <td className={`px-5 py-3 font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <a
          href={`${etherscanBase}/address/${event.to}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-nft-violet transition-colors"
        >
          {truncateAddress(event.to)}
        </a>
      </td>
      <td className={`px-5 py-3 hidden md:table-cell font-mono text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <a
          href={`${etherscanBase}/block/${event.blockNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-nft-cyan transition-colors"
        >
          #{event.blockNumber.toLocaleString()}
        </a>
      </td>
      <td className={`px-5 py-3 hidden lg:table-cell ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <a
          href={`${etherscanBase}/tx/${event.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs hover:text-nft-violet transition-colors"
        >
          {event.txHash.slice(0, 10)}...
        </a>
      </td>
      <td className={`px-5 py-3 text-right text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {formatTimestamp(event.timestamp)}
      </td>
    </tr>
  );
}

export const ActivityTable = memo(function ActivityTable({ initialContract, initialTokenId }: ActivityTableProps) {
  const { isDark } = useTheme();
  const wallet = useWallet();

  const [contractInput, setContractInput] = useState(initialContract ?? '');
  const [tokenIdInput, setTokenIdInput] = useState(initialTokenId?.toString() ?? '1');
  const [activeContract, setActiveContract] = useState(initialContract);
  const [activeTokenId, setActiveTokenId] = useState(initialTokenId);

  const { events, loading, error, contractName, contractSymbol } = useTransferHistory(activeContract, activeTokenId);

  const handleSearch = () => {
    const trimmed = contractInput.trim();
    const tid = parseInt(tokenIdInput, 10);
    if (trimmed.startsWith('0x') && trimmed.length === 42 && !isNaN(tid) && tid >= 0) {
      setActiveContract(trimmed);
      setActiveTokenId(tid);
    }
  };

  const handlePreset = (address: string) => {
    setContractInput(address);
    setTokenIdInput('1');
    setActiveContract(address);
    setActiveTokenId(1);
  };

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark ? 'bg-nft-card/40 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className={`px-5 py-4 border-b ${isDark ? 'border-nft-border/30' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="text-nft-cyan">⛓</span> On-Chain Transfer History
            </h3>
            {contractName && (
              <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {contractName} ({contractSymbol})
              </p>
            )}
          </div>
          {events.length > 0 && (
            <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-nft-violet/20 text-nft-violet' : 'bg-purple-100 text-purple-700'}`}>
              {events.length} событий
            </span>
          )}
        </div>
      </div>

      <div className={`px-5 py-4 border-b ${isDark ? 'border-nft-border/30' : 'border-gray-100'}`}>
        <div className="flex flex-wrap gap-2 mb-3">
          {KNOWN_CONTRACTS.map(c => (
            <button
              key={c.address}
              onClick={() => handlePreset(c.address)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeContract === c.address
                  ? isDark ? 'bg-nft-violet/30 border-nft-violet text-white' : 'bg-purple-100 border-purple-400 text-purple-800'
                  : isDark ? 'border-nft-border/30 text-gray-400 hover:border-nft-violet/50 hover:text-white' : 'border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Contract Address
            </label>
            <input
              type="text"
              value={contractInput}
              onChange={e => setContractInput(e.target.value)}
              placeholder="0x..."
              className={`w-full px-3 py-2 rounded-lg text-sm font-mono border ${
                isDark
                  ? 'bg-nft-dark/50 border-nft-border/30 text-white placeholder-gray-600 focus:border-nft-violet'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400'
              } outline-none transition-colors`}
            />
          </div>
          <div className="w-28">
            <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Token ID
            </label>
            <input
              type="number"
              value={tokenIdInput}
              onChange={e => setTokenIdInput(e.target.value)}
              min="0"
              placeholder="1"
              className={`w-full px-3 py-2 rounded-lg text-sm font-mono border ${
                isDark
                  ? 'bg-nft-dark/50 border-nft-border/30 text-white placeholder-gray-600 focus:border-nft-violet'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400'
              } outline-none transition-colors`}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !wallet.isConnected}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              loading || !wallet.isConnected
                ? 'opacity-50 cursor-not-allowed bg-gray-500 text-gray-300'
                : 'bg-gradient-to-r from-nft-violet to-nft-cyan text-white hover:shadow-lg hover:shadow-nft-violet/25'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Загрузка...
              </span>
            ) : (
              'Загрузить'
            )}
          </button>
        </div>

        {!wallet.isConnected && (
          <p className={`mt-3 text-sm flex items-center gap-2 ${isDark ? 'text-yellow-400/80' : 'text-yellow-600'}`}>
            <span>⚠️</span>
            Подключите MetaMask-кошелёк для чтения данных из блокчейна
          </p>
        )}
      </div>

      {error && !loading && (
        <div className={`px-5 py-4 text-sm ${isDark ? 'text-red-400' : 'text-red-500'}`}>
          {error}
        </div>
      )}

      {loading && (
        <div className="px-5 py-12 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-nft-violet/30 border-t-nft-violet rounded-full animate-spin" />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Читаем Transfer-логи из блокчейна...
          </p>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                <th className="px-5 py-3 text-left font-medium text-xs uppercase tracking-wider">Событие</th>
                <th className="px-5 py-3 text-left font-medium text-xs uppercase tracking-wider">От</th>
                <th className="px-5 py-3 text-left font-medium text-xs uppercase tracking-wider">Кому</th>
                <th className="px-5 py-3 text-left font-medium text-xs uppercase tracking-wider hidden md:table-cell">Блок</th>
                <th className="px-5 py-3 text-left font-medium text-xs uppercase tracking-wider hidden lg:table-cell">TX Hash</th>
                <th className="px-5 py-3 text-right font-medium text-xs uppercase tracking-wider">Дата</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <EventRow key={event.txHash} event={event} isDark={isDark} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && events.length === 0 && activeContract && (
        <div className={`px-5 py-8 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Введите адрес контракта и Token ID, затем нажмите «Загрузить»
        </div>
      )}

      {!activeContract && !loading && (
        <div className={`px-5 py-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <p className="text-sm mb-1">Выберите известный контракт или введите адрес вручную</p>
          <p className="text-xs">Данные читаются напрямую из Ethereum через Web3.js</p>
        </div>
      )}
    </div>
  );
});
