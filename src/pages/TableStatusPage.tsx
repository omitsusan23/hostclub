// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext, Table } from '../context/AppContext';

const positionLabelsByCount: Record<number, string[]> = {
  1: [], // 一名時はラベルなし
  2: ['左', '右'],
  3: ['左', '中', '右'],
  4: ['左端', '左', '右', '右端'],
  5: ['左端', '左', '中', '右', '右端'],
  6: ['左端', '左中', '左', '右', '右中', '右端'],
};

export default function TableStatusPage() {
  const { state: { tables, tableSettings, casts }, dispatch } = useAppContext();

  const [overlayMessage, setOverlayMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 初回来店モーダル
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [step1, setStep1] = useState(true);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  const openFirstModal = () => {
    setStep1(true);
    setSelectedTable('');
    setSelectedCount(0);
    setNames([]);
    setPhotos([]);
    setFirstModalOpen(true);
  };
  const closeFirstModal = () => setFirstModalOpen(false);

  // ステップ1→2
  const nextStep = () => {
    if (!selectedTable || selectedCount < 1) return;
    setNames(Array(selectedCount).fill(''));
    setPhotos(Array(selectedCount).fill('なし'));
    setStep1(false);
  };

  // 削除
  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    setDeletingId(id);
    dispatch({ type: 'DELETE_TABLE', payload: id });
    setDeleteMessage(`卓 ${t.tableNumber} を削除しました`);
    setTimeout(() => setDeleteMessage(''), 1000);
  }, [dispatch, tables]);

  // 初回来店確定
  const confirmFirst = () => {
    const now = new Date();
    const hhmm = now.toTimeString().slice(0, 5);

    // ↓ここを修正：payload に tableNumber ではなく requestedTable を渡す
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        id: Date.now(),
        princess: names.join('、'),
        requestedTable: selectedTable,
        budget: 0,
        time: hhmm,
      } as Table,
    });

    const entries = names.map((n, i) => {
      const label = positionLabelsByCount[selectedCount][i];
      const pname = n || 'お客様';
      const pcast = photos[i] !== 'なし' ? `（指名：${photos[i]}）` : '';
      return (label ? `${label}: ` : '') + `${pname}${pcast}`;
    });
    setOverlayMessage(`卓【${selectedTable}】に着席：` + entries.join('、'));
    setTimeout(() => setOverlayMessage(''), 1000);
    closeFirstModal();
  };

  // テーブルリスト描画
  const renderedTables = useMemo(() => tables.map(table => (
    <div
      key={table.id}
      className="border rounded p-4 shadow-sm bg-white flex justify-between items-start"
    >
      <div>
        <p className="text-center"><strong>卓番号:</strong> {table.tableNumber}</p>
        <p className="text-center"><strong>姫名:</strong> {table.princess}</p>
        <p className="text-center"><strong>予算:</strong> {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}</p>
        <p className="text-center"><strong>開始時間:</strong> {table.time}</p>
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
  )), [tables, handleDelete, deletingId]);

  return (
    <>
      {/* 削除オーバーレイ */}
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">
            {deleteMessage}
          </div>
        </div>
      )}
      {/* 着席オーバーレイ */}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded max-w-md text-center">
            {overlayMessage}
          </div>
        </div>
      )}

      <main id="main-content" className="p-4 pb-16">
        {/* 見出し＋初回ボタン */}
        <div className="flex items-center justify-center mb-4 relative">
          <h2 className="text-2xl font-bold text-center">卓状況</h2>
          <button
            onClick={openFirstModal}
            className="absolute right-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            初回
          </button>
        </div>

        {tables.length === 0 ? (
          <p className="text-gray-500 text-center">まだ反映された卓はありません。</p>
        ) : (
          <div className="space-y-3">{renderedTables}</div>
        )}
      </main>

      {/* 初回来店モーダル */}
      {firstModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {step1 ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  初回来店：卓と人数を選択
                </h3>
                <label className="block text-sm mb-2">卓を選択</label>
                <select
                  value={selectedTable}
                  onChange={e => setSelectedTable(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value="">選択してください</option>
                  {tableSettings.map(t =>
                    tables.some(tab => tab.tableNumber === t)
                      ? <option key={t} value={t} disabled>{t}（使用中）</option>
                      : <option key={t} value={t}>{t}</option>
                  )}
                </select>
                <label className="block text-sm mb-2">人数を選択</label>
                <select
                  value={selectedCount}
                  onChange={e => setSelectedCount(Number(e.target.value))}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value={0}>人数を選択してください</option>
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n} value={n}>{n} 名</option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <button onClick={closeFirstModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    キャンセル
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!selectedTable || selectedCount < 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    次へ
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  初回来店：お客様情報
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {names.map((_, i) => (
                    <div key={i}>
                      {positionLabelsByCount[selectedCount][i] && (
                        <label className="block text-xs text-gray-500 mb-1">
                          {positionLabelsByCount[selectedCount][i]}
                        </label>
                      )}
                      <input
                        type="text"
                        placeholder="名前"
                        value={names[i]}
                        onChange={e => {
                          const a = [...names];
                          a[i] = e.target.value.slice(0, 6);
                          setNames(a);
                        }}
                        className="border p-2 rounded w-full"
                      />
                      <select
                        value={photos[i]}
                        onChange={e => {
                          const b = [...photos];
                          b[i] = e.target.value;
                          setPhotos(b);
                        }}
                        className="border p-2 rounded w-full mt-1"
                      >
                        <option value="なし">写真指名なし</option>
                        {casts.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => setStep1(true)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    戻る
                  </button>
                  <button
                    onClick={confirmFirst}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    反映
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
