// src/AppRoutes.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { useAppContext } from './context/AppContext';
import TableStatusPage from './pages/TableStatusPage';
import ReservationPage from './pages/ReservationPage';
import AdminDashboard from './pages/AdminDashboard';
import CastDashboard from './pages/CastDashboard';
import CastListPage from './pages/CastListPage';
import AdminTableSettings from './pages/AdminTableSettings';
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './lib/supabase';
import Layout from './components/Layout'; // ✅ Layout を追加

const HomeRedirect: React.FC = () => {
  const [isStoreRegistered, setIsStoreRegistered] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStoreRegistration = async () => {
      const subdomain = window.location.hostname.split('.')[0];
      const { data, error } = await supabase.auth.admin.listUsers();

      if (error) {
        console.error('ユーザー一覧取得エラー:', error.message);
        setIsStoreRegistered(false);
        return;
      }

      const found = data?.users?.some(
        (user) => user.user_metadata?.store_id === subdomain
      );

      setIsStoreRegistered(found);
    };

    checkStoreRegistration();
  }, []);

  if (isStoreRegistered === null) {
    return <div>判定中...</div>; // ローディング表示（任意）
  }

  return (
    <Navigate
      to={isStoreRegistered ? '/login' : '/register'}
      replace
    />
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { stores, currentStore } = useStore();
  const {
    state: { currentUser: user },
  } = useAppContext();

  useEffect(() => {
    console.log('現在のパス:', location.pathname);
    console.log('店舗一覧(stores):', stores);
    console.log('現在の店舗(currentStore):', currentStore);
    console.log('ログイン中のユーザー情報(user):', user);
  }, [location, stores, currentStore, user]);

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/stores/:subdomain"
        element={
          <ProtectedRoute allowedRoles={['admin', 'owner', 'operator']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cast/:subdomain"
        element={
          <ProtectedRoute allowedRoles={['cast']}>
            <CastDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoute>
            <TableStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <ReservationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/casts"
        element={
          <ProtectedRoute>
            <CastListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminTableSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
