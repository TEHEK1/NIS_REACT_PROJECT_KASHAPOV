import { memo, useState } from 'react';
import type { SortOption } from '@/types';
import { useContracts } from '@/hooks/useContracts';
import { useContractInfo } from '@/hooks/useContractInfo';
import { useTheme } from '@/context/ThemeContext';

interface FilterPanelProps {
  collectionSlug: string | null;
  sort: SortOption;
  activeCount: number;
  onCollectionChange: (slug: string | null) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Имя: А → Я' },
  { value: 'name-desc', label: 'Имя: Я → А' },
  { value: 'token-asc', label: 'Token ID: по возрастанию' },
  { value: 'token-desc', label: 'Token ID: по убыванию' },
];

export const FilterPanel = memo(function FilterPanel({
  collectionSlug, sort, activeCount,
  onCollectionChange, onSortChange, onReset,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();
  const { contracts } = useContracts();

  const selectClass = `w-full px-3 py-2.5 rounded-xl outline-none text-sm transition-all ${
    isDark
      ? 'bg-nft-card border border-nft-border/50 text-gray-200 focus:border-nft-violet/50'
      : 'bg-white border border-gray-200 text-gray-900 focus:border-violet-400 shadow-sm'
  }`;

  return (
    <div className={`rounded-2xl transition-colors ${
      isDark ? 'bg-nft-surface/50 border border-nft-border/30' : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-nft-violet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          <span className="font-semibold text-sm">Фильтры</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-nft-violet/20 text-nft-violet rounded-full text-xs font-medium">
              {activeCount}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className={`px-5 pb-5 space-y-4 animate-slide-up border-t ${isDark ? 'border-nft-border/30' : 'border-gray-100'}`}>
          <div className="pt-4">
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Коллекция</label>
            <select value={collectionSlug ?? ''} onChange={e => onCollectionChange(e.target.value || null)} className={selectClass}>
              <option value="">Все коллекции</option>
              {contracts.map(c => (
                <ContractOption key={c.slug} slug={c.slug} address={c.contractAddress} />
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Сортировка</label>
            <select value={sort} onChange={e => onSortChange(e.target.value as SortOption)} className={selectClass}>
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {activeCount > 0 && (
            <button onClick={onReset} className="text-sm text-nft-pink hover:text-nft-pink/80 transition-colors font-medium">
              Сбросить фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
});

function ContractOption({ slug, address }: { slug: string; address: string }) {
  const { info } = useContractInfo(address);
  return <option value={slug}>{info?.name ?? slug}</option>;
}
