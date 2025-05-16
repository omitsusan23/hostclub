// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
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

  // 初回ラベルを localStorage から取得（テーブル/設定変更ごとに再計算）
  const firstLabels = useMemo<Record<string,string>>(() => {
    const raw = localStorage.getItem('firstLabels');
    return raw ? JSON.parse(raw) : {};
  }, [tables, tableSettings]);

  // テーブル削除時に初回ラベルも消去
  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    dispatch({ type: 'DELETE_TABLE', payload: id });
    const saved = JSON.parse(localStorage.getItem('firstLabels') || '{}') as Record<string,string>;
    delete saved[t.tableNumber];
    localStorage.setItem('firstLabels', JSON.stringify(saved));
  }, [dispatch, tables]);

  // フィルタリング
  const [filter, setFilter] = useState<Filter>('all');
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

  // メッセージ
  const [deleteMessage, setDeleteMessage] = useState('');

  // 削除メッセージ表示
  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => setDeleteMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);

  return (
    <>
      {/* フィルター */}
      <header className="sticky top-0 z-50 bg-white px-4 py-3 flex justify-between items-center border-b">
        <h2 className="text-2xl font-bold">卓状況</h2>
        <div className="space-x-2">
          {(['all','occupied','empty','first'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === f ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {f === 'all' ? '全卓' : f === 'occupied' ? '使用中' : f === 'empty' ? '空卓' : '初回'}
            </button>
          ))}
        </div>
      </header>

      {/* 削除通知 */}
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">{deleteMessage}</div>
        </div>
      )}

      {/* テーブルグリッド */}
      <main id="main-content" className="p-4 grid grid-cols-3 gap-4">
        {filteredTables.map(table => (
          <div key={table.id} className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-4 py-2 bg-yellow-100">
              <span className="text-lg font-bold">{table.tableNumber}</span>
              {firstLabels[table.tableNumber] && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-300 text-yellow-800">
                  {firstLabels[table.tableNumber]}
                </span>
              )}
              {tables.some(t => t.id === table.id) && (
                <button
                  onClick={() => handleDelete(table.id)}
                  className="text-gray-600 hover:text-red-600"
                >
                  🗑
                </button>
              )}
            </div>
            {/* ボディ */}
            <div className="px-4 py-3 space-y-2">
              {table.princess ? (
                <>
                  <div className="flex items-center text-sm">
                    <span className="mr-2">⭐</span>
                    <span>姫名: {table.princess}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="mr-2">⏰</span>
                    <span>開始: {table.time.slice(0,5)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="mr-2">💰</span>
                    <span>予算: {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}</span>
                  </div>
                  {/* 他ラベルは省略 */}
                </>
              ) : (
                <div className="text-center text-gray-400">空卓</div>
              )}
            </div>
          </div>
        ))}
      </main>

      <Footer
        currentUser={null}
        onOpenAddReservation={() => {}}
        onOpenFirst={() => {}}
      />
    </>
  );
}
