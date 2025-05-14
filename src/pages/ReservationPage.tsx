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

  // 現在使用中の卓番号一覧
  const assignedNumbers = tables.map((t) => t.tableNumber)

  // 入力フィールド state
  const [princess, setPrincess] = useState('')
  const [requestedTable, setRequestedTable] = useState('')
  const [budgetMode, setBudgetMode] = useState<'undecided' | 'input'>(
    'undecided'
  )
  const [budget, setBudget] = useState<number | ''>('')
  const [errors, setErrors] = useState<{
    princess?: string
    requestedTable?: string
    budget?: string
  }>({})

  // 卓反映トースト表示
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  // モーダルの Ref ＆初回フォーカス
  const firstInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) firstInputRef.current?.focus()
  }, [isOpen])

  // ESC キーで閉じる
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') onClose()
  }

  // 卓反映モーダル制御
  const [isReflectOpen, setReflectOpen] = useState(false)
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [reflectTable, setReflectTable] = useState('')
  const [startTime, setStartTime] = useState('')

  const canAssign =
    currentUser?.role === 'admin' || currentUser?.canManageTables

  // 予約追加バリデーション
  const validate = () => {
    const newErrors: typeof errors = {}
    if (!princess.trim()) newErrors.princess = '姫名を入力してください'
    if (!requestedTable.trim())
      newErrors.requestedTable = '希望卓番号を入力してください'
    if (budgetMode === 'input' && (budget === '' || isNaN(budget as number)))
      newErrors.budget = '予算を入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 予約追加（モーダルの「保存」）
  const handleAdd = () => {
    if (!validate()) return
    dispatch({
      type: 'ADD_RESERVATION',
      payload: {
        id: Date.now(),
        princess: princess.trim(),
        requestedTable: requestedTable.trim(),
        budget: budgetMode === 'input' ? Number(budget) : 0,
      },
    })
    setPrincess('')
    setRequestedTable('')
    setBudgetMode('undecided')
    setBudget('')
    setErrors({})
    onClose()
  }

  // 予約削除（確認ダイアログ付き）
  const handleDelete = (id: number, name: string) => {
    if (!window.confirm(`本当に ${name} さんの予約を削除しますか？`)) return
    dispatch({ type: 'DELETE_RESERVATION', payload: id })
  }

  // 卓反映モーダル開閉
  const openReflectModal = (res: Reservation) => {
    setSelectedRes(res)
    // 希望卓を初期値に
    setReflectTable(res.requestedTable)
    // 開始時間を今の時刻で初期値に
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

  // 卓反映確定
  const handleReflectConfirm = () => {
    if (
      !selectedRes ||
      !reflectTable ||
      !startTime ||
      assignedNumbers.includes(reflectTable)
    )
      return
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        ...selectedRes,
        requestedTable: reflectTable,
        time: startTime,
      },
    })
    closeReflectModal()
    // トースト表示
    setToastMessage(
      `${selectedRes.princess}様は${reflectTable}に着席しました`
    )
    setShowToast(true)
    setTimeout(() => setShowToast(false), 1000)
  }

  // 予算モード切り替え
  const handleBudgetModeChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setBudgetMode(e.target.value as 'undecided' | 'input')
    setBudget('')
    setErrors((prev) => ({ ...prev, budget: undefined }))
  }

  // 予算 input の onChange 型（数字以外はエラーを出す）
  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (/^\d*$/.test(val)) {
      setBudget(val === '' ? '' : Number(val))
      setErrors((prev) => ({ ...prev, budget: undefined }))
    } else {
      setErrors((prev) => ({
        ...prev,
        budget: '許可されていない文字です',
      }))
    }
  }

  return (
    <>
      {/* トースト */}
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black text-white px-4 py-2 rounded">
            {toastMessage}
          </div>
        </div>
      )}

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

              <label className="block text-sm mb-1">
                希望卓番号
              </label>
              <select
                value={requestedTable}
                onChange={(e) => setRequestedTable(e.target.value)}
                className="border p-2 w-full rounded mb-2"
              >
                <option value="">希望なし</option>
                {tableSettings.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.requestedTable && (
                <p
                  id="error-table"
                  className="text-red-500 text-sm mb-2"
                >
                  {errors.requestedTable}
                </p>
              )}

              <label className="block text-sm mb-1">予算</label>
              <select
                value={budgetMode}
                onChange={handleBudgetModeChange}
                className="border p-2 w-full rounded mb-2"
              >
                <option value="undecided">未定</option>
                <option value="input">入力</option>
              </select>
              {budgetMode === 'input' && (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  value={budget}
                  onChange={handleBudgetChange}
                  className="border p-2 w-full rounded mb-4"
                  aria-invalid={!!errors.budget}
                  aria-describedby={
                    errors.budget ? 'error-budget' : undefined
                  }
                />
              )}
              {errors.budget && (
                <p
                  id="error-budget"
                  className="text-red-500 text-sm mb-4"
                >
                  {errors.budget}
                </p>
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
                  disabled={
                    !reflectTable ||
                    !startTime ||
                    assignedNumbers.includes(reflectTable)
                  }
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  反映
                </button>
              </div>
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
                <strong>希望卓:</strong> {res.requestedTable || 'なし'}
              </p>
              <p>
                <strong>予算:</strong>{' '}
                {res.budget
                  ? `${res.budget.toLocaleString()}円`
                  : '未定'}
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
                  onClick={() => handleDelete(res.id, res.princess)}
                  className="text-red-500 underline"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
