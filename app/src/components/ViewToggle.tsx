import { memo } from 'react';
import { useTheme } from '@/context/ThemeContext';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewToggle = memo(function ViewToggle({ mode, onChange }: ViewToggleProps) {
  const { isDark } = useTheme();
  const base = `p-2 rounded-lg transition-all ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const active = isDark
    ? 'bg-nft-violet/20 text-nft-violet'
    : 'bg-violet-100 text-violet-600';

  return (
    <div className={`flex gap-1 p-1 rounded-xl ${isDark ? 'bg-nft-card' : 'bg-gray-100'}`}>
      <button onClick={() => onChange('grid')} className={`${base} ${mode === 'grid' ? active : ''}`} aria-label="Сетка">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
      </button>
      <button onClick={() => onChange('list')} className={`${base} ${mode === 'list' ? active : ''}`} aria-label="Список">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      </button>
    </div>
  );
});
