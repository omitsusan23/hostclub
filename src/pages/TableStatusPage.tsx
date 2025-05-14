// src/pages/TableStatusPage.tsx

import React, { useState, useCallback, useMemo } from 'react'
import { useAppContext, Table } from '../context/AppContext'

// ポジションラベル（使わなくてもOKですが位置名だけ残しています）
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

  // 中央オーバーレイメッセージ
  const [overlayMessage, setOverlayMessage] = useState('')
  // 初回来店モーダルの開閉＆ステップ管理
  const [isFirstModalOpen, setFirstModalOpen] = useState(false)
  const [firstStep, setFirstStep] = useState(true)
  // ステップ１：選択された人数
  const [selectedCount, setSelectedCount] = useState(0)
  // ステップ２：選択された卓と名前リスト
  const [selectedTable, setSelectedTable] = useState('')
  const [names, setNames] = useState<string[]>([])

  // 使用中の卓番号リスト
  const inUseTables = tables.map(t => t.tableNumber)

  // --- 削除 ---
  const handleDelete = useCallback((id: number) => {
    const tbl = tables.find(t => t.id === id)
    if (!tbl || !window.confirm(`本当に卓 ${tbl.tableNumber} を削除しますか？`)) return
    dispatch({ type: 'DELETE_TABLE', payload: id })
    setOverlayMessage(`卓 ${tbl.tableNumber} を削除しました`)
    setTimeout(() => setOverlayMessage(''), 1000)
  }, [dispatch, tables])

  // --- モーダルオープン時リセット ---
  const openFirstModal = () => {
    setFirstStep(true)
    setSelectedCount(0)
    setNames([])
    setSelectedTable('')
    setFirstModalOpen(true)
  }
  const closeFirstModal = () => setFirstModalOpen(false)

  // --- ステップ１：人数選択 ---
  const handleCountSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const n = Number(e.target.value)
    setSelectedCount(n)
  }
  const gotoStep2 = () => {
    setNames(Array(selectedCount).fill(''))
    setFirstStep(false)
  }

  // --- ステップ２：名前入力＆最終確定 ---
  const handleNameChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const arr = [...names]; arr[idx] = e.target.value; setNames(arr)
  }
  const handleFirstConfirm = () => {
    setOverlayMessage(
      `${names[0] || 'お客様'}様は卓 ${selectedTable} に着席しました`
    )
    setTimeout(() => setOverlayMessage(''), 1000)
    closeFirstModal()
  }

  // --- テーブルリスト描画 ---
  const renderedTables = useMemo(() => tables.map(tbl => (
    <div
      key={tbl.id}
      className="border rounded p-4 shadow-sm bg-white flex justify-between items-start"
    >
      <div>
        <p><strong>卓番号:</strong> {tbl.tableNumber}</p>
        <p><strong>姫名:</strong> {tbl.princess}</p>
        <p><strong>予算:</strong> {tbl.budget === 0 ? '未定' : `${tbl.budget.toLocaleString()}円`}</p>
        <p><strong>開始時間:</strong> {tbl.time.replace(/:\d{2}$/, '')}</p>
      </div>
      <button
        onClick={() => handleDelete(tbl.id)}
        className="text-sm hover:underline text-red-500"
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
      {tables.length === 0
        ? <p className="text-gray-500">まだ反映された卓はありません。</p>
        : <div className="space-y-3">{renderedTables}</div>
      }

      {/* オーバーレイメッセージ */}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 text-white px-6 py-4 rounded text-lg">
            {overlayMessage}
          </div>
        </div>
      )}

      {/* 初回来店モーダル（２ステップ） */}
      {isFirstModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            {firstStep ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">初回来店：人数選択</h3>
                <label className="block text-sm mb-2">人数を選択してください</label>
                <select
                  value={selectedCount}
                  onChange={handleCountSelect}
                  className="border p-2 w-full rounded mb-6"
                >
                  <option value={0} disabled>人数を選択してください</option>
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n} value={n}>{n} 名</option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closeFirstModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={gotoStep2}
                    disabled={selectedCount === 0}
                    className={`px-4 py-2 rounded ${
                      selectedCount === 0
                        ? 'bg-gray-300 text-gray-500'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    次へ
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">初回来店：お客様情報</h3>
                {/* 卓選択 */}
                <label className="block text-sm mb-2">卓を選択</label>
                <select
                  value={selectedTable}
                  onChange={e => setSelectedTable(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value="" disabled>選択してください</option>
                  {tableSettings.map(t => (
                    <option key={t} value={t} disabled={inUseTables.includes(t)}>
                      {t}{inUseTables.includes(t) ? '（使用中）' : ''}
                    </option>
                  ))}
                </select>

                {/* お客様名入力（横並び） */}
                <div className="flex items-start space-x-4 mb-6">
                  {names.map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <label className="text-sm mb-1">
                        {positionsMap[selectedCount][idx] || 'お客様'}
                      </label>
                      <input
                        type="text"
                        value={names[idx]}
                        onChange={handleNameChange(idx)}
                        className="border p-2 rounded w-20 text-center truncate"
                        placeholder="任意"
                        maxLength={6}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setFirstStep(true)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    戻る
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
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default TableStatusPage
