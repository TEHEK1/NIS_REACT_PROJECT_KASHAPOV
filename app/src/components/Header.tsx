import { memo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { WalletButton } from './WalletButton';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { to: '/', label: 'Галерея' },
  { to: '/collections', label: 'Коллекции' },
  { to: '/favorites', label: 'Избранное' },
  { to: '/wallet', label: 'Кошелёк' },
];

export const Header = memo(function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
      isDark ? 'bg-nft-dark/80 border-nft-border/30' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-nft-violet to-nft-pink flex items-center justify-center
                            group-hover:shadow-lg group-hover:shadow-nft-violet/30 transition-shadow">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 20V4l6 4 6-4v16l-6-4-6 4z" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">NFT Gallery</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-nft-violet/20 text-nft-violet'
                      : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden sm:block">
              <WalletButton />
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5"
              aria-label="Меню"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {mobileOpen
                  ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <nav className="flex flex-col gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-nft-violet/20 text-nft-violet'
                        : isDark
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-3 sm:hidden">
              <WalletButton />
            </div>
          </div>
        )}
      </div>
    </header>
  );
});
