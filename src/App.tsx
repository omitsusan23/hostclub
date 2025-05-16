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

// ページコンポーネントの遅延読み込み
const Login = lazy(() => import('./pages/Login'))
const ReservationPage = lazy(() => import('./pages/ReservationPage'))
const TableStatusPage = lazy(() => import('./pages/TableStatusPage'))
const CastListPage = lazy(() => import('./pages/CastListPage'))
const AdminTableSettings = lazy(() => import('./pages/AdminTableSettings'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const CastDashboard = lazy(() => import('./pages/CastDashboard'))
const MyPage = lazy(() => import('./pages/MyPage'))

// モーダル内で使用する位置ラベル
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
  const [firstModalOpen, setFirstModalOpen]   = useState(false)
  const [step1,         setStep1]             = useState(true)
  const [selectedTable, setSelectedTable]     = useState('')
  const [selectedCount, setSelectedCount]     = useState(0)
  const [names,         setNames]             = useState<string[]>([])
  const [firstTypes,    setFirstTypes]        = useState<string[]>([])
  const [firstPhotos,   setFirstPhotos]       = useState<string[]>([])
  const [photos,        setPhotos]            = useState<string[]>([])
  const [firstStartTime, setFirstStartTime]   = useState('')

  const openFirstModal = () => {
    const now = new Date()
    setFirstStartTime(now.toTimeString().slice(0,5))
    setStep1(true)
    setSelectedTable('')
    setSelectedCount(0)
    setNames([])
    setFirstTypes([])
    setFirstPhotos([])
    setPhotos([])
    setFirstModalOpen(true)
  }
  const closeFirstModal = () => setFirstModalOpen(false)

  const nextStep = () => {
    if (!selectedTable || selectedCount < 1) return
    setNames(Array(selectedCount).fill(''))
    setFirstTypes(Array(selectedCount).fill('初回'))
    setFirstPhotos(Array(selectedCount).fill(''))
    setPhotos(Array(selectedCount).fill('なし'))
    setStep1(false)
  }

  const confirmFirst = () => {
    // 1) テーブル割り当て
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

    // 2) firstLabels を更新
    const saved = JSON.parse(localStorage.getItem('firstLabels') || '{}')
    saved[selectedTable] = Array.from(new Set(firstTypes)).join('/')
    localStorage.setItem('firstLabels', JSON.stringify(saved))

    // 追加: 即時更新用イベント発火
    window.dispatchEvent(new Event('firstLabelsUpdated'))

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

  const disableConfirm = firstTypes.some((t, i) => t === '初回指名' && firstPhotos[i] === '')

  return (
    <Router>
      <ErrorBoundary>
        <a href="#main-content" className="sr-only focus:not-sr-only p-2 bg-blue-500 text-white">
          Skip to main content
        </a>
        <Suspense fallback={<div className="p-4 text-center">Loading…</div>}>
          <div className="min-h-screen flex flex-col pb-16">
            {/* ↓ Routes は変更なし ↓ */}
            <Routes>
              <Route
                path="/"
                element={
                  currentUser
                    ? <Navigate to="/table-status" replace />
                    : <Login setCurrentUser={setCurrentUser} />
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
              {/* 他の Route は省略 */}
            </Routes>
            {/* ↑ Routes は変更なし ↑ */}

            {currentUser && (
              <Footer
                currentUser={currentUser}
                onOpenAddReservation={openResModal}
                onOpenFirst={openFirstModal}
              />
            )}

            {/* 初回来店モーダル */}
            {firstModalOpen && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  {step1 ? (
                    <>
                      <h3 className="text-lg font-semibold mb-4 text-center">
                        初回来店：卓と人数を選択
                      </h3>
                      <label className="block text-sm mb-2">卓選択</label>
                      <select
                        value={selectedTable}
                        onChange={e => setSelectedTable(e.target.value)}
                        className="border p-2 w-full rounded mb-4"
                      >
                        <option value="">選択してください</option>
                        {tableSettings.map(t =>
                          tables.some(tab => tab.tableNumber === t)
                            ? <option key={t} value={t} disabled>{t}（使用中）</option>
                            : <option key={t} value={t}>{t}</option>
                        )}
                      </select>

                      <label className="block text-sm mb-2">開始時間</label>
                      <input
                        type="time"
                        value={firstStartTime}
                        onChange={e => setFirstStartTime(e.target.value)}
                        className="border p-2 w-full rounded mb-4"
                      />

                      <label className="block text-sm mb-2">人数を選択</label>
                      <select
                        value={selectedCount}
                        onChange={e => setSelectedCount(Number(e.target.value))}
                        className="border p-2 w-full rounded mb-4"
                      >
                        <option value={0}>人数を選択してください</option>
                        {[1,2,3,4,5,6].map(n => (
                          <option key={n} value={n}>{n} 名</option>
                        ))}
                      </select>

                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={closeFirstModal}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={nextStep}
                          disabled={!selectedTable || selectedCount < 1}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                          次へ
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold mb-4 text-center">
                        初回来店：お客様情報
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {names.map((_, i) => (
                          <div key={i}>
                            {positionLabelsByCount[selectedCount][i] && (
                              <label className="block text-xs text-gray-500 mb-1">
                                {positionLabelsByCount[selectedCount][i]}
                              </label>
                            )}
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
                              value={firstTypes[i] === '初回指名' ? firstPhotos[i] : photos[i]}
                              onChange={e => {
                                const arr = firstTypes[i] === '初回指名' ? [...firstPhotos] : [...photos]
                                arr[i] = e.target.value
                                firstTypes[i] === '初回指名' ? setFirstPhotos(arr) : setPhotos(arr)
                              }}
                              className="border p-2 rounded w-full mb-1"
                            >
                              {firstTypes[i] === '初回指名'
                                ? <>
                                    <option value="">指名してください</option>
                                    {casts.map(c => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </>
                                : <>
                                    <option value="なし">写真指名なし</option>
                                    {casts.map(c => (
                                      <option key={c} value={c}>{c}</option>
                                    ))}
                                  </>
                              }
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
                          disabled={disableConfirm}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
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
