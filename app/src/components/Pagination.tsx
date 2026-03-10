import { memo, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination = memo(function Pagination({ currentPage, totalItems, pageSize, onPageChange }: PaginationProps) {
  const { isDark } = useTheme();
  const totalPages = Math.ceil(totalItems / pageSize);

  const pages = useMemo(() => {
    const result: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) result.push(i);
    } else {
      result.push(1);
      if (currentPage > 3) result.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        result.push(i);
      }
      if (currentPage < totalPages - 2) result.push('...');
      result.push(totalPages);
    }
    return result;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const btn = `w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all`;
  const inactive = isDark
    ? 'text-gray-400 hover:bg-nft-card hover:text-white'
    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900';
  const active = 'bg-nft-violet text-white shadow-lg shadow-nft-violet/30';

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btn} ${inactive} disabled:opacity-30 disabled:pointer-events-none`}
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className={`w-9 text-center text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>…</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p)} className={`${btn} ${p === currentPage ? active : inactive}`}>
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btn} ${inactive} disabled:opacity-30 disabled:pointer-events-none`}
      >
        ›
      </button>
    </div>
  );
});
