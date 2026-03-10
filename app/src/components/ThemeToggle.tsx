import { memo } from 'react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle = memo(function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-nft-violet/50"
      style={{ backgroundColor: isDark ? '#2a2a5e' : '#e2e8f0' }}
      aria-label="Переключить тему"
    >
      <span
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center text-sm"
        style={{ transform: isDark ? 'translateX(0)' : 'translateX(28px)' }}
      >
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
});
