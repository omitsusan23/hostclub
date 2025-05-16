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

const positionLabelsByCount: Record<number, string[]> = {
  1: [],
  2: ['左', '右'],
  3: ['左', '中', '右'],
  4: ['左端', '左', '右', '右端'],
  5: ['左端', '左', '中', '右', '右端'],
  6: ['左端', '左中', '左', '右', '右中', '右端'],
}

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

  // 初回来店モーダル
  const [firstModalOpen, setFirstModalOpen] = useState(false)
  const [step1,         setStep1]           = useState(true)
  const [selectedTable, setSelectedTable]   = useState('')
  const [selectedCount, setSelectedCount]   = useState(0)
  const [names,         setNames]           = useState<string[]>([])
  const [photos,        setPhotos]          = useState<string[]>([])
  const [firstStartTime, setFirstStartTime] = useState('')
  const [firstTypes,    setFirstTypes]      = useState<string[]>([]) // 追加

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
    setFirstTypes(Array(selectedCount).fill('初回')) // 追加
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
    closeFirstModal()
  }

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
            {/* 既存 Routes 定義は変更なし */}
            <Routes>{/* ... */}</Routes>
            {currentUser && (
              <Footer
                currentUser={currentUser}
                onOpenAddReservation={openResModal}
                onOpenFirst={openFirstModal}
              />
            )}
            {/* 初回来店モーダル */}
            {firstModalOpen && (
              <div role="dialog" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  {step1 ? (
                    // ステップ1は変更なし
                    <>{/* ... */}</>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold mb-4 text-center">
                        初回来店：お客様情報
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {names.map((_, i) => (
                          <div key={i}>
                            {/* 変更：位置ラベルを上に */}
                            {positionLabelsByCount[selectedCount][i] && (
                              <div className="text-center text-sm font-medium mb-2">
                                {positionLabelsByCount[selectedCount][i]}
                              </div>
                            )}
                            {/* 変更：セグメントトグルに */}
                            <div className="inline-flex mb-2 border border-gray-300 rounded">
                              <button
                                onClick={() => {
                                  const c = [...firstTypes]
                                  c[i] = '初回'
                                  setFirstTypes(c)
                                }}
                                className={`px-3 py-1 rounded-l ${
                                  firstTypes[i] === '初回'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700'
                                }`}
                              >
                                初回
                              </button>
                              <button
                                onClick={() => {
                                  const c = [...firstTypes]
                                  c[i] = '初回指名'
                                  setFirstTypes(c)
                                }}
                                className={`px-3 py-1 rounded-r ${
                                  firstTypes[i] === '初回指名'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white text-gray-700'
                                }`}
                              >
                                初回指名
                              </button>
                            </div>
                            {/* 以下、既存の名前入力・写真選択 */}
                            <input
                              type="text"
                              placeholder="名前"
                              value={names[i]}
                              onChange={e => {
                                const a = [...names]
                                a[i] = e.target.value.slice(0,6)
                                setNames(a)
                              }}
                              className="border p-2 rounded w-full mb-1"
                            />
                            <select
                              value={photos[i]}
                              onChange={e => {
                                const b = [...photos]
                                b[i] = e.target.value
                                setPhotos(b)
                              }}
                              className="border p-2 rounded w-full"
                            >
                              <option value="なし">写真指名なし</option>
                              {casts.map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setStep1(true)}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          戻る
                        </button>
                        <button
                          onClick={confirmFirst}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          反映
                        </button>
                      </div>
                    </>
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
