import { useTheme } from '@/context/ThemeContext';

export function NftCardSkeleton() {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-2xl overflow-hidden animate-pulse ${
      isDark ? 'bg-nft-card/60 border border-nft-border/30' : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <div className={`aspect-square ${isDark ? 'bg-nft-border/20' : 'bg-gray-200'}`} />
      <div className="p-4 space-y-3">
        <div className={`h-4 rounded-lg w-3/4 ${isDark ? 'bg-nft-border/20' : 'bg-gray-200'}`} />
        <div className={`h-3 rounded-lg w-1/2 ${isDark ? 'bg-nft-border/20' : 'bg-gray-200'}`} />
      </div>
    </div>
  );
}
