// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext, Table } from '../context/AppContext';
import Footer from '../components/Footer';

type Filter = 'all' | 'occupied' | 'empty' | 'first';

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

  // フィルタリング state
  const [filter, setFilter] = useState<Filter>('all');

  // モーダル等既存 state
  const [overlayMessage, setOverlayMessage] = useState('');
  const [deleteMessage, setDeleteMessage]   = useState('');
  const [deletingId, setDeletingId]         = useState<number | null>(null);
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [step1,         setStep1]           = useState(true);
  const [selectedTable, setSelectedTable]   = useState('');
  const [selectedCount, setSelectedCount]   = useState(0);
  const [names,         setNames]           = useState<string[]>([]);
  const [photos,        setPhotos]          = useState<string[]>([]);
  const [firstStartTime, setFirstStartTime] = useState('');

  const openFirstModal = () => {
    const now  = new Date();
    const hhmm = now.toTimeString().slice(0,5);
    setFirstStartTime(hhmm);
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

  // フィルタ適用
  const filteredTables = useMemo(() => {
    switch (filter) {
      case 'occupied':
        return tables;
      case 'first':
        return tables.filter(t => t.budget === 0);
      case 'empty':
        return tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({ tableNumber: n, princess: '', budget: 0, time: '' }));
      case 'all':
      default:
        const empty = tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(n => ({ tableNumber: n, princess: '', budget: 0, time: '' }));
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings]);

  const renderedTables = useMemo(() => filteredTables.map((table, idx) => (
    <div
      key={`${table.tableNumber}-${idx}`}
      className="border rounded p-4 shadow-sm bg-white flex flex-col justify-between"
    >
      <p className="text-center font-bold">{table.tableNumber}</p>
      {table.princess ? (
        <>
          <p className="text-sm mt-2"><strong>姫名:</strong> {table.princess}</p>
          <p className="text-sm"><strong>開始:</strong> {table.time.slice(0,5)}</p>
          <p className="text-sm"><strong>予算:</strong> {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}</p>
        </>
      ) : (
        <p className="text-sm mt-4 text-gray-400 text-center">空卓</p>
      )}
    </div>
  )), [filteredTables, tables, filter, deletingId, handleDelete]);

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

      {/* 見出し */}
      <div className="px-4 pt-4">
        <h2 className="text-2xl font-bold text-center">卓状況</h2>
      </div>

      {/* フィルターバー */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 space-x-2">
        {(['all','occupied','empty','first'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded ${filter===f?'bg-blue-500 text-white':'bg-white text-gray-700'}`}
          >
            {{ all: '全卓', occupied: '使用中', empty: '空卓', first: '初回' }[f]}
          </button>
        ))}
      </div>

      {/* グリッド表示（常に3列） */}
      <main id="main-content" className="p-4 grid grid-cols-3 gap-4">
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

                <label className="block text-sm mb-2">開始時間</label>
                <input
                  type="time"
                  value={firstStartTime}
                  onChange={e => setFirstStartTime(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                />

                <label className="block text-sm mb-2">人数を選択</label>
                <select
                  value={selectedCount}
