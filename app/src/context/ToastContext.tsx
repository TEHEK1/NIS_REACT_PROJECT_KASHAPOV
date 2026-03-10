import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useTheme } from './ThemeContext';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { isDark } = useTheme();

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const typeStyles: Record<ToastType, string> = {
    success: 'from-green-500 to-emerald-600',
    error: 'from-red-500 to-rose-600',
    info: 'from-nft-violet to-nft-pink',
  };

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ⓘ',
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl
                        animate-slide-up backdrop-blur-xl border max-w-sm ${
              isDark
                ? 'bg-nft-surface/90 border-nft-border/50 text-white'
                : 'bg-white/90 border-gray-200 text-gray-900 shadow-lg'
            }`}
          >
            <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${typeStyles[t.type]}
                              flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {icons[t.type]}
            </span>
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
