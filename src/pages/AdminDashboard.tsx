// src/pages/AdminDashboard.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useStore } from '../context/StoreContext'
import Header from '../components/Header' // ✅ ヘッダーを読み込む

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const { tables, tableSettings = [] } = state
  const { currentStore } = useStore()

  const [newTable, setNewTable] = useState('')

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  return (
    <>
      {/* ✅ 共通ヘッダー */}
      <Header title="設定">
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 underline whitespace-nowrap"
        >
          ログアウト
        </button>
      </Header>

      {/* ✅ ヘッダーぶんスペース確保 */}
      <main className="p-4 pb-16 pt-[calc(env(safe-area-inset-top)+66px)]">
        <p className="text-sm text-gray-600 mb-4">
          ※ この画面はシステム管理者のみアクセス可能です
        </p>

        <h2 className="text-xl font-semibold mb-2">卓設定</h2>

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
                  onClick={() =>
                    dispatch({ type: 'REMOVE_TABLE_SETTING', payload: t })
                  }
                  className="text-sm text-red-500 hover:underline"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
