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

  const firstLabels = useMemo<Record<string, string>>(() => {
    const raw = localStorage.getItem('firstLabels');
    return raw ? JSON.parse(raw) : {};
  }, [tables, tableSettings]);

  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    dispatch({ type: 'DELETE_TABLE', payload: id });
    const saved = JSON.parse(localStorage.getItem('firstLabels') || '{}') as Record<string, string>;
    delete saved[t.tableNumber];
    localStorage.setItem('firstLabels', JSON.stringify(saved));
  }, [dispatch, tables]);

  const [filter, setFilter] = useState<Filter>('all');
  const [deleteMessage, setDeleteMessage] = useState('');
  useEffect(() => {
    if (!deleteMessage) return;
    const h = setTimeout(() => setDeleteMessage(''), 1000);
    return () => clearTimeout(h);
  }, [deleteMessage]);

  const filteredTables: Table[] = useMemo(() => {
    switch (filter) {
      case 'occupied':
        return tables;
      case 'first':
        return tables.filter(t => firstLabels[t.tableNumber] !== undefined);
      case 'empty':
        return tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({
            id: Date.now() + Number(n),
            tableNumber: n,
            princess: '',
            budget: 0,
            time: '',
          } as Table));
      case 'all':
      default:
        const empty = tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({
            id: Date.now() + Number(n),
            tableNumber: n,
            princess: '',
            budget: 0,
            time: '',
          } as Table));
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => (
      <div
        key={idx}
        className="border rounded p-2 shadow-sm bg-white flex flex-col justify-between"
      >
        {/* ヘッダー部：番号・初回ラベル・削除ボタン */}
        <div className="flex items-center justify-between w-full mb-1">
          <span className="text-lg font-bold">{table.tableNumber}</span>
          {firstLabels[table.tableNumber] && (
            <span className="px-0.5 py-0.5 bg-gray-200 rounded-full text-sm">
              {firstLabels[table.tableNumber]}
            </span>
          )}
          {table.princess && (
            <button
              onClick={() => {
                setDeleteMessage(`卓 ${table.tableNumber} を削除しました`);
                handleDelete(table.id);
              }}
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
            <p className="text-sm"><strong>開始:</strong> {table.time.slice(0, 5)}</p>
            <p className="text-sm"><strong>予算:</strong> {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}</p>
          </>
        ) : (
          <p className="text-sm mt-1 text-gray-400 text-center">空卓</p>
        )}
      </div>
    )),
    [filteredTables, handleDelete, firstLabels]
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

      {/* 新たに scrollable container を設定 */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <header className="sticky top-0 z-50 bg-white border-b w-full">
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

        <main
          id="main-content"
          className="container mx-auto px-2 py-2 grid grid-cols-3 gap-2"
        >
          {renderedTables}
        </main>
      </div>
    </>
  );
}
