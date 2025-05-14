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

export default function ReservationPage({ isOpen, onClose, currentUser }: Props) {
  const { state, dispatch } = useAppContext()
  const { reservations, tableSettings = [] } = state

  // 入力フィールド state
  const [princess, setPrincess] = useState('')
  const [requestedTable, setRequestedTable] = useState('')
  const [budget, setBudget] = useState<number | ''>('')
  const [errors, setErrors] = useState<{
    princess?: string
    requestedTable?: string
    budget?: string
  }>({})

  // モーダルの Ref ＆ 初回フォーカス
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

  const canAssign = currentUser?.role === 'admin' || currentUser?.canManageTables

  // バリデーション
  const validate = () => {
    const newErrors: typeof errors = {}
    if (!princess.trim()) newErrors.princess = '姫名を入力してください'
    if (!requestedTable.trim()) newErrors.requestedTable = '希望卓番号を入力してください'
    if (budget === '' || isNaN(budget as number)) newErrors.budget = '予算を入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 追加処理（モーダルの「保存」）
  const handleAdd = () => {
    if (!validate()) return
    const payload: Reservation = {
      id: Date.now(),
      princess: princess.trim(),
      requestedTable: requestedTable.trim(),
      budget: Number(budget),
    }
    dispatch({ type: 'ADD_RESERVATION', payload })
    setPrincess(''), setRequestedTable(''), setBudget(''), setErrors({})
    onClose()
  }

  // 削除
  const handleDelete = (id: number) =>
    dispatch({ type: 'DELETE_RESERVATION', payload: id })

  // 卓反映モーダルを開くときに startTime を「今の時刻」で初期化
  const openReflectModal = (res: Reservation) => {
    setSelectedRes(res)
    // 現在時刻を "HH:MM" 形式で取得してセット
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

  // 確定まで dispatch しない
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
  }

  // 予算 input の onChange 型
  const handleBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.value === '' ? '' : Number(e.target.value))
  }

  return (
    <main id="main-content" className="p-4 pb-16" onKeyDown={handleKeyDown}>
      <h2 className="text-2xl font-bold mb-4 text-center">来店予約表</h2>

      {/* 追加モーダル */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="res-modal-title">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 id="res-modal-title" className="text-lg font-semibold mb-4">予約詳細を入力</h3>
            {/* 入力フォーム省略（前と同じ） */}
          </div>
        </div>
      )}

      {/* 卓反映モーダル */}
      {isReflectOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="reflect-modal-title">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 id="reflect-modal-title" className="text-lg font-semibold mb-4">卓に反映</h3>

            <label className="block text-sm mb-1">卓番号を選択</label>
            <select
              value={reflectTable}
              onChange={e => setReflectTable(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="">選択してください</option>
              {tableSettings.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label className="block text-sm mb-1">開始時間</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button onClick={closeReflectModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">キャンセル</button>
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

      {/* 予約リスト（省略） */}
    </main>
  )
}
