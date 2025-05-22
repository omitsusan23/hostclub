// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AppProvider } from './context/AppContext'; // 追加
import Layout from './components/Layout';
import AppRoutes from './AppRoutes';

const App: React.FC = () => (
  <StoreProvider>
    <AppProvider> {/* AppContext でラップ */}
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AppProvider>
  </StoreProvider>
);

export default App;
