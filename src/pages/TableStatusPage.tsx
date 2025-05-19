// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppContext, Table } from '../context/AppContext';

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
  const { state: { tables, tableSettings }, dispatch } = useAppContext();
  const [filter, setFilter] = useState<Filter>('all');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // 初回ラベルを localStorage から取得
  const firstLabels = useMemo<Record<string, string>>(() => {
    const raw = localStorage.getItem('firstLabels');
    return raw ? JSON.parse(raw) : {};
  }, [tables, tableSettings]);

  // テーブル削除
  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    dispatch({ type: 'DELETE_TABLE', payload: id });
    const saved = JSON.parse(localStorage.getItem('firstLabels') || '{}') as Record<string, string>;
    delete saved[t.tableNumber];
    localStorage.setItem('firstLabels', JSON.stringify(saved));
    setDeleteMessage(`卓 ${t.tableNumber} を削除しました`);
  }, [dispatch, tables]);

  // メッセージ自動消去
  useEffect(() => {
    if (!deleteMessage) return;
    const h = setTimeout(() => setDeleteMessage(''), 1000);
    return () => clearTimeout(h);
  }, [deleteMessage]);

  // フィルタリング
  const filteredTables: Table[] = useMemo(() => {
    switch (filter) {
      case 'occupied':
        return tables;
      case 'first':
        return tables.filter(t => firstLabels[t.tableNumber] !== undefined);
      case 'empty':
        return tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({ id: Date.now() + Number(n), tableNumber: n, princess: '', budget: 0, time: '' } as Table));
      case 'all':
      default:
        const empty = tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({ id: Date.now() + Number(n), tableNumber: n, princess: '', budget: 0, time: '' } as Table));
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  // 詳細モーダル制御
  const openDetailModal = useCallback((table: Table) => {
    setSelectedTable(table);
    setDetailModalOpen(true);
  }, []);
  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedTable(null);
  }, []);

  // カード描画
  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => {
      const isInitial = firstLabels[table.tableNumber] === '初回';
      return (
        <div
          key={idx}
          className="border rounded shadow-sm overflow-hidden flex flex-col cursor-pointer"
          onClick={() => openDetailModal(table)}
        >
          {/* ヘッダー部 */}
          <div className="bg-gray-200 px-2 py-1 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-bold">{table.tableNumber}</span>
              {isInitial ? (
                <span className="text-xs">🔰</span>
              ) : firstLabels[table.tableNumber] ? (
                <span className="px-0.5 py-0.5 bg-gray-300 rounded-full text-sm">
                  {firstLabels[table.tableNumber]}
                </span>
              ) : null}
            </div>
            {table.princess && (
              <button
                onClick={e => { e.stopPropagation(); handleDelete(table.id); }}
                className="text-red-500 hover:text-red-700"
              >
                🗑
              </button>
            )}
          </div>

          {/* 詳細部 */}
<div className="p-2 flex-grow grid grid-cols-[6ch_1fr] gap-x-2 gap-y-1">
  {table.princess ? (
    <>
      <span className="text-[12px] font-semibold">姫名:</span>
      <span className="text-[12px]">{table.princess}</span>

      {isInitial && table.initialDetails?.map((d, i) => (
        <React.Fragment key={i}>
          <span className="text-sm font-semibold">
            {d.type === '初回' ? '写真指名:' : '初回指名:'}
          </span>
          <span className="text-sm">
            {d.photo === 'なし' ? '指名なし' : d.photo}
          </span>
        </React.Fragment>
      ))}

      <span className="text-sm font-semibold">開始:</span>
      <span className="text-sm">{table.time.slice(0,5)}</span>

      {!isInitial && (
        <>
          <span className="text-sm font-semibold">予算:</span>
          <span className="text-sm">
            {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}
          </span>
        </>
      )}
    </>
  ) : (
    <p className="text-sm mt-1 text-gray-400 text-center">空卓</p>
  )}
</div>

        </div>
      );
    }),
    [filteredTables, firstLabels, handleDelete, openDetailModal, selectedTable]
  );

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

      {/* フィルター部 */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto px-2 py-3 grid grid-cols-[1fr_auto_1fr] items-baseline">
          <button
            onClick={() => setFilter('first')}
            className={`justify-self-start bg-gray-100 rounded-full px-1 py-0.5 text-xs ${
              filter === 'first' ? 'font-bold text-black' : 'text-gray-700'
            }`}
          >
            初回
          </button>
          <h2 className="justify-self-center text-2xl font-bold">卓状況</h2>
          <div className="flex space-x-1 justify-self-end">
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
        </div>
      </header>

      {/* 本文部 */}
      <main id="main-content" className="overflow-x-hidden container mx-auto px-1.5 py-2 grid grid-cols-3 gap-3">
        {renderedTables}
      </main>

      {/* 詳細モーダル */}
      {detailModalOpen && selectedTable && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4">
          <div className="bg-white w-full h-full max-w-lg rounded shadow-lg overflow-auto relative">
            <button
              onClick={closeDetailModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            >
              &times;
            </button>
            {/* 詳細備考は後で実装 */}
          </div>
        </div>
      )}
    </>
  );
}
