import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { web3Service } from '@/services/web3';
import { StatsCard } from '@/components/StatsCard';
import { truncateAddress } from '@/utils/format';
import { generateAvatarGradient } from '@/utils/gradient';
import { useTheme } from '@/context/ThemeContext';

interface AddressInfo {
  balance: string;
  txCount: number;
}

export default function AddressPage() {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [info, setInfo] = useState<AddressInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError(null);

    const web3 = web3Service.getReadOnlyWeb3();
    Promise.all([
      web3.eth.getBalance(address),
      web3.eth.getTransactionCount(address),
    ])
      .then(([balanceWei, txCount]) => {
        setInfo({
          balance: parseFloat(web3.utils.fromWei(balanceWei, 'ether')).toFixed(4),
          txCount: Number(txCount),
        });
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      })
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Адрес не указан</h1>
        <button onClick={() => navigate('/')} className="btn-primary">Вернуться</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
        <div
          className="w-24 h-24 rounded-2xl flex-shrink-0"
          style={{ background: generateAvatarGradient(address) }}
        />
        <div>
          <h1 className="text-2xl font-black mb-1">Ethereum Address</h1>
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-nft-violet hover:text-nft-pink transition-colors break-all"
          >
            {address}
          </a>
          <p className={`mt-1 font-mono text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {truncateAddress(address)}
          </p>
        </div>
      </div>

      {error && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className={`h-24 rounded-xl animate-pulse ${isDark ? 'bg-nft-card/60' : 'bg-gray-100'}`} />
          ))}
        </div>
      ) : info && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" /></svg>}
            label="Баланс"
            value={`${info.balance} ETH`}
          />
          <StatsCard
            icon={<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            label="Транзакций"
            value={info.txCount.toLocaleString()}
            gradient="from-nft-cyan to-blue-500"
          />
        </div>
      )}

      <div className={`mt-8 p-6 rounded-2xl border ${isDark ? 'bg-nft-card/40 border-nft-border/30' : 'bg-white border-gray-200'}`}>
        <h2 className="font-bold mb-2">Данные загружены из Ethereum</h2>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Баланс и количество транзакций получены напрямую из блокчейна через Web3.js.
          Для более детальной информации используйте ссылку на Etherscan выше.
        </p>
      </div>
    </div>
  );
}
