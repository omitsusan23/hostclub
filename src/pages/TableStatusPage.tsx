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

  // フィルター状態
  const [filter, setFilter] = useState<Filter>('all');
  const [deleteMessage, setDeleteMessage] = useState('');
  useEffect(() => {
    if (!deleteMessage) return;
    const h = setTimeout(() => setDeleteMessage(''), 1000);
    return () => clearTimeout(h);
  }, [deleteMessage]);

  // テーブルリストのフィルタリング
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

  // テーブルカード描画
  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => (
      <div
        key={idx}
        className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between"
      >
        {/* ヘッダー部：番号・初回ラベル・削除ボタン */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-lg font-bold">{table.tableNumber}</span>
          {firstLabels[table.tableNumber] && (
            <span className="px-1 py-1 bg-gray-200 rounded-full text-sm">
              {firstLabels[table.tableNumber]}
            </span>
          )}
          {table.princess && (
            <button
              onClick={() => { setDeleteMessage(`卓 ${table.tableNumber} を削除しました`); handleDelete(table.id); }}
              className="text-red-500 hover:text-red-700"
            >
              🗑
            </button>
          )}
        </div>

        {/* 詳細表示 */}
        {table.princess ? (
          <>  
            <p className="text-sm"><strong>姫名:</strong> {table.princess}</p>
            <p className="text-sm"><strong>開始:</strong> {table.time.slice(0,5)}</p>
            <p className="text-sm"><strong>予算:</strong> {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}</p>
          </>
        ) : (
          <p className="text-sm mt-4 text-gray-400 text-center">空卓</p>
        )}
      </div>
    )), [filteredTables, handleDelete, firstLabels]
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

      <div className="relative left-1/2 ml-[-50vw] w-screen">
        {/* フィルター＆ヘッダー（横幅いっぱいに） */}
        <header
          className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline"
        >
          <button
            onClick={() => setFilter('first')}
            className={`justify-self-start bg-gray-100 rounded-full px-1 py-0.5 text-xs ${
              filter === 'first' ? 'font-bold text-black' : 'text-gray-700'
            }`}
          >
            初回
          </button>
          <h2 className="justify-self-center text-2xl font-bold">
            卓状況
          </h2>
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
        </header>

        {/* テーブルグリッド（全幅対応済み） */}
        <main
          id="main-content"
          className="px-4 py-4 grid grid-cols-3 gap-4"
        >
          {renderedTables}
        </main>
      </div>

      {/* フッター */}
      <Footer
        currentUser={null}
        onOpenAddReservation={() => {}}
        onOpenFirst={() => {}}
      />
    </>
  );
}
