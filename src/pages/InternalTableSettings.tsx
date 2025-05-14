// src/pages/InternalTableSettings.tsx
import React, { useState, useCallback, useMemo } from 'react'
import { useAppContext, TableSetting } from '../context/AppContext'

export default function InternalTableSettings() {
  const { state, dispatch } = useAppContext()
  const tableSettings: TableSetting[] = state.tableSettings || []
  const [newTable, setNewTable] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAdd = useCallback(() => {
    setError('')
    const trimmed = newTable.trim()
    if (!trimmed) return
    setIsLoading(true)
    try {
      dispatch({ type: 'ADD_TABLE_SETTING', payload: trimmed })
      setNewTable('')
      setMessage(`卓 ${trimmed} を追加しました`)
    } catch {
      setError('追加に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, newTable])

  const handleDelete = useCallback((table: TableSetting) => {
    if (!window.confirm(`本当に卓 ${table} を削除しますか？`)) return
    setError('')
    setIsLoading(true)
    try {
      dispatch({ type: 'REMOVE_TABLE_SETTING', payload: table })
      setMessage(`卓 ${table} を削除しました`)
    } catch {
      setError('削除に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }, [dispatch])

  const rendered = useMemo(() =>
    tableSettings.map((t) => (
      <li key={t} className="flex justify-between items-center border p-2 rounded bg-gray-50">
        <span>{t}</span>
        <button
          onClick={() => handleDelete(t)}
          disabled={isLoading}
          className={`text-sm hover:underline ${isLoading ? 'text-gray-400' : 'text-red-500'}`}
          aria-label={`卓 ${t} を削除`}
        >
          {isLoading ? '削除中...' : '削除'}
        </button>
      </li>
    )), [tableSettings, handleDelete, isLoading])

  return (
    <div className="p-6">
      <div aria-live="polite" className="mb-4">
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>

      <h1 className="text-2xl font-bold mb-4">内部用卓設定</h1>
      <div className="flex mb-4 space-x-2 items-center">
        <input
          type="text"
          placeholder="例: T4"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          className="border p-2 rounded flex-grow"
          disabled={isLoading}
        />
        <button
          onClick={handleAdd}
          disabled={isLoading}
          className={`px-4 py-2 rounded ${isLoading ? 'bg-gray-400 text-gray-200' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {isLoading ? '追加中...' : '追加'}
        </button>
      </div>

      {tableSettings.length === 0 ? (
        <p className="text-gray-500">設定された卓はありません。</p>
      ) : (
        <ul className="space-y-2">
          {rendered}
        </ul>
      )}
    </div>
  )
}
