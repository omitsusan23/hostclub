import React, { useState, useRef, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

interface Props {
  isOpen: boolean
  onClose: () => void
  currentUser: any
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

  // 反映モーダル state
  const [isReflectOpen, setReflectOpen] = useState(false)
  const [selectedRes, setSelectedRes] = useState<any>(null)
  const [reflectTable, setReflectTable] = useState('')
  const [startTime, setStartTime] = useState('')

  // 管理権限
  const canAssign = currentUser?.role === 'admin' || currentUser?.canManageTables

  // フォーカス用 ref
  const firstInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) firstInputRef.current?.focus()
  }, [isOpen])

  // ESC で閉じる
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      closeReflectModal()
    }
  }

  // バリデーション
  const validate = () => {
    const newErrors: typeof errors = {}
    if (!princess.trim()) newErrors.princess = '姫名を入力してください'
    if (!requestedTable.trim()) newErrors.requestedTable = '希望卓番号を入力してください'
    if (budget === '' || isNaN(budget as number)) newErrors.budget = '予算を入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 予約追加
  const handleAdd = () => {
    if (!validate()) return
    dispatch({
      type: 'ADD_RESERVATION',
      payload: {
        id: Date.now().toString(),
        princess: princess.trim(),
        requestedTable: requestedTable.trim(),
        budget: Number(budget),
      },
    })
    setPrincess('')
    setRequestedTable('')
    setBudget('')
    setErrors({})
    onClose()
  }

  // 反映モーダル開く
  const openReflectModal = (res: any) => {
    setSelectedRes(res)
    setReflectTable(res.requestedTable)
    setStartTime('')
    setReflectOpen(true)
  }
  const closeReflectModal = () => {
    setReflectOpen(false)
    setSelectedRes(null)
    setReflectTable('')
    setStartTime('')
  }

  // 卓反映
  const handleReflect = () => {
    if (!reflectTable || !startTime) return
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

  return (
    <main
      id="main-content"
      className="p-4 pb-16"
      onKeyDown={handleKeyDown}
    >
      <h2 className="text-xl font-bold mb-4">来店予約表</h2>

      {/* 追加モーダル */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="res-modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 id="res-modal-title" className="text-lg font-semibold mb-4">
              予約詳細を入力
            </h3>

            <label className="block text-sm mb-1">姫名</label>
            <input
              ref={firstInputRef}
              type="text"
              value={princess}
              onChange={e => setPrincess(e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />
            {errors.princess && (
              <p className="text-red-500 text-sm mb-2">{errors.princess}</p>
            )}

            <label className="block text-sm mb-1">希望卓番号</label>
            <input
              type="text"
              value={requestedTable}
              onChange={e => setRequestedTable(e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />
            {errors.requestedTable && (
              <p className="text-red-500 text-sm mb-2">{errors.requestedTable}</p>
            )}

            <label className="block text-sm mb-1">予算（円）</label>
            <input
              type="number"
              value={budget}
              onChange={e =>
                setBudget(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="border p-2 w-full rounded mb-4"
            />
            {errors.budget && (
              <p className="text-red-500 text-sm mb-4">{errors.budget}</p>
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

      {/* 反映モーダル */}
      {isReflectOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reflect-modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 id="reflect-modal-title" className="text-lg font-semibold mb-4">
              卓に反映
            </h3>

            <label className="block text-sm mb-1">卓を選択</label>
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
              <button
                onClick={closeReflectModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleReflect}
                disabled={!reflectTable || !startTime}
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
        {reservations.map(res => (
          <div key={res.id} className="border p-4 rounded bg-white">
            <p><strong>姫名:</strong> {res.princess}</p>
            <p><strong>希望卓:</strong> {res.requestedTable}</p>
            <p><strong>予算:</strong> {res.budget.toLocaleString()}円</p>
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
                onClick={() => dispatch({ type: 'DELETE_RESERVATION', payload: res.id })}
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
