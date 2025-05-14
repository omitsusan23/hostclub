// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppContext, Table } from '../context/AppContext';

const TableStatusPage: React.FC = () => {
  const {
    state: { tables, tableSettings, casts },
    dispatch,
  } = useAppContext();

  // 全体のメッセージ（オーバーレイ表示）
  const [overlayMessage, setOverlayMessage] = useState<string>('');

  // 削除メッセージ（オーバーレイ表示）
  const [deleteMessage, setDeleteMessage] = useState<string>('');

  // 削除対象 ID
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 初回来店モーダル
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [firstStep, setFirstStep] = useState(true);

  // モーダル入力状態
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [names, setNames] = useState<string[]>([]);
  const [photoChoice, setPhotoChoice] = useState<string>('なし');

  // モーダル開閉
  const openFirstModal = () => {
    setFirstStep(true);
    setSelectedTable('');
    setSelectedCount(0);
    setNames([]);
    setPhotoChoice('なし');
    setFirstModalOpen(true);
  };
  const closeFirstModal = () => setFirstModalOpen(false);

  // 削除ハンドラ
  const handleDelete = useCallback((id: number) => {
    const table = tables.find(t => t.id === id);
    if (!table) return;
    if (!window.confirm(`本当に卓 ${table.tableNumber} を削除しますか？`)) return;
    setDeletingId(id);
    dispatch({ type: 'DELETE_TABLE', payload: id });
    setDeleteMessage(`卓 ${table.tableNumber} を削除しました`);
    setTimeout(() => setDeleteMessage(''), 1000);
  }, [dispatch, tables]);

  // 初回来店：ステップ１確定
  const handleFirstNext = () => {
    if (!selectedTable || selectedCount < 1) return;
    // 名前配列を人数分用意
    setNames(Array(selectedCount).fill(''));
    setFirstStep(false);
  };

  // 初回来店：確定
  const handleFirstConfirm = () => {
    // dispatch パターンが別途必要ならここで行う
    setOverlayMessage(
      `${names[0] || 'お客様'}様は卓 ${selectedTable} に着席しました`
      + (photoChoice !== 'なし' ? `（指名：${photoChoice}）` : '')
    );
    setTimeout(() => setOverlayMessage(''), 1000);
    closeFirstModal();
  };

  // テーブルリスト描画
  const renderedTables = useMemo(() => tables.map((table: Table) => (
    <div
      key={table.id}
      className="border rounded p-4 shadow-sm bg-white flex justify-between items-start"
    >
      <div>
        <p><strong>卓番号:</strong> {table.tableNumber}</p>
        <p><strong>姫名:</strong> {table.princess}</p>
        <p><strong>予算:</strong> {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}</p>
        <p><strong>開始時間:</strong> {table.time.slice(0,5)}</p>
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
      {/* 削除メッセージオーバーレイ */}
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">
            {deleteMessage}
          </div>
        </div>
      )}
      {/* 初回来店 メッセージオーバーレイ */}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">
            {overlayMessage}
          </div>
        </div>
      )}

      <main id="main-content" className="p-4 pb-16">
        {/* 初回来店ボタン */}
        <div className="flex justify-end mb-4">
          <button
            onClick={openFirstModal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            初回
          </button>
        </div>

        {/* 見出し */}
        <h2 className="text-2xl font-bold mb-4 text-center">
          卓状況
        </h2>

        {tables.length === 0 ? (
          <p className="text-gray-500">まだ反映された卓はありません。</p>
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
            {firstStep ? (
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
                    onClick={handleFirstNext}
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
                <label className="block text-sm mb-2">写真指名</label>
                <select
                  value={photoChoice}
                  onChange={e => setPhotoChoice(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value="なし">写真指名なし</option>
                  {casts.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {names.map((name, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`名前${idx+1}`}
                      value={name}
                      onChange={e => {
                        const newArr = [...names];
                        newArr[idx] = e.target.value.slice(0, 6);
                        setNames(newArr);
                      }}
                      className="border p-2 rounded w-full"
                    />
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={closeFirstModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                    戻る
                  </button>
                  <button
                    onClick={handleFirstConfirm}
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
};

export default TableStatusPage;
