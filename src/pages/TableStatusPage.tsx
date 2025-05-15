// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext, Table } from '../context/AppContext';
import Footer from '../components/Footer';

type Filter = 'all' | 'occupied' | 'empty' | 'first';

const positionLabelsByCount: Record<number, string[]> = {
  1: [],
  2: ['左', '右'],
  3: ['左', '中', '右'],
  4: ['左端', '左', '右', '右端'],
  5: ['左端', '左', '中', '右', '右端'],
  6: ['左端', '左中', '左', '右', '右中', '右端'],
};

export default function TableStatusPage() {
  const { state: { tables, tableSettings, casts }, dispatch } = useAppContext();

  // フィルタリング
  const [filter, setFilter] = useState<Filter>('all');

  // オーバーレイ／モーダル機能
  const [overlayMessage, setOverlayMessage] = useState('');
  const [deleteMessage, setDeleteMessage]   = useState('');
  const [deletingId, setDeletingId]         = useState<number | null>(null);
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [step1, setStep1]                   = useState(true);
  const [selectedTable, setSelectedTable]   = useState('');
  const [selectedCount, setSelectedCount]   = useState(0);
  const [names, setNames]                   = useState<string[]>([]);
  const [photos, setPhotos]                 = useState<string[]>([]);
  const [firstStartTime, setFirstStartTime] = useState('');

  const openFirstModal = () => {
    const now = new Date();
    setFirstStartTime(now.toTimeString().slice(0,5));
    setStep1(true);
    setSelectedTable('');
    setSelectedCount(0);
    setNames([]);
    setPhotos([]);
    setFirstModalOpen(true);
  };
  const closeFirstModal = () => setFirstModalOpen(false);
  const nextStep = () => {
    if (!selectedTable || selectedCount < 1) return;
    setNames(Array(selectedCount).fill(''));
    setPhotos(Array(selectedCount).fill('なし'));
    setStep1(false);
  };

  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    setDeletingId(id);
    dispatch({ type: 'DELETE_TABLE', payload: id });
    setDeleteMessage(`卓 ${t.tableNumber} を削除しました`);
    setTimeout(() => setDeleteMessage(''), 1000);
  }, [dispatch, tables]);

  const confirmFirst = () => {
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        id: Date.now(),
        princess: names.join('、'),
        requestedTable: selectedTable,
        budget: 0,
        time: firstStartTime,
      },
    });
    const entries = names.map((n, i) => {
      const label = positionLabelsByCount[selectedCount][i];
      const pname = n || 'お客様';
      const pcast = photos[i] !== 'なし' ? `（指名：${photos[i]}）` : '';
      return (label ? `${label}: ` : '') + `${pname}${pcast}`;
    });
    setOverlayMessage(`卓【${selectedTable}】に着席：${entries.join('、')}`);
    setTimeout(() => setOverlayMessage(''), 1000);
    closeFirstModal();
  };

  const filteredTables: Table[] = useMemo(() => {
    switch (filter) {
      case 'occupied':
        return tables;
      case 'first':
        return tables.filter(t => t.budget === 0);
      case 'empty':
        return tableSettings
          .filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({
            id: Date.now() + num.length,
            tableNumber: num,
            princess: '',
            budget: 0,
            time: '',
          }));
      case 'all':
      default:
        const empty = tableSettings
          .filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({
            id: Date.now() + num.length,
            tableNumber: num,
            princess: '',
            budget: 0,
            time: '',
          }));
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings]);

  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => (
      <div
        key={idx}
        className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between"
      >
        {table.princess && (
          <button
            onClick={() => handleDelete(table.id)}
            disabled={deletingId === table.id}
            className={`absolute top-1 right-1 text-sm hover:underline ${
              deletingId === table.id ? 'text-gray-400' : 'text-red-500'
            }`}
            aria-label={`卓 ${table.tableNumber} を削除`}
          >
            {deletingId === table.id ? '削除中...' : '削除'}
          </button>
        )}
        <p className="text-center font-bold">{table.tableNumber}</p>
        {table.princess ? (
          <>
            <p className="text-sm mt-2"><strong>姫名:</strong> {table.princess}</p>
            <p className="text-sm"><strong>開始:</strong> {table.time.slice(0,5)}</p>
            <p className="text-sm">
              <strong>予算:</strong>{' '}
              {table.budget === 0
                ? '未定'
                : `${table.budget.toLocaleString()}円`}
            </p>
          </>
        ) : (
          <p className="text-sm mt-4 text-gray-400 text-center">空卓</p>
        )}
      </div>
    )),
  [filteredTables, handleDelete, deletingId]);

  return (
    <>
      {/* 削除メッセージ */}
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">
            {deleteMessage}
          </div>
        </div>
      )}

      {/* 着席メッセージ */}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded max-w-md text-center">
            {overlayMessage}
          </div>
        </div>
      )}

      {/* 固定ヘッダー */}
      <header className="sticky top-0 bg-white z-50 px-4 py-3 border-b flex items-center justify-between">
        {/* 見出しを中央に */}
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
          卓状況
        </h2>
        {/* 左端: 初回 */}
        <button
          onClick={() => setFilter('first')}
          className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${
            filter === 'first' ? 'font-bold text-black' : 'text-gray-700'
          }`}
        >
          初回
        </button>
        {/* 右端: 全卓・使用中・空卓 */}
        <div className="flex space-x-1">
          <button
            onClick={() => setFilter('all')}
            className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${
              filter === 'all' ? 'font-bold text-black' : 'text-gray-700'
            }`}
          >
            全卓
          </button>
          <button
            onClick={() => setFilter('occupied')}
            className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${
              filter === 'occupied' ? 'font-bold text-black' : 'text-gray-700'
            }`}
          >
            使用中
          </button>
          <button
            onClick={() => setFilter('empty')}
            className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${
              filter === 'empty' ? 'font-bold text-black' : 'text-gray-700'
            }`}
          >
            空卓
          </button>
        </div>
      </header>

      {/* テーブルグリッド（3列） */}
      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">
        {renderedTables}
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
                {/* 既存フォーム部分 */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closeFirstModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
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
                {/* 既存フォーム部分 */}
                <div className="flex justify-end space-x-2">
                  {/* ... */}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* フッター */}
      <Footer
        currentUser={null}
        onOpenAddReservation={() => {}}
        onOpenFirst={openFirstModal}
      />
    </>
  );
}
