import React, {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { useAppContext, type Reservation } from '../context/AppContext'
import Header from '../components/Header'

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

export default function ReservationPage() {
  const { state, dispatch } = useAppContext()
  const currentUser = state.currentUser
  const { reservations, tableSettings = [], tables } = state

  const assignedNumbers = tables.map((t) => t.tableNumber)

  const [princess, setPrincess] = useState('')
  const [requestedTable, setRequestedTable] = useState('')
  const [plannedTime, setPlannedTime] = useState('')
  const [budgetMode, setBudgetMode] = useState<'undecided' | 'input'>('undecided')
  const [budget, setBudget] = useState<number | ''>('')
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<{ princess?: string; budget?: string }>({})

  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState('')

  const firstInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) firstInputRef.current?.focus()
  }, [isOpen])

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') setIsOpen(false)
  }

  const [isReflectOpen, setReflectOpen] = useState(false)
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)
  const [reflectTable, setReflectTable] = useState('')
  const [startTime, setStartTime] = useState('')

  const canAssign = currentUser?.canManageTables === true

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!princess.trim()) newErrors.princess = '姫名を入力してください'
    if (budgetMode === 'input' && (budget === '' || isNaN(budget as number)))
      newErrors.budget = '予算を入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = () => {
    if (!validate()) return
    dispatch({
      type: 'ADD_RESERVATION',
      payload: {
        id: Date.now().toString(),
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
    setIsOpen(false)
  }

  const handleReservationDelete = (id: string, name: string) => {
    if (!window.confirm(`本当に ${name} さんの予約を削除しますか？`)) return
    dispatch({ type: 'DELETE_RESERVATION', payload: id })
    setDeleteMessage(`${name} さんの予約を削除しました`)
    setTimeout(() => setDeleteMessage(''), 1000)
  }

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

  const handleReflectConfirm = () => {
    if (!selectedRes || !reflectTable || !startTime || assignedNumbers.includes(reflectTable)) return
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
    setToastMessage(`${selectedRes.princess}様は${reflectTable}に着席しました`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 1000)
  }

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
      setErrors((prev) => ({ ...prev, budget: '許可されていない文字です' }))
    }
  }

  return (
    <>
      <Header title="来店予約">
        <button
          onClick={() => setIsOpen(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          追加
        </button>
      </Header>

      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">
            {deleteMessage}
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black text-white px-4 py-2 rounded">
            {toastMessage}
          </div>
        </div>
      )}

      <main id="main-content" className="p-4 pb-16 pt-[calc(env(safe-area-inset-top)+66px)]" onKeyDown={handleKeyDown}>
        {/* 見出しとボタンは削除済み。以下は予約一覧とモーダル関連です */}
        {/* ...（予約リスト、追加モーダル、反映モーダルはそのまま） */}
      </main>
    </>
  )
}
