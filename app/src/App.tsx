import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { WalletProvider } from '@/context/WalletContext';
import { ToastProvider } from '@/context/ToastContext';
import { router } from '@/router';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <WalletProvider>
          <RouterProvider router={router} />
        </WalletProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
