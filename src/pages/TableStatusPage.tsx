// src/pages/TableStatusPage.tsx

import React, { useState, useCallback, useMemo } from 'react'
import { useAppContext, Table } from '../context/AppContext'

// 人数ごとのポジションラベル定義
const positionsMap: Record<number, string[]> = {
  1: [''],
  2: ['左', '右'],
  3: ['左', '中', '右'],
  4: ['左端', '左', '右', '右端'],
  5: ['左端', '左', '中', '右', '右端'],
  6: ['左端', '左中', '左', '右', '右中', '右端'],
}

const TableStatusPage: React.FC = () => {
  const { state: { tables, tableSettings }, dispatch } = useAppContext()
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // 「初回」モーダル用 state
  const [isFirstModalOpen, setFirstModalOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [selectedCount, setSelectedCount] = useState<number>(1)
  const [names, setNames] = useState<string[]>([''])

  const inUseTables = tables.map(t => t.tableNumber)

  const openFirstModal = () => {
    setSelectedTable('')
    setSelectedCount(1)
    setNames([''])
    setFirstModalOpen(true)
  }
  const closeFirstModal = () => setFirstModalOpen(false)

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const n = Number(e.target.value)
    setSelectedCount(n)
    setNames(Array(n).fill(''))
  }

  const handleNameChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = [...names]
    arr[idx] = e.target.value
    setNames(arr)
  }

  const handleFirstConfirm = () => {
    // TODO: dispatch に置き換え
    alert(`卓 ${selectedTable} に ${selectedCount} 名を反映しました`)
    closeFirstModal()
  }

  const handleDelete = useCallback(async (id: number) => {
    const table = tables.find(t => t.id === id)
    if (!table) return
    if (!window.confirm(`本当に卓 ${table.tableNumber} を削除しますか？`)) return

    setError('')
    setDeletingId(id)
    try {
      dispatch({ type: 'DELETE_TABLE', payload: id })
      setMessage(`卓 ${table.tableNumber} を削除しました`)
      setTimeout(() => setMessage(''), 1000)
    } catch {
      setError('卓の削除に失敗しました')
      setTimeout(() => setError(''), 1000)
    } finally {
      setDeletingId(null)
    }
  }, [dispatch, tables])

  const renderedTables = useMemo(() =>
    tables.map((table: Table) => (
      <div
        key={table.id}
        className="border rounded p-4 shadow-sm bg-white flex justify-between items-start"
      >
        <div>
          <p><strong>卓番号:</strong> {table.tableNumber}</p>
          <p><strong>姫名:</strong> {table.princess}</p>
          <p>
            <strong>予算:</strong>{' '}
            {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}
          </p>
          <p>
            <strong>開始時間:</strong>{' '}
            {table.time.replace(/:\d{2}$/, '')}
          </p>
        </div>
        <button
          onClick={() => handleDelete(table.id)}
          disabled={deletingId === table.id}
          className={`text-sm hover:underline ${
            deletingId === table.id ? 'text-gray-400' : 'text-red-500'
          }`}
          aria-label={`卓 ${table.tableNumber} を削除`}
        >
          {deletingId === table.id ? '削除中...' : '削除'}
        </button>
      </div>
    )),
  [tables, deletingId, handleDelete])

  return (
    <main id="main-content" className="p-4 pb-16">
      {/* 見出し＋初回ボタン */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-0 text-center flex-grow">卓状況</h2>
        <button
          onClick={openFirstModal}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4"
        >
          初回
        </button>
      </div>

      {/* メッセージ */}
      {(message || error) && (
        <div aria-live="polite" className="mb-4">
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}

      {/* テーブル一覧 */}
      {tables.length === 0 ? (
        <p className="text-gray-500">まだ反映された卓はありません。</p>
      ) : (
        <div className="space-y-3">{renderedTables}</div>
      )}

      {/* 初回来店モーダル */}
      {isFirstModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="first-modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3
              id="first-modal-title"
              className="text-lg font-semibold mb-4 text-center"
            >
              初回来店反映
            </h3>

            {/* 卓選択 */}
            <label className="block text-sm mb-1">卓を選択</label>
            <select
              value={selectedTable}
              onChange={e => setSelectedTable(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="">選択してください</option>
              {tableSettings.map(t => (
                <option key={t} value={t} disabled={inUseTables.includes(t)}>
                  {t}{inUseTables.includes(t) ? '（使用中）' : ''}
                </option>
              ))}
            </select>

            {/* 人数選択 */}
            <label className="block text-sm mb-1">人数</label>
            <select
              value={selectedCount}
              onChange={handleCountChange}
              className="border p-2 w-full rounded mb-4"
            >
              {[1,2,3,4,5,6].map(n => (
                <option key={n} value={n}>{n} 名</option>
              ))}
            </select>

            {/* お客様名入力（動的列数） */}
            <div
              className={`grid gap-2 mb-4 grid-cols-${selectedCount}`}
            >
              {positionsMap[selectedCount].map((pos, idx) => (
                <div key={idx} className="flex flex-col">
                  <label className="text-sm mb-1 text-center">
                    {pos || 'お客様'}
                  </label>
                  <input
                    type="text"
                    value={names[idx] || ''}
                    onChange={handleNameChange(idx)}
                    className="border p-2 rounded text-center w-full truncate"
                    placeholder="任意入力"
                    maxLength={12}
                  />
                </div>
              ))}
            </div>

            {/* 操作ボタン */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeFirstModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={handleFirstConfirm}
                disabled={!selectedTable}
                className={`px-4 py-2 rounded ${
                  !selectedTable
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                反映
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default TableStatusPage
