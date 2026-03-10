import { memo } from 'react';
import { useTheme } from '@/context/ThemeContext';

export const Footer = memo(function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`border-t mt-auto py-8 transition-colors duration-300 ${
      isDark ? 'border-nft-border/30 bg-nft-dark' : 'border-gray-200 bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-nft-violet to-nft-pink flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 20V4l6 4 6-4v16l-6-4-6 4z" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-semibold gradient-text">NFT Gallery</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; 2026 NFT Gallery. Учебный проект — React, Vite, Tailwind CSS, Web3.js
          </p>
        </div>
      </div>
    </footer>
  );
});
