// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import StoreDashboard from './pages/StoreDashboard';
import TableStatusPage from './pages/TableStatusPage';
import ReservationPage from './pages/ReservationPage';

const AppRoutes: React.FC = () => {
  const { stores } = useStore();
  const defaultId = stores.length > 0 ? stores[0].id : '';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/stores/${defaultId}`} replace />} />
      <Route path="/stores/:storeId" element={<StoreDashboard />} />
      {/* 他の店舗固有ページは必要に応じて追加 */}
      <Route path="/tables" element={<TableStatusPage />} />
      <Route path="/reservations" element={<ReservationPage />} />
    </Routes>
  );
};
