import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useTheme } from '@/context/ThemeContext';

export function Layout() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-nft-dark text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
