import { memo, useState } from 'react';
import type { SortOption } from '@/types';
import { collections } from '@/data/collections';
import { useTheme } from '@/context/ThemeContext';

interface FilterPanelProps {
  collectionId: string | null;
  sort: SortOption;
  onlyAuctions: boolean;
  priceMin: number | null;
  priceMax: number | null;
  activeCount: number;
  onCollectionChange: (id: string | null) => void;
  onSortChange: (sort: SortOption) => void;
  onAuctionsChange: (only: boolean) => void;
  onPriceChange: (min: number | null, max: number | null) => void;
  onReset: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'most-liked', label: 'Популярные' },
];

export const FilterPanel = memo(function FilterPanel({
  collectionId, sort, onlyAuctions, priceMin, priceMax, activeCount,
  onCollectionChange, onSortChange, onAuctionsChange, onPriceChange, onReset,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();

  const selectClass = `w-full px-3 py-2.5 rounded-xl outline-none text-sm transition-all ${
    isDark
      ? 'bg-nft-card border border-nft-border/50 text-gray-200 focus:border-nft-violet/50'
      : 'bg-white border border-gray-200 text-gray-900 focus:border-violet-400 shadow-sm'
  }`;

  const inputClass = selectClass;

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
            <select value={collectionId ?? ''} onChange={e => onCollectionChange(e.target.value || null)} className={selectClass}>
              <option value="">Все коллекции</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
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

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Цена (ETH)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Мин"
                value={priceMin ?? ''}
                onChange={e => onPriceChange(e.target.value ? Number(e.target.value) : null, priceMax)}
                className={inputClass}
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder="Макс"
                value={priceMax ?? ''}
                onChange={e => onPriceChange(priceMin, e.target.value ? Number(e.target.value) : null)}
                className={inputClass}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={onlyAuctions}
                onChange={e => onAuctionsChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-10 h-5 rounded-full transition-colors peer-checked:bg-nft-violet ${isDark ? 'bg-nft-border' : 'bg-gray-300'}`} />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
            </div>
            <span className="text-sm">Только аукционы</span>
          </label>

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
