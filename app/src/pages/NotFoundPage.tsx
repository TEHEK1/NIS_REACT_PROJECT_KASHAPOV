import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

export default function NotFoundPage() {
  const { isDark } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-8xl font-black gradient-text mb-4">404</div>
      <h1 className="text-2xl font-bold mb-3">Страница не найдена</h1>
      <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Похоже, этот NFT улетел в другую метавселенную
      </p>
      <Link to="/" className="btn-primary inline-flex">
        Вернуться в галерею
      </Link>
    </div>
  );
}
