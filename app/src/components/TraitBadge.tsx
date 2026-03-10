import { memo } from 'react';
import type { Trait } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface TraitBadgeProps {
  trait: Trait;
}

function getRarityColor(rarity: number): string {
  if (rarity <= 1) return 'from-amber-400 to-orange-500';
  if (rarity <= 5) return 'from-purple-400 to-pink-500';
  if (rarity <= 10) return 'from-blue-400 to-cyan-500';
  if (rarity <= 20) return 'from-green-400 to-emerald-500';
  return 'from-gray-400 to-gray-500';
}

function getRarityLabel(rarity: number): string {
  if (rarity <= 1) return 'Легендарный';
  if (rarity <= 5) return 'Эпический';
  if (rarity <= 10) return 'Редкий';
  if (rarity <= 20) return 'Необычный';
  return 'Обычный';
}

export const TraitBadge = memo(function TraitBadge({ trait }: TraitBadgeProps) {
  const { isDark } = useTheme();

  return (
    <div className={`p-3 rounded-xl border transition-colors ${
      isDark ? 'bg-nft-card/80 border-nft-border/30' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[10px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {trait.traitType}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r ${getRarityColor(trait.rarity)} text-white font-medium`}>
          {getRarityLabel(trait.rarity)}
        </span>
      </div>
      <p className="font-semibold text-sm">{trait.value}</p>
      <div className="mt-2">
        <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-nft-border/50' : 'bg-gray-200'}`}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getRarityColor(trait.rarity)} transition-all duration-500`}
            style={{ width: `${Math.min(trait.rarity * 3, 100)}%` }}
          />
        </div>
        <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{trait.rarity}% имеют</p>
      </div>
    </div>
  );
});
