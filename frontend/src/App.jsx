import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './routes/index.jsx';
import { useThemeStore } from './store/useThemeStore.js';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
});

function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    // Load light/dark mode preference on app mount
    initTheme();
  }, [initTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      
      {/* Toast Notification Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </QueryClientProvider>
  );
}

export default App;
