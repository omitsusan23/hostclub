// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import AppRoutes from './AppRoutes'; // ルーティング定義

const App: React.FC = () => (
  <StoreProvider>
    <Router>
      <Layout>
        <AppRoutes />
      </Layout>
    </Router>
  </StoreProvider>
);

export default App;