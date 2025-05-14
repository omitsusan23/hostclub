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
  6: ['左端', '左中', '中', '右中', '右', '右端'],
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

  // 現在使用中の卓を抽出
  const inUseTables = tables.map(t => t.tableNumber)

  // 初回モーダルを開く
  const openFirstModal = () => {
    setSelectedTable('')
    setSelectedCount(1)
    setNames([''])
    setFirstModalOpen(true)
  }
  const closeFirstModal = () => setFirstModalOpen(false)

  // 人数が変わったら names 配列を再構築
  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const n = Number(e.target.value)
    setSelectedCount(n)
    setNames(Array(n).fill(''))
  }

  // 名前入力ハンドラ
  const handleNameChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const copy = [...names]
    copy[idx] = e.target.value
    setNames(copy)
  }

  // 初回反映確定（現状は alert。後で dispatch に差し替え可能）
  const handleFirstConfirm = () => {
    alert(`卓 ${selectedTable} に ${selectedCount} 名を反映しました`)
    // TODO: dispatch({ type: 'ASSIGN_FIRST_VISIT', payload: {...} })
    closeFirstModal()
  }

  // 削除ハンドラ（確認ダイアログ→中央メッセージ→1秒後消去）
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

  // テーブル一覧レンダリング
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
            {/* 秒を切り捨て */}
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
      {/* 見出し＋「初回」ボタン */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">卓状況</h2>
        <button
          onClick={openFirstModal}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          初回
        </button>
      </div>

      {/* 成功／エラーメッセージ */}
      {(message || error) && (
        <div aria-live="polite" className="mb-4">
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}

      {/* テーブル一覧 or 空メッセージ */}
      {tables.length === 0 ? (
        <p className="text-gray-500">まだ反映された卓はありません。</p>
      ) : (
        <div className="space-y-3">{renderedTables}</div>
      )}

      {/* 初回来店反映モーダル */}
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
              {tableSettings
                .filter(t => !inUseTables.includes(t))
                .map(t => (
                  <option key={t} value={t}>{t}</option>
                ))
              }
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

            {/* 名前フォーム */}
            <div className="space-y-2 mb-4">
              {positionsMap[selectedCount].map((pos, idx) => (
                <div key={idx}>
                  <label className="block text-sm mb-1">
                    {pos ? `${pos} のお客様名` : 'お客様名'}
                  </label>
                  <input
                    type="text"
                    value={names[idx] || ''}
                    onChange={handleNameChange(idx)}
                    className="border p-2 w-full rounded"
                    placeholder="任意入力"
                  />
                </div>
              ))}
            </div>

            {/* モーダルボタン */}
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
