// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import AppRoutes from './AppRoutes';

const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const user = state.session?.user;

  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata as { store_id?: string; role?: string };
      console.log('✅ ログイン中ユーザーの store_id:', metadata.store_id);
      console.log('✅ ログイン中ユーザーの role:', metadata.role);
    } else {
      console.log('⚠️ ユーザー未ログイン（session is null or user is null）');
    }
  }, [user]);

  return (
    <Router>
      <StoreProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </StoreProvider>
    </Router>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
