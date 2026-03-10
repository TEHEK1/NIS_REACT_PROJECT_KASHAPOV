import { memo } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient?: string;
}

export const StatsCard = memo(function StatsCard({ icon, label, value, gradient = 'from-nft-violet to-nft-pink' }: StatsCardProps) {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 rounded-2xl border transition-colors ${
      isDark ? 'bg-nft-card/60 border-nft-border/30' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
});
