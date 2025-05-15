// src/App.tsx
import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

function AppInner() {
  const { state: { tables, tableSettings, casts }, dispatch } = useAppContext()
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  })

  // 予約モーダル
  const [isResModalOpen, setResModalOpen] = useState(false)
  const openResModal = useCallback(() => setResModalOpen(true), [])
  const closeResModal = useCallback(() => setResModalOpen(false), [])

  // 初回モーダル
  const [firstModalOpen, setFirstModalOpen] = useState(false)
  const [step1, setStep1] = useState(true)
  const [selectedTable, setSelectedTable] = useState('')
  const [selectedCount, setSelectedCount] = useState(0)
  const [names, setNames] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [firstStartTime, setFirstStartTime] = useState('')

  const openFirstModal = () => {
    const now = new Date()
    const hhmm = now.toTimeString().slice(0,5)
    setFirstStartTime(hhmm)
    setStep1(true)
    setSelectedTable('')
    setSelectedCount(0)
    setNames([])
    setPhotos([])
    setFirstModalOpen(true)
  }
  const closeFirstModal = () => setFirstModalOpen(false)

  const nextStep = () => {
    if (!selectedTable || selectedCount < 1) return
    setNames(Array(selectedCount).fill(''))
    setPhotos(Array(selectedCount).fill('なし'))
    setStep1(false)
  }

  const confirmFirst = () => {
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        id: Date.now(),
        princess: names.join('、'),
        requestedTable: selectedTable,
        budget: 0,
        time: firstStartTime,
      }
    })
    // オーバーレイ等既存ロジック省略
    closeFirstModal()
  }

  // ローカル保存
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
        <a href="#main-content" className="sr-only focus:not-sr-only p-2 bg-blue-500 text-white">
          Skip to main content
        </a>
        <Suspense fallback={<div className="p-4 text-center">Loading…</div>}>
          <div className="min-h-screen flex flex-col pb-16">
            <Routes>
              <Route path="/" element={
                currentUser ? <Navigate to="/table-status" replace /> : <Login setCurrentUser={setCurrentUser} />
              } />
              <Route path="/reservations" element={
                <PrivateRoute currentUser={currentUser} allowedRoles={["admin","cast"]}>
                  <ReservationPage isOpen={isResModalOpen} onClose={closeResModal} currentUser={currentUser} />
                </PrivateRoute>
              } />
              <Route path="/table-status" element={
                <PrivateRoute currentUser={currentUser} allowedRoles={["admin","cast"]}>
                  <TableStatusPage />
                </PrivateRoute>
              } />
              <Route path="/cast-list" element={
                <PrivateRoute currentUser={currentUser} allowedRoles={["admin"]}>
                  <CastListPage />
                </PrivateRoute>
              } />
              <Route path="/admin-settings" element={
                <PrivateRoute currentUser={currentUser} allowedRoles={["admin"]}>
                  <AdminTableSettings setCurrentUser={setCurrentUser} />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute currentUser={currentUser} allowedRoles={["admin"]}>
                  <AdminDashboard user={currentUser} setCurrentUser={setCurrentUser} />
                </PrivateRoute>
              } />
              <Route path="/cast" element={
                <PrivateRoute currentUser={currentUser} allowedRoles={["cast"]}>
                  <CastDashboard user={currentUser} setCurrentUser={setCurrentUser} />
                </PrivateRoute>
              } />
              <Route path="/my-page" element={
                <PrivateRoute currentUser={currentUser} allowedRoles={["cast"]}>
                  <MyPage setCurrentUser={setCurrentUser} />
                </PrivateRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {currentUser && (
              <Footer
                currentUser={currentUser}
                onOpenAddReservation={openResModal}
                onOpenFirst={openFirstModal}
              />
            )}

            {firstModalOpen && (
              <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  {step1 ? (
                    <> {/* Step1 JSX 省略 */} </>
                  ) : (
                    <> {/* Step2 JSX 省略 */} </>
                  )}
                </div>
              </div>
            )}

          </div>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}
