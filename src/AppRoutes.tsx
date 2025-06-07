import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useStore } from './context/StoreContext'
import { useAppContext } from './context/AppContext'
import TableStatusPage from './pages/TableStatusPage'
import ReservationPage from './pages/ReservationPage'
import AdminDashboard from './pages/AdminDashboard'
import CastDashboard from './pages/CastDashboard'
import CastListPage from './pages/CastListPage'
import AdminTableSettings from './pages/AdminTableSettings'
import ChatPage from './pages/ChatPage'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import NotAuthorized from './pages/NotAuthorized'

const HomeRedirect: React.FC = () => {
  const {
    state: { session, supabaseUser },
  } = useAppContext()

  if (session && supabaseUser) {
    const role = (supabaseUser.user_metadata as any).role
    const storeId = (supabaseUser.user_metadata as any).store_id

    if (['admin', 'owner', 'operator'].includes(role)) {
      return <Navigate to={`/stores/${storeId}`} replace />
    }
    if (role === 'cast') {
      return <Navigate to={`/cast/${storeId}`} replace />
    }
  }

  return <Navigate to="/register" replace />
}

const AppRoutes: React.FC = () => {
  const location = useLocation()
  const { stores, currentStore } = useStore()
  const {
    state: { currentUser: user },
  } = useAppContext()

  useEffect(() => {
    console.log('現在のパス:', location.pathname)
    console.log('店舗一覧(stores):', stores)
    console.log('現在の店舗(currentStore):', currentStore)
    console.log('ログイン中のユーザー情報(user):', user)
  }, [location, stores, currentStore, user])

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/register" element={<Register />} />

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
          <ProtectedRoute allowedRoles={['admin', 'owner']}>
            <CastListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['admin', 'owner']}>
            <AdminTableSettings />
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

      {/* ✅ アクセス拒否ページ */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
  )
}

export default AppRoutes
