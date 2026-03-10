import { memo, useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = memo(function SearchBar({ value, onChange, placeholder = 'Поиск NFT...' }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const { isDark } = useTheme();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(newValue), 300);
  };

  return (
    <div className="relative">
      <svg
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all duration-200 ${
          isDark
            ? 'bg-nft-card border border-nft-border/50 text-gray-100 placeholder-gray-500 focus:border-nft-violet/50 focus:ring-2 focus:ring-nft-violet/20'
            : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 shadow-sm'
        }`}
      />
      {localValue && (
        <button
          onClick={() => handleChange('')}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center
                      text-xs ${isDark ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
        >
          &times;
        </button>
      )}
    </div>
  );
});
