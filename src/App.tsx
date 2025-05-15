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

function AppInner() {
  const { state: { tables, tableSettings, casts }, dispatch, state } = useAppContext()
  // any を User | null 型に変更
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as User) : null
  })

  // 予約モーダル制御
  const [isResModalOpen, setResModalOpen] = useState(false)
  const openResModal = useCallback(() => setResModalOpen(true), [])
  const closeResModal = useCallback(() => setResModalOpen(false), [])

  // ―― 初回来店モーダル制御をリフトアップ ――
  const [firstModalOpen, setFirstModalOpen] = useState(false)
  const [step1,         setStep1]           = useState(true)
  const [selectedTable, setSelectedTable]   = useState('')
  const [selectedCount, setSelectedCount]   = useState(0)
  const [names,         setNames]           = useState<string[]>([])
  const [photos,        setPhotos]          = useState<string[]>([])
  const [firstStartTime, setFirstStartTime] = useState('')

  const openFirstModal = () => {
    const now  = new Date()
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
      },
    })
    // 省略：オーバーレイ表示など既存ロジックそのまま
    closeFirstModal()
  }

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
              {/* 既存の Route 設定はそのまま */}
            </Routes>

            {/* 全ページ共通：グローバル Footer に onOpenFirst を渡す */}
            {currentUser && (
              <Footer
                currentUser={currentUser}
                onOpenAddReservation={openResModal}
                onOpenFirst={openFirstModal}
              />
            )}

            {/* 初回モーダルは AppInner 配下で共通描画 */}
            {firstModalOpen && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                {/* ここに TableStatusPage.tsx からコピーしたモーダルの JSX 全体を貼り付けてください */}
                {/* 例： */}
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  {step1 ? (
                    /* Step1 JSX */
                    <></>
                  ) : (
                    /* Step2 JSX */
                    <></>
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

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
