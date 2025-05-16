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

  // ── 初回割り当てテーブルに付与するラベル
  const [firstLabels, setFirstLabels] = useState<Record<string, string>>({});
  // ── 初回タイプ選択
  const [firstInitial, setFirstInitial] = useState<boolean>(true);
  const [firstDesignation, setFirstDesignation] = useState<boolean>(false);

  // ── フィルター
  const [filter, setFilter] = useState<Filter>('all');

  // ── オーバーレイ／モーダル関連
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

  // ── localStorage から firstLabels を復元
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
    // 1) テーブル割り当て
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

    // 2) firstLabels に追加 & localStorage に保存
    const selectedTypes: string[] = [];
    if (firstInitial) selectedTypes.push('初回');
    if (firstDesignation) selectedTypes.push('初回指名');
    const labelString = selectedTypes.join('、') || '初回';
    setFirstLabels(prev => {
      if (prev[selectedTable] === labelString) return prev;
      const next = { ...prev, [selectedTable]: labelString };
      localStorage.setItem('firstLabels', JSON.stringify(next));
      return next;
    });

    // 3) オーバーレイ表示
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

  // ── フィルタリング
  const filteredTables: Table[] = useMemo(() => {
    switch (filter) {
      case 'occupied':
        return tables;
      case 'first':
        return tables.filter(t => firstLabels[t.tableNumber] !== undefined);
      case 'empty':
        return tableSettings
          .filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({ id: Date.now() + num.length, tableNumber: num, princess: '', budget: 0, time: '' }));
      case 'all':
      default:
        const empty = tableSettings
          .filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({ id: Date.now() + num.length, tableNumber: num, princess: '', budget: 0, time: '' }));
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  // ── テーブル描画
  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => (
      <div key={idx} className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between">
        {/* 削除ボタン */}
        {table.princess && (
          <button
            onClick={() => handleDelete(table.id)}
            disabled={deletingId === table.id}
            className={`absolute top-1 right-1 text-sm hover:underline ${deletingId===table.id?'text-gray-400':'text-red-500'}`}
            aria-label={`卓 ${table.tableNumber} を削除`}
          >
            {deletingId===table.id ? '削除中...' : '削除'}
          </button>
        )}

        {/* 卓番号 + ラベル */}
        <p className="text-center font-bold">
          {table.tableNumber}
          {firstLabels[table.tableNumber] && ` (${firstLabels[table.tableNumber]})`}
        </p>

        {table.princess ? (
          <>
            <p className="text-sm mt-2"><strong>姫名:</strong> {table.princess}</p>
            <p className="text-sm"><strong>開始:</strong> {table.time.slice(0,5)}</p>
            <p className="text-sm"><strong>予算:</strong> {table.budget===0?'未定':`${table.budget.toLocaleString()}円`}</p>
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
      {/* 削除メッセージ */}
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">{deleteMessage}</div>
        </div>
      )}

      {/* 着席オーバーレイ */}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">"")}]}
