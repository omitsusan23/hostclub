// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppContext, Table } from '../context/AppContext';
import Footer from '../components/Footer';

type Filter = 'all' | 'occupied' | 'empty' | 'first';

export default function TableStatusPage() {
  const { state: { tables, tableSettings, casts }, dispatch } = useAppContext();

  // 初回ラベル取得
  const firstLabels = useMemo(() => {
    const raw = localStorage.getItem('firstLabels');
    return raw ? JSON.parse(raw) : {};
  }, [tables, tableSettings]);

  // テーブル削除
  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    dispatch({ type: 'DELETE_TABLE', payload: id });
    const saved = JSON.parse(localStorage.getItem('firstLabels') || '{}');
    delete saved[t.tableNumber];
    localStorage.setItem('firstLabels', JSON.stringify(saved));
  }, [dispatch, tables]);

  // フィルター
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = useMemo(() => {
    switch(filter) {
      case 'occupied': return tables;
      case 'first': return tables.filter(t => firstLabels[t.tableNumber]);
      case 'empty':
        return tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({ id: Date.now()+Number(n), tableNumber: n, princess: '', budget:0, time:'' } as Table));
      case 'all':
      default:
        return [
          ...tables,
          ...tableSettings
            .filter(n => !tables.some(t => t.tableNumber === n))
            .map(n => ({ id: Date.now()+Number(n), tableNumber:n, princess:'', budget:0, time:'' } as Table))
        ];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  // 削除メッセージ
  const [delMsg, setDelMsg] = useState('');
  useEffect(() => {
    if (delMsg) {
      const h = setTimeout(() => setDelMsg(''), 1000);
      return () => clearTimeout(h);
    }
  }, [delMsg]);

  return (
    <>
      {/* フィルター＆ヘッダー */}
      <header className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline">
        <button
          onClick={() => setFilter('first')}
          className={`justify-self-start bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter==='first'?'font-bold text-black':'text-gray-700'}`}
        >初回</button>
        <h2 className="justify-self-center text-2xl font-bold">卓状況</h2>
        <div className="flex space-x-1 justify-self-end">
          <button onClick={() => setFilter('all')} className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter==='all'?'font-bold text-black':'text-gray-700'}`}>全卓</button>
          <button onClick={() => setFilter('occupied')} className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter==='occupied'?'font-bold text-black':'text-gray-700'}`}>使用中</button>
          <button onClick={() => setFilter('empty')} className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter==='empty'?'font-bold text-black':'text-gray-700'}`}>空卓</button>
        </div>
      </header>

      {/* 削除メッセージ */}
      {delMsg && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">{delMsg}</div>
        </div>
      )}

      {/* テーブルグリッド */}
      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">
        {filtered.map(table => (
          <div key={table.id} className="relative rounded-lg overflow-hidden bg-white shadow-lg">
            {/* ヘッダー表示部分 */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500">
              <span className="text-xl font-bold">{table.tableNumber}</span>
              {firstLabels[table.tableNumber] && (
                <span className="text-xs bg-yellow-200 bg-opacity-60 rounded-full px-2 py-0.5">{firstLabels[table.tableNumber]}</span>
              )}
              {table.princess && (
                <button
                  onClick={() => { setDelMsg(`卓 ${table.tableNumber} を削除しました`); handleDelete(table.id); }}
                  className="text-lg text-white"
                >🗑</button>
              )}
            </div>
          </div>
        ))}
      </main>

      <Footer currentUser={null} onOpenAddReservation={() => {}} onOpenFirst={() => {}} />
    </>
  );
}
