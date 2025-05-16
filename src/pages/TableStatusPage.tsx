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
  const { state: { tables, tableSettings }, dispatch } = useAppContext();

  const [firstLabels, setFirstLabels] = useState<Record<string, string>>({});
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [step1, setStep1] = useState(true);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [firstStartTime, setFirstStartTime] = useState('');
  const [firstInitial, setFirstInitial] = useState<boolean>(true);
  const [firstDesignation, setFirstDesignation] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [overlayMessage, setOverlayMessage] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Load stored labels
  useEffect(() => {
    const saved = localStorage.getItem('firstLabels');
    if (saved) {
      try { setFirstLabels(JSON.parse(saved)); }
      catch { /* ignore malformed */ }
    }
  }, []);

  const openFirstModal = () => {
    const now = new Date();
    setFirstStartTime(now.toTimeString().slice(0,5));
    setStep1(true);
    setSelectedTable('');
    setSelectedCount(0);
    setNames([]);
    setPhotos([]);
    setFirstInitial(true);
    setFirstDesignation(false);
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
    // Prepare selected types
    const selectedTypes: string[] = [];
    if (firstInitial) selectedTypes.push('初回');
    if (firstDesignation) selectedTypes.push('初回指名');

    // 1) Assign table
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        id: Date.now(),
        tableNumber: selectedTable,
        princess: names.join('、'),
        budget: 0,
        time: firstStartTime,
      },
    });

    // 2) Update labels
    setFirstLabels(prev => {
      const labelString = selectedTypes.join('、');
      if (prev[selectedTable] === labelString) return prev;
      const next = { ...prev, [selectedTable]: labelString };
      localStorage.setItem('firstLabels', JSON.stringify(next));
      return next;
    });

    setOverlayMessage(`卓【${selectedTable}】に着席：${names.join('、')}`);
    setTimeout(() => setOverlayMessage(''), 1000);

    closeFirstModal();
  };

  // Filtering logic
  const filteredTables: Table[] = useMemo(() => {
    switch (filter) {
      case 'occupied':
        return tables;
      case 'first':
        return tables.filter(t => firstLabels[t.tableNumber] !== undefined);
      case 'empty':
        return tableSettings.filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({ id: Date.now() + num.length, tableNumber: num, princess: '', budget: 0, time: '' }));
      case 'all':
      default:
        const empty = tableSettings.filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({ id: Date.now() + num.length, tableNumber: num, princess: '', budget: 0, time: '' }));
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  // Table rendering in renderTables (unchanged)
  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => (
      <div key={idx} className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between">
        {/* Delete button */}
        {table.princess && (
          <button
            onClick={() => handleDelete(table.id)}
            disabled={deletingId === table.id}
            className={`absolute top-1 right-1 text-sm hover:underline ${deletingId === table.id ? 'text-gray-400' : 'text-red-500'}`}
            aria-label={`卓 ${table.tableNumber} を削除`}
          >
            {deletingId === table.id ? '削除中...' : '削除'}
          </button>
        )}

        {/* Table number + labels */}
        <p className="text-center font-bold">
          {table.tableNumber}
          {firstLabels[table.tableNumber] && ` (${firstLabels[table.tableNumber]})`}
        </p>

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
    )),
    [filteredTables, handleDelete, deletingId, firstLabels]
  );

  return (
    <>
      {/* Header, filters, and renderedTables */}
      <header className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline">
        <button onClick={() => setFilter('all')} className={`text-xs px-1 rounded-full ${filter==='all'?'font-bold':''}`}>All</button>
        <div className="flex space-x-2">
          <button onClick={() => setFilter('occupied')} className={`text-xs px-1 rounded-full ${filter==='occupied'?'font-bold':''}`}>使用中</button>
          <button onClick={() => setFilter('first')} className={`text-xs px-1 rounded-full ${filter==='first'?'font-bold':''}`}>初回</button>
          <button onClick={() => setFilter('empty')} className={`text-xs px-1 rounded-full ${filter==='empty'?'font-bold':''}`}>空卓</button>
        </div>
      </header>

      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">
        {renderedTables}
      </main>

      {/* First-time visit modal */}
      {firstModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {step1 ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">初回来店：卓と人数を選択</h3>

                {/* 初回と初回指名の複数選択チェックボックス */}
                <div className="mb-4 flex items-center space-x-4 justify-center">
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={firstInitial}
                      onChange={() => {
                        const newVal = !firstInitial;
                        if (!newVal && !firstDesignation) return;
                        setFirstInitial(newVal);
                      }}
                    />
                    <span className="text-sm">初回</span>
                  </label>
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={firstDesignation}
                      onChange={() => {
                        const newVal = !firstDesignation;
                        if (!newVal && !firstInitial) return;
                        setFirstDesignation(newVal);
                      }}
                    />
                    <span className="text-sm">初回指名</span>
                  </label>
                </div>

                <label className="block text-sm mb-2">卓を選択</label>
                <select value={selectedTable} onChange={e => setSelectedTable(e.target.value)} className="border p-2 w-full rounded mb-4">
                  <option value="">選択してください</option>
                  {tableSettings.map(t =>
                    tables.some(tab => tab.tableNumber === t)
                      ? <option key={t} value={t} disabled>{t}（使用中）</option>
                      : <option key={t} value={t}>{t}</option>
                  )}
                </select>

                <label className="block text-sm mb-2">人数を選択</label>
                <select value={selectedCount} onChange={e => setSelectedCount(Number(e.target.value))} className="border p-2 w-full rounded mb-4">

