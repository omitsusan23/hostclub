// src/pages/AdminDashboard.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useStore } from '../context/StoreContext'
import { getSubdomain } from '../utils/getSubdomain'

interface Props {
  setCurrentUser: (user: any) => void
}

export default function AdminDashboard({ setCurrentUser }: Props) {
  const subdomain = getSubdomain()
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const { tables, tableSettings = [] } = state
  const { currentStore } = useStore()

  // テーブル設定用 state (テスト用)
  const [newTable, setNewTable] = useState('')

  // ログアウト
  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">運営ダッシュボード</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 underline"
        >
          ログアウト
        </button>
      </div>

      {currentStore ? (
        <div className="mb-4">
          <p>店舗名: {currentStore.name}</p>
          <p>サブドメイン: {subdomain}</p>
        </div>
      ) : (
        <p className="text-red-600 mb-4">店舗情報を取得できませんでした。</p>
      )}

      <h2 className="text-xl font-semibold mb-2">卓状況</h2>
      {tables.length === 0 ? (
        <p className="text-gray-500 mb-6">まだ反映された卓はありません。</p>
      ) : (
        <div className="space-y-3 mb-6">
          {tables.map((table) => (
            <div
              key={table.id}
              className="border rounded p-4 shadow-sm bg-white flex justify-between items-start"
            >
              <div>
                <p><strong>卓番号:</strong> {table.tableNumber}</p>
                <p><strong>姫名:</strong> {table.princess}</p>
                <p><strong>予算:</strong> {table.budget}円</p>
                <p><strong>反映時刻:</strong> {table.time}</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'DELETE_TABLE', payload: table.id })}
                className="text-sm text-red-500 hover:underline"
              >
                削除
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">卓設定 (テスト用)</h2>
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          placeholder="例: T4"
          className="border p-2 rounded flex-grow"
        />
        <button
          onClick={() => {
            const trimmed = newTable.trim()
            if (trimmed) {
              dispatch({ type: 'ADD_TABLE_SETTING', payload: trimmed })
              setNewTable('')
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>
      {tableSettings.length === 0 ? (
        <p className="text-gray-500 mb-6">設定された卓はありません。</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {tableSettings.map((t) => (
            <li
              key={t}
              className="flex justify-between items-center border p-2 rounded bg-gray-50"
            >
              <span>{t}</span>
              <button
                onClick={() => dispatch({ type: 'REMOVE_TABLE_SETTING', payload: t })}
                className="text-sm text-red-500 hover:underline"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
