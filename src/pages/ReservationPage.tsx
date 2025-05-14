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

  // ─── すでに反映済み卓番号一覧（反映モーダル用） ─────────────
  const assignedNumbers = tables.map((t) => t.tableNumber)

  // ─── 入力フィールド state ────────────────────────────
  const [princess, setPrincess] = useState('')
  const [requestedTable, setRequestedTable] = useState('')
  const [budget, setBudget] = useState<number | ''>('')
  const [errors, setErrors] = useState<{
    princess?: string
    budget?: string
  }>({})

  // ─── 追加モーダルの Ref ＆ 初回フォーカス ───────────────
  const firstInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) firstInputRef.current?.focus()
  }, [isOpen])

  // ESC キーで閉じる
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') onClose()
  }

  // ─── 卓反映モーダル制御 ─────────────────────────────
  const [isReflectOpen, setReflectOpen] = useState(false)
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [reflectTable, setReflectTable] = useState('')
  const [startTime, setStartTime] = useState('')

  // ─── トースト表示制御 ───────────────────────────────
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  const canAssign =
    currentUser?.role === 'admin' || currentUser?.canManageTables

  // ─── バリデーション ───────────────────────────────────
  const validate = () => {
    const newErrors: typeof errors = {}
    if (!princess.trim()) newErrors.princess = '姫名を入力してください'
    if (budget === '' || isNaN(budget as number))
      newErrors.budget = '予算を入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ─── 追加処理（「保存」ボタン）────────────────────────
  const handleAdd = () => {
    if (!validate()) return
    const payload: Reservation = {
      id: Date.now(),
      princess: princess.trim(),
      requestedTable: requestedTable.trim(), // 空欄でもOK
      budget: Number(budget),
    }
    dispatch({ type: 'ADD_RESERVATION', payload })
    setPrincess('')
    setRequestedTable('')
    setBudget('')
    setErrors({})
    onClose()
  }

  // ─── 削除 ───────────────────────────────────────────
  const handleDelete = (id: number) =>
    dispatch({ type: 'DELETE_RESERVATION', payload: id })

  // ─── 卓反映モーダル開閉 ─────────────────────────────
  const openReflectModal = (res: Reservation) => {
    setSelectedRes(res)
    // 開始時間を現在時刻で初期化
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    setStartTime(`${hh}:${mm}`)
    setReflectOpen(true)
  }
  const closeReflectModal = () => {
    setReflectOpen(false)
    setSelectedRes(null)
    setReflectTable('')
    setStartTime('')
  }

  // ─── モーダル内で確定するまで dispatch しない ─────────────
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

    // ── トーストを出して 1 秒後に自動で消す ─────────
    setToastMessage(
      `${selectedRes.princess}様は${reflectTable}に着席しました`
    )
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 1000)
  }

  // ─── 予算 input の onChange 型 ────────────────────────
  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value === '' ? '' : Number(e.target.value))
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

      {/* ─── 追加モーダル（フッターから開く） ────────── */}
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

            {/* 姫名 */}
            <label className="block text-sm mb-1">姫名</label>
            <input
              ref={firstInputRef}
              type="text"
              value={princess}
              onChange={(e) => setPrincess(e.target.value)}
              className="border p-2 w-full rounded mb-2"
              aria-invalid={!!errors.princess}
              aria-describedby={
                errors.princess ? 'error-princess' : undefined
              }
            />
            {errors.princess && (
              <p
                id="error-princess"
                className="text-red-500 text-sm mb-2"
              >
                {errors.princess}
              </p>
            )}

            {/* 希望卓番号 */}
            <label className="block text-sm mb-1">希望卓番号</label>
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

            {/* 予算 */}
            <label className="block text-sm mb-1">予算（円）</label>
            <input
              type="number"
              value={budget}
              onChange={handleBudgetChange}
              className="border p-2 w-full rounded mb-4"
              aria-invalid={!!errors.budget}
              aria-describedby={
                errors.budget ? 'error-budget' : undefined
              }
            />
            {errors.budget && (
              <p
                id="error-budget"
                className="text-red-500 text-sm mb-4"
              >
                {errors.budget}
              </p>
            )}

            {/* 操作ボタン */}
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

      {/* ─── 卓反映モーダル ────────────────────────── */}
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

      {/* ─── トーストメッセージ ─────────────────────── */}
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded">
            {toastMessage}
          </div>
        </div>
      )}

      {/* ─── 予約リスト ──────────────────────────── */}
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
              <strong>希望卓:</strong> {res.requestedTable || '—'}
            </p>
            <p>
              <strong>予算:</strong> {res.budget.toLocaleString()}
              円
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
