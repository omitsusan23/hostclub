// src/pages/ReservationPage.tsx
import React, {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { useAppContext, type Reservation, type User } from '../context/AppContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  currentUser: User | null
}

export default function ReservationPage({
  isOpen,
  onClose,
  currentUser,
}: Props) {
  const { state, dispatch } = useAppContext()
  const { reservations, tableSettings = [], tables } = state

  // 使用中テーブル番号リスト
  const assignedNumbers = tables.map((t) => t.tableNumber)

  // 追加モーダル用 state
  const [princess, setPrincess] = useState('')
  const [requestedTable, setRequestedTable] = useState('')
  const [budgetMode, setBudgetMode] = useState<'undecided' | 'input'>(
    'undecided'
  )
  const [budget, setBudget] = useState('')
  const [errors, setErrors] = useState<{
    princess?: string
    budget?: string
  }>({})

  // フォーカス管理
  const firstInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) firstInputRef.current?.focus()
  }, [isOpen])

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') onClose()
  }

  // 反映モーダル用 state
  const [isReflectOpen, setReflectOpen] = useState(false)
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [reflectTable, setReflectTable] = useState('')
  const [startTime, setStartTime] = useState('')

  // トースト用 state
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const canAssign =
    currentUser?.role === 'admin' || currentUser?.canManageTables

  // バリデーション
  const validate = () => {
    const newErrors: typeof errors = {}
    if (!princess.trim()) newErrors.princess = '姫名を入力してください'
    if (budgetMode === 'input' && !/^\d*$/.test(budget)) {
      newErrors.budget =
        budget === ''
          ? '予算を入力してください'
          : '許可されていない文字です'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 予約追加
  const handleAdd = () => {
    if (!validate()) return
    const payload: Reservation = {
      id: Date.now(),
      princess: princess.trim(),
      requestedTable: requestedTable.trim(),
      budget:
        budgetMode === 'input' && /^\d+$/.test(budget)
          ? Number(budget)
          : 0,
    }
    dispatch({ type: 'ADD_RESERVATION', payload })
    setPrincess('')
    setRequestedTable('')
    setBudgetMode('undecided')
    setBudget('')
    setErrors({})
    onClose()
  }

  const handleDelete = (id: number) =>
    dispatch({ type: 'DELETE_RESERVATION', payload: id })

  // 反映モーダルを開くとき、希望卓を初期値にセット
  const openReflectModal = (res: Reservation) => {
    setSelectedRes(res)
    setReflectTable(res.requestedTable || '')
    const now = new Date()
    const hh = now.getHours().toString().padStart(2, '0')
    const mm = now.getMinutes().toString().padStart(2, '0')
    setStartTime(`${hh}:${mm}`)
    setReflectOpen(true)
  }
  const closeReflectModal = () => {
    setReflectOpen(false)
    setSelectedRes(null)
    setReflectTable('')
    setStartTime('')
  }

  const handleReflectConfirm = () => {
    if (!selectedRes || !reflectTable || !startTime) return
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        ...selectedRes,
        requestedTable: reflectTable,
        time: startTime,
      },
    })
    closeReflectModal()
    setToastMessage(
      `${selectedRes.princess}様は${reflectTable}に着席しました`
    )
    setShowToast(true)
    setTimeout(() => setShowToast(false), 1000)
  }

  return (
    <main
      id="main-content"
      className="p-4 pb-16"
      onKeyDown={handleKeyDown}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">
        来店予約表
      </h2>

      {/* 追加モーダル */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="res-modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3
              id="res-modal-title"
              className="text-lg font-semibold mb-4"
            >
              予約詳細を入力
            </h3>

            <label className="block text-sm mb-1">姫名</label>
            <input
              ref={firstInputRef}
              type="text"
              value={princess}
              onChange={(e) => setPrincess(e.target.value)}
              className="border p-2 w-full rounded mb-2"
              aria-invalid={!!errors.princess}
            />
            {errors.princess && (
              <p className="text-red-500 text-sm mb-2">
                {errors.princess}
              </p>
            )}

            <label className="block text-sm mb-1">
              希望卓番号
            </label>
            <select
              value={requestedTable}
              onChange={(e) => setRequestedTable(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="">希望無し</option>
              {tableSettings.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">予算</label>
            <select
              value={budgetMode}
              onChange={(e) =>
                setBudgetMode(
                  e.target.value === 'input' ? 'input' : 'undecided'
                )
              }
              className="border p-2 w-full rounded mb-2"
            >
              <option value="undecided">未定</option>
              <option value="input">入力</option>
            </select>

            {budgetMode === 'input' && (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={budget}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const v = e.target.value
                    if (v === '' || /^\d+$/.test(v)) {
                      setBudget(v)
                      setErrors((p) => ({ ...p, budget: undefined }))
                    } else {
                      setErrors((p) => ({
                        ...p,
                        budget: '許可されていない文字です',
                      }))
                    }
                  }}
                  className="border p-2 w-full rounded mb-2"
                  placeholder="予算を入力"
                  aria-invalid={!!errors.budget}
                />
                {errors.budget && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.budget}
                  </p>
                )}
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 卓反映モーダル */}
      {isReflectOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reflect-modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3
              id="reflect-modal-title"
              className="text-lg font-semibold mb-4"
            >
              卓に反映
            </h3>

            <label className="block text-sm mb-1">
              卓番号を選択
            </label>
            <select
              value={reflectTable}
              onChange={(e) => setReflectTable(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="">選択してください</option>
              {tableSettings.map((t) => (
                <option
                  key={t}
                  value={t}
                  disabled={assignedNumbers.includes(t)}
                >
                  {t}
                  {assignedNumbers.includes(t) ? '（使用中）' : ''}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">
              開始時間
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeReflectModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleReflectConfirm}
                disabled={!reflectTable || !startTime}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                反映
              </button>
            </div>
          </div>
        </div>
      )}

      {/* トースト */}
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded">
            {toastMessage}
          </div>
        </div>
      )}

      {/* 予約リスト */}
      <div className="mt-6 space-y-3">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="border p-4 rounded bg-white"
          >
            <p>
              <strong>姫名:</strong> {res.princess}
            </p>
            <p>
              <strong>希望卓:</strong> {res.requestedTable || '希望無し'}
            </p>
            <p>
              <strong>予算:</strong>{' '}
              {res.budget === 0 ? '未定' : res.budget.toLocaleString() + '円'}
            </p>
            <div className="mt-2 space-x-2">
              {canAssign && (
                <button
                  onClick={() => openReflectModal(res)}
                  className="text-blue-600 underline"
                >
                  卓に反映
                </button>
              )}
              <button
                onClick={() => handleDelete(res.id)}
                className="text-red-500 underline"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
