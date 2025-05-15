// src/App.tsx
import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import { AppProvider, useAppContext, type User } from './context/AppContext'

const Login = lazy(() => import('./pages/Login'))
const ReservationPage = lazy(() => import('./pages/ReservationPage'))
const TableStatusPage = lazy(() => import('./pages/TableStatusPage'))
const CastListPage = lazy(() => import('./pages/CastListPage'))
const AdminTableSettings = lazy(() => import('./pages/AdminTableSettings'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const CastDashboard = lazy(() => import('./pages/CastDashboard'))
const MyPage = lazy(() => import('./pages/MyPage'))

function AppInner() {
  
  const { dispatch } = useAppContext()
  const loc = useLocation()
  // any を User | null 型に変更
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  })

  // 予約モーダル制御
  const [isResModalOpen, setResModalOpen] = useState(false)
  const openResModal = useCallback(() => setResModalOpen(true), [])
  const closeResModal = useCallback(() => setResModalOpen(false), [])

  // currentUser を Context と localStorage に同期
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser))
      dispatch({ type: 'SET_USER', payload: currentUser })
    } else {
      localStorage.removeItem('user')
      dispatch({ type: 'SET_USER', payload: null })
    }
  }, [currentUser, dispatch])

  return (
    <Router>
      <ErrorBoundary>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only p-2 bg-blue-500 text-white"
        >
          Skip to main content
        </a>
        <Suspense fallback={<div className="p-4 text-center">Loading…</div>}>
          <div className="min-h-screen flex flex-col pb-16">
            <Routes>
              <Route
                path="/"
                element={
                  currentUser ? (
                    <Navigate to="/table-status" replace />
                  ) : (
                    <Login setCurrentUser={setCurrentUser} />
                  )
                }
              />
              <Route
                path="/reservations"
                element={
                  <PrivateRoute currentUser={currentUser} allowedRoles={['admin','cast']}>
                    <ReservationPage
                      isOpen={isResModalOpen}
                      onClose={closeResModal}
                      currentUser={currentUser}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/table-status"
                element={
                  <PrivateRoute currentUser={currentUser} allowedRoles={['admin','cast']}>
                    <TableStatusPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cast-list"
                element={
                  <PrivateRoute currentUser={currentUser} allowedRoles={['admin']}>
                    <CastListPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin-settings"
                element={
                  <PrivateRoute currentUser={currentUser} allowedRoles={['admin']}>
                    <AdminTableSettings setCurrentUser={setCurrentUser} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute currentUser={currentUser} allowedRoles={['admin']}>
                    <AdminDashboard
                      user={currentUser}
                      setCurrentUser={setCurrentUser}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cast"
                element={
                  <PrivateRoute currentUser={currentUser} allowedRoles={['cast']}>
                    <CastDashboard
                      user={currentUser}
                      setCurrentUser={setCurrentUser}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-page"
                element={
                  <PrivateRoute currentUser={currentUser} allowedRoles={['cast']}>
                    <MyPage setCurrentUser={setCurrentUser} />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {currentUser && loc.pathname !== '/table-status' && (
              <Footer
                currentUser={currentUser}
                onOpenAddReservation={openResModal}
              />
            )}
          </div>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
