// src/pages/ReservationPage.tsx
import React, {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { useAppContext, type Reservation, type User } from '../context/AppContext'

// 19:00～25:00 を15分刻みで生成
const generateTimeOptions = (): string[] => {
  const opts: string[] = []
  for (let h = 19; h <= 25; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 25 && m > 0) continue
      const hh = h.toString().padStart(2, '0')
      const mm = m.toString().padStart(2, '0')
      opts.push(`${hh}:${mm}`)
    }
  }
  return opts
}
const timeOptions = generateTimeOptions()

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

  // 使用中の卓番号リスト
  const assignedNumbers = tables.map((t) => t.tableNumber)

  // 入力 state
  const [princess, setPrincess] = useState('')
  const [requestedTable, setRequestedTable] = useState('')
  const [plannedTime, setPlannedTime] = useState('')
  const [budgetMode, setBudgetMode] = useState<'undecided' | 'input'>(
    'undecided'
  )
  const [budget, setBudget] = useState<number | ''>('')
  const [errors, setErrors] = useState<{
    princess?: string
    budget?: string
  }>({})

  // トースト＆削除メッセージ
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState('')

  // モーダル初期フォーカス
  const firstInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) firstInputRef.current?.focus()
  }, [isOpen])

  // ESC で閉じる
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') onClose()
  }

  // 卓反映モーダル state
  const [isReflectOpen, setReflectOpen] = useState(false)
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [reflectTable, setReflectTable] = useState('')
  const [startTime, setStartTime] = useState('')

  const canAssign =
    currentUser?.role === 'admin' || currentUser?.canManageTables

  // バリデーション
  const validate = () => {
    const newErrors: typeof errors = {}
    if (!princess.trim()) newErrors.princess = '姫名を入力してください'
    if (budgetMode === 'input' && (budget === '' || isNaN(budget as number)))
      newErrors.budget = '予算を入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 予約追加
  const handleAdd = () => {
    if (!validate()) return
    dispatch({
      type: 'ADD_RESERVATION',
      payload: {
        id: Date.now(),
        princess: princess.trim(),
        requestedTable: requestedTable.trim(),
        time: plannedTime,
        budget: budgetMode === 'input' ? Number(budget) : 0,
      },
    })
    setPrincess('')
    setRequestedTable('')
    setPlannedTime('')
    setBudgetMode('undecided')
    setBudget('')
    setErrors({})
    onClose()
  }

  // 予約削除（確認＋メッセージ）
  const handleReservationDelete = (id: number, name: string) => {
    if (!window.confirm(`本当に ${name} さんの予約を削除しますか？`)) return
    dispatch({ type: 'DELETE_RESERVATION', payload: id })
    setDeleteMessage(`${name} さんの予約を削除しました`)
    setTimeout(() => setDeleteMessage(''), 1000)
  }

  // 卓反映モーダルを開く
  const openReflectModal = (res: Reservation) => {
    setSelectedRes(res)
    setReflectTable(res.requestedTable)
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

  // 修正：ASSIGN_TABLE の payload に requestedTable を渡すように
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
        id: selectedRes.id,
        requestedTable: reflectTable,
        princess: selectedRes.princess,
        budget: selectedRes.budget,
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

  // 予算モード切替＆入力
  const handleBudgetModeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setBudgetMode(e.target.value as 'undecided' | 'input')
    setBudget('')
    setErrors((prev) => ({ ...prev, budget: undefined }))
  }
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
      {/* 削除メッセージ */}
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">
            {deleteMessage}
          </div>
        </div>
      )}

      {/* 卓反映トースト */}
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
        {/* ... 以下、既存の JSX は変更なし ... */}
      </main>
    </>
  )
}
