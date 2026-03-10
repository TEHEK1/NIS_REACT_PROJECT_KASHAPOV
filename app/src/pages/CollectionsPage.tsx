import { useState, useCallback } from 'react';
import { CollectionCard } from '@/components/CollectionCard';
import { useContracts } from '@/hooks/useContracts';
import { useContractInfo } from '@/hooks/useContractInfo';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { web3Service } from '@/services/web3';

export default function CollectionsPage() {
  const { isDark } = useTheme();
  const { toast } = useToast();
  const { contracts, add, remove, reset } = useContracts();

  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ name: string; symbol: string; totalSupply: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidate = useCallback(async () => {
    const trimmed = address.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
      setValidationError('Некорректный Ethereum-адрес (0x + 40 hex символов)');
      return;
    }

    setValidating(true);
    setValidationError(null);
    setValidationResult(null);

    try {
      const info = await web3Service.getContractInfo(trimmed);
      if (!info.name) throw new Error('Контракт не вернул name() — возможно, это не ERC-721');
      setValidationResult(info);
    } catch (err) {
      setValidationError(
        err instanceof Error ? err.message : 'Не удалось прочитать контракт. Убедитесь, что это ERC-721.'
      );
    } finally {
      setValidating(false);
    }
  }, [address]);

  const handleAdd = useCallback(() => {
    const trimmed = address.trim();
    if (!validationResult) return;

    const slug = validationResult.symbol.toLowerCase().replace(/[^a-z0-9]/g, '-') || trimmed.slice(2, 10).toLowerCase();

    const ok = add({ contractAddress: trimmed, slug });
    if (ok) {
      toast(`${validationResult.name} добавлен в каталог`, 'success');
      setAddress('');
      setValidationResult(null);
      setShowForm(false);
    } else {
      toast('Контракт или slug уже существует в каталоге', 'error');
    }
  }, [address, validationResult, add, toast]);

  const handleRemove = useCallback((slug: string, name: string) => {
    if (!confirm(`Удалить "${name}" из каталога?`)) return;
    remove(slug);
    toast(`${name} удалён из каталога`, 'info');
  }, [remove, toast]);

  const inputClass = `w-full px-4 py-3 rounded-xl outline-none text-sm transition-all ${
    isDark
      ? 'bg-nft-card border border-nft-border/50 text-gray-200 placeholder-gray-600 focus:border-nft-violet/50'
      : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 shadow-sm'
  }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black mb-2">Коллекции</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            {contracts.length} контрактов в каталоге. Имена и totalSupply читаются on-chain.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 5v14m-7-7h14'} />
            </svg>
            {showForm ? 'Закрыть' : 'Добавить контракт'}
          </button>
          <button
            onClick={() => { reset(); toast('Каталог сброшен к начальным контрактам', 'info'); }}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isDark
                ? 'bg-nft-card border border-nft-border/50 text-gray-400 hover:text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm'
            }`}
          >
            Сбросить
          </button>
        </div>
      </div>

      {showForm && (
        <div className={`mb-8 p-6 rounded-2xl border animate-slide-up ${
          isDark ? 'bg-nft-surface/50 border-nft-border/30' : 'bg-gray-50 border-gray-200'
        }`}>
          <h2 className="font-bold text-lg mb-4">Добавить ERC-721 контракт</h2>

          <div className="space-y-4 max-w-xl">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Адрес контракта
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={e => { setAddress(e.target.value); setValidationResult(null); setValidationError(null); }}
                  placeholder="0x1234...abcd"
                  className={inputClass}
                />
                <button
                  onClick={handleValidate}
                  disabled={validating || !address.trim()}
                  className="btn-primary whitespace-nowrap disabled:opacity-50"
                >
                  {validating ? 'Проверка...' : 'Проверить'}
                </button>
              </div>
            </div>

            {validationError && (
              <div className={`p-3 rounded-xl text-sm ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
                {validationError}
              </div>
            )}

            {validationResult && (
              <>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Контракт валиден</span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-bold">{validationResult.name}</span>
                    {' '}({validationResult.symbol})
                    {' · '}Total Supply: {Number(validationResult.totalSupply).toLocaleString()}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Первые 12 NFT будут загружены автоматически. Остальные — по кнопке «Загрузить ещё».
                  </p>
                </div>

                <button onClick={handleAdd} className="btn-primary w-full">
                  Добавить {validationResult.name} в каталог
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map((entry, index) => (
          <div
            key={entry.slug}
            className="relative animate-fade-in group/card"
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
          >
            <CollectionCard collection={entry} />
            <RemoveButton
              slug={entry.slug}
              address={entry.contractAddress}
              onRemove={handleRemove}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function RemoveButton({ slug, address, onRemove }: { slug: string; address: string; onRemove: (slug: string, name: string) => void }) {
  const { info } = useContractInfo(address);
  const { isDark } = useTheme();

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(slug, info?.name ?? slug); }}
      title="Удалить из каталога"
      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                  opacity-0 group-hover/card:opacity-100 transition-all z-10 ${
        isDark
          ? 'bg-red-500/80 text-white hover:bg-red-500'
          : 'bg-red-500/90 text-white hover:bg-red-600 shadow-lg'
      }`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}
