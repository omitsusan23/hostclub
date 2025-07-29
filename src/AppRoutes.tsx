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
import SignupRedirect from './pages/SignupRedirect';
import AuthCallback from './pages/AuthCallback';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import AdminProfilePage from './pages/AdminProfilePage';
import CastProfilePage from './pages/CastProfilePage';
import OperatorProfilePage from './pages/OperatorProfilePage';

import CastRegisterPage from './pages/cast.Register';
import OperatorRegisterPage from './pages/operator.Register';

import PrincessPage from './pages/PrincessPage';
import ScorePage from './pages/ScorePage';
import StorePage from './pages/StorePage';

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

  const hideFooterRoutes = [
    '/register',
    '/login',
    '/signup',
    '/cast/register',
    '/operator/register',
    '/cast/profile',
    '/operator/profile',
    '/admin/profile',
  ];

  const isFooterHidden = hideFooterRoutes.some(path => location.pathname.startsWith(path));

  const wrapWithLayout = (element: React.ReactNode) =>
    isFooterHidden ? <>{element}</> : <Layout>{element}</Layout>;

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupRedirect />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route path="/cast/register" element={<CastRegisterPage />} />
      <Route path="/operator/register" element={<OperatorRegisterPage />} />

      <Route
        path="/cast/profile"
        element={
          <ProtectedRoute allowedRoles={['cast']}>
            {wrapWithLayout(<CastProfilePage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/profile"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            {wrapWithLayout(<OperatorProfilePage />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            {wrapWithLayout(<AdminProfilePage />)}
          </ProtectedRoute>
        }
      />
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
      <Route
        path="/princess-page"
        element={
          <ProtectedRoute allowedRoles={['cast']}>
            {wrapWithLayout(<PrincessPage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/score-page"
        element={
          <ProtectedRoute allowedRoles={['cast']}>
            {wrapWithLayout(<ScorePage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/store-page"
        element={
          <ProtectedRoute allowedRoles={['operator', 'owner', 'admin']}>
            {wrapWithLayout(<StorePage />)}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
