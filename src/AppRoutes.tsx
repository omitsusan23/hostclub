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
import ChatPage from './pages/ChatPage';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const HomeRedirect: React.FC = () => {
  const {
    state: { session },
  } = useAppContext();

  if (!session || !session.user) return <Navigate to="/login" replace />;
  return <Navigate to="/tables" replace />;
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

  const hideFooterRoutes = ['/register', '/login'];
  const isFooterHidden = hideFooterRoutes.includes(location.pathname);

  const wrapWithLayout = (element: React.ReactNode) =>
    isFooterHidden ? <>{element}</> : <Layout>{element}</Layout>;

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/stores/:subdomain"
        element={
          <ProtectedRoute allowedRoles={['admin', 'owner', 'operator']}>
            {wrapWithLayout(<AdminDashboard />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/cast/:subdomain"
        element={
          <ProtectedRoute allowedRoles={['cast']}>
            {wrapWithLayout(<CastDashboard />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoute>
            {wrapWithLayout(<TableStatusPage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            {wrapWithLayout(<ReservationPage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/casts"
        element={
          <ProtectedRoute>
            {wrapWithLayout(<CastListPage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            {wrapWithLayout(<AdminTableSettings />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            {wrapWithLayout(<ChatPage />)}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;