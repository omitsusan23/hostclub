// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import TableStatusPage from './pages/TableStatusPage';
import ReservationPage from './pages/ReservationPage';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import CastDashboard from './pages/CastDashboard';

const AppRoutes: React.FC = () => {
  const { stores } = useStore();
  const defaultId = stores.length > 0 ? stores[0].id : '';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/stores/${defaultId}`} replace />} />
      <Route path="/stores/:subdomain" element={<Layout><AdminDashboard /></Layout>} />
      <Route path="/cast/:subdomain" element={<Layout><CastDashboard /></Layout>} />
      <Route path="/tables" element={<Layout><TableStatusPage /></Layout>} />
      <Route path="/reservations" element={<Layout><ReservationPage /></Layout>} />
    </Routes>
  );
};

export default AppRoutes;