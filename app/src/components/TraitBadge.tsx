import { memo } from 'react';
import type { Trait } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface TraitBadgeProps {
  trait: Trait;
}

export const TraitBadge = memo(function TraitBadge({ trait }: TraitBadgeProps) {
  const { isDark } = useTheme();

  return (
    <div className={`p-3 rounded-xl border transition-colors ${
      isDark ? 'bg-nft-card/80 border-nft-border/30' : 'bg-gray-50 border-gray-200'
    }`}>
      <span className={`text-[10px] uppercase tracking-wider font-medium block mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        {trait.traitType}
      </span>
      <p className="font-semibold text-sm">{trait.value}</p>
    </div>
  );
});
