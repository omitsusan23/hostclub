// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AppProvider, useAppContext } from './context/AppContext';
import AppRoutes from './AppRoutes';
import { supabase } from './lib/supabase'; // ✅ ← 忘れず復元

const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const user = state.session?.user;

  // ✅ AppContext 経由のセッション状態ログ
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata as { store_id?: string; role?: string };
      console.log('✅ AppContext上の store_id:', metadata.store_id);
      console.log('✅ AppContext上の role:', metadata.role);
    } else {
      console.log('⚠️ AppContext: ユーザー未ログイン（session is null or user is null）');
    }
  }, [user]);

  // ✅ Supabase auth から直接セッション取得 → ログ出力
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ supabase.auth.getSession() エラー:', error.message);
      } else if (!data.session) {
        console.log('⚠️ Supabaseセッションなし（data.session is null）');
      } else {
        console.log('📦 Supabaseセッション:', data.session);
        console.log('🔍 Supabase user_metadata:', data.session.user.user_metadata);
        console.log('🔐 store_id:', data.session.user.user_metadata?.store_id);
        console.log('👤 role:', data.session.user.user_metadata?.role);
      }
    };

    checkSession();
  }, []);

  return (
    <Router>
      <StoreProvider>
        <AppRoutes />
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
