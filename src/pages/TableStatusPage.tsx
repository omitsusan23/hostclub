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

  const [overlayMessage, setOverlayMessage] = useState<string>('')
  const [isFirstModalOpen, setFirstModalOpen] = useState(false)
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [selectedCount, setSelectedCount] = useState<number>(1)
  const [names, setNames] = useState<string[]>([''])
  const inUseTables = tables.map(t => t.tableNumber)

  const handleDelete = useCallback(async (id: number) => {
    const table = tables.find(t => t.id === id)
    if (!table) return
    if (!window.confirm(`本当に卓 ${table.tableNumber} を削除しますか？`)) return

    dispatch({ type: 'DELETE_TABLE', payload: id })
    setOverlayMessage(`卓 ${table.tableNumber} を削除しました`)
    setTimeout(() => setOverlayMessage(''), 1000)
  }, [dispatch, tables])

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
    const a = [...names]; a[idx] = e.target.value; setNames(a)
  }
  const handleFirstConfirm = () => {
    setOverlayMessage(`${names[0] || 'お客様'}様は卓 ${selectedTable} に着席しました`)
    setTimeout(() => setOverlayMessage(''), 1000)
    closeFirstModal()
  }

  const renderedTables = useMemo(() => tables.map((table: Table) => (
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
        className="text-sm hover:underline text-red-500"
        aria-label={`卓 ${table.tableNumber} を削除`}
      >
        削除
      </button>
    </div>
  )), [tables, handleDelete])

  return (
    <main id="main-content" className="p-4 pb-16">
      {/* 見出し＋初回ボタン */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-center flex-grow">卓状況</h2>
        <button
          onClick={openFirstModal}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4"
        >
          初回
        </button>
      </div>

      {/* テーブル一覧 */}
      {tables.length === 0 ? (
        <p className="text-gray-500">まだ反映された卓はありません。</p>
      ) : (
        <div className="space-y-3">{renderedTables}</div>
      )}

      {/* 中央オーバーレイ */}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 text-white px-6 py-4 rounded text-lg">
            {overlayMessage}
          </div>
        </div>
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

            {/* お客様名入力（横一列） */}
            <div className="flex items-start space-x-4 mb-4">
              {positionsMap[selectedCount].map((pos, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <label className="text-sm mb-1">{pos || 'お客様'}</label>
                  <input
                    type="text"
                    value={names[idx] || ''}
                    onChange={handleNameChange(idx)}
                    className="border p-2 rounded w-20 text-center truncate"
                    placeholder="任意"
                    maxLength={6}
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
