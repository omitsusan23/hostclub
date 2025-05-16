// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppContext, Table } from '../context/AppContext';
import Footer from '../components/Footer';

type Filter = 'all' | 'occupied' | 'empty' | 'first';

// 位置ラベル定義（未変更）
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

  // localStorage から初回ラベル取得
  const firstLabels = useMemo<Record<string,string>>(() => {
    const raw = localStorage.getItem('firstLabels');
    return raw ? JSON.parse(raw) : {};
  }, [tables, tableSettings]);

  // テーブル削除時に初回ラベルも消去
  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    dispatch({ type: 'DELETE_TABLE', payload: id });
    const saved = JSON.parse(localStorage.getItem('firstLabels') || '{}') as Record<string,string>;
    delete saved[t.tableNumber];
    localStorage.setItem('firstLabels', JSON.stringify(saved));
  }, [dispatch, tables]);

  // フィルター状態
  const [filter, setFilter] = useState<Filter>('all');
  const filteredTables: Table[] = useMemo(() => {
    switch (filter) {
      case 'occupied': return tables;
      case 'first':    return tables.filter(t => firstLabels[t.tableNumber] !== undefined);
      case 'empty':    return tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({ id: Date.now()+Number(n), tableNumber: n, princess: '', budget: 0, time: '' } as Table));
      case 'all':
      default:         return [
        ...tables,
        ...tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({ id: Date.now()+Number(n), tableNumber: n, princess: '', budget: 0, time: '' } as Table))
      ];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  // 削除通知メッセージ
  const [deleteMessage, setDeleteMessage] = useState('');
  useEffect(() => {
    if (deleteMessage) {
      const h = setTimeout(() => setDeleteMessage(''), 1000);
      return () => clearTimeout(h);
    }
  }, [deleteMessage]);

  return (
    <>
      {/* 固定ヘッダー（変更なし） */}
      <header className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline">
        <button
          onClick={() => setFilter('first')}
          className={`justify-self-start bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter==='first'?'font-bold text-black':'text-gray-700'}`}>
          初回
        </button>
        <h2 className="justify-self-center text-2xl font-bold">卓状況</h2>
        <div className="flex space-x-1 justify-self-end">
          <button onClick={() => setFilter('all')}    className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter==='all'?'font-bold text-black':'text-gray-700'}`}>全卓</button>
          <button onClick={() => setFilter('occupied')}className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter==='occupied'?'font-bold text-black':'text-gray-700'}`}>使用中</button>
          <button onClick={() => setFilter('empty')}   className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter==='empty'?'font-bold text-black':'text-gray-700'}`}>空卓</button>
        </div>
      </header>

      {/* 削除通知 */}
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">{deleteMessage}</div>
        </div>
      )}

      {/* レスポンシブグリッド */}
      <main id="main-content" className="p-2 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTables.map(table => (
          <div
            key={table.id}
            className={`${table.princess ? 'bg-yellow-500' : 'bg-gray-800'} text-white rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[200px]`}
          >
            {/* カードヘッダー */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xl font-bold">{table.tableNumber}</span>
              {firstLabels[table.tableNumber] && (
                <span className="ml-2 bg-yellow-300 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {firstLabels[table.tableNumber]}
                </span>
              )}
              {tables.some(t => t.id === table.id) && (
                <button
                  onClick={() => handleDelete(table.id)}
                  className="text-white text-lg ml-2"
                >
                  🗑
                </button>
              )}
            </div>
            {/* カードボディ */}
            <div className="flex-1 px-3 py-2 space-y-1 text-sm">
              {table.princess ? (
                <>                
                  <div className="flex items-center">
                    <span className="mr-2">⭐</span>
                    <span>姫名: {table.princess}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏰</span>
                    <span>開始: {table.time.slice(0,5)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">💰</span>
                    <span>予算: {table.budget===0?'未定':`${table.budget.toLocaleString()}円`}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400">空卓</div>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* フッター */}
      <Footer
        currentUser={null}
        onOpenAddReservation={() => {} }
        onOpenFirst={() => {} }
      />
    </>
  );
}
