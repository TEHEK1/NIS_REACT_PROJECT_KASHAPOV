import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { WalletProvider } from '@/context/WalletContext';
import { router } from '@/router';

export function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <RouterProvider router={router} />
      </WalletProvider>
    </ThemeProvider>
  );
}
