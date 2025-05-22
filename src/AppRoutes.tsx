// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import CastDashboard from './pages/CastDashboard';
import TableStatusPage from './pages/TableStatusPage';
import ReservationPage from './pages/ReservationPage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<AdminDashboard />} />
    <Route path="/cast" element={<CastDashboard />} />
    <Route path="/tables" element={<TableStatusPage />} />
    <Route path="/reservations" element={<ReservationPage />} />
    {/* 必要に応じて他ルートも追加 */}
  </Routes>
);

export default AppRoutes;
