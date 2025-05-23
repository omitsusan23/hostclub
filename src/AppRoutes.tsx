// src/AppRoutes.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { useAppContext } from './context/AppContext';
import TableStatusPage from './pages/TableStatusPage';
import ReservationPage from './pages/ReservationPage';
import AdminDashboard from './pages/AdminDashboard';
import CastDashboard from './pages/CastDashboard';
import CastListPage from './pages/CastListPage';
import AdminTableSettings from './pages/AdminTableSettings';

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { stores, currentStore } = useStore();
  const { state: { currentUser: user } } = useAppContext();

  useEffect(() => {
    console.log('現在のパス:', location.pathname);
    console.log('店舗一覧(stores):', stores);
    console.log('現在の店舗(currentStore):', currentStore);
    console.log('ログイン中のユーザー情報(user):', user);
  }, [location, stores, currentStore, user]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/tables" replace />} />
      <Route path="/stores/:subdomain" element={<AdminDashboard />} />
      <Route path="/cast/:subdomain" element={<CastDashboard />} />
      <Route path="/tables" element={<TableStatusPage />} />
      <Route path="/reservations" element={<ReservationPage />} />
      <Route path="/casts" element={<CastListPage />} />
      <Route path="/settings" element={<AdminTableSettings />} />
    </Routes>
  );
};

export default AppRoutes;