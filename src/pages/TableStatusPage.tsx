/ src/pages/TableStatusPage.tsx
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

  // 保存されたラベル
  const [firstLabels, setFirstLabels] = useState<Record<string, string>>({});

  // localStorage→state: テーブル設定にないキーを除外して読み込み
  const loadLabels = () => {
    const saved = localStorage.getItem('firstLabels');
    if (saved) {
      try {
        const obj = JSON.parse(saved) as Record<string,string>;
        const filtered: Record<string,string> = {};
        Object.entries(obj).forEach(([key, val]) => {
          if (tableSettings.includes(key)) filtered[key] = val;
        });
        setFirstLabels(filtered);
        // 存在しないキーはローカルストレージからも削除
        localStorage.setItem('firstLabels', JSON.stringify(filtered));
      } catch {}
    }
  };
  useEffect(loadLabels, [tableSettings]);
  useEffect(() => {
    window.addEventListener('firstLabelsUpdated', loadLabels);
    return () => window.removeEventListener('firstLabelsUpdated', loadLabels);
  }, [tableSettings]);

  // ページフィルター
  const [filter, setFilter] = useState<Filter>('all');
  const [overlayMessage, setOverlayMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 初回来店モーダル
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [step1, setStep1]                   = useState(true);
  const [selectedTable, setSelectedTable]   = useState('');
  const [selectedCount, setSelectedCount]   = useState(0);
  const [names, setNames]                   = useState<string[]>([]);
  const [photos, setPhotos]                 = useState<string[]>([]);
  const [firstTypes, setFirstTypes]         = useState<string[]>([]);
  const [firstPhotos, setFirstPhotos]       = useState<string[]>([]);
  const [firstStartTime, setFirstStartTime] = useState('');

  const openFirstModal = () => {
    const now = new Date();
    setFirstStartTime(now.toTimeString().slice(0,5));
    setStep1(true);
    setSelectedTable('');
    setSelectedCount(0);
    setNames([]);
    setPhotos([]);
    setFirstTypes([]);
    setFirstPhotos([]);
    setFirstModalOpen(true);
  };
  const closeFirstModal = () => setFirstModalOpen(false);

  const nextStep = () => {
    if (!selectedTable || selectedCount < 1) return;
    setNames(Array(selectedCount).fill(''));
    setPhotos(Array(selectedCount).fill('なし'));
    setFirstTypes(Array(selectedCount).fill('初回'));
    setFirstPhotos(Array(selectedCount).fill(''));
    setStep1(false);
  };

  const confirmFirst = () => {
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        id: Date.now(),
        tableNumber: selectedTable,
        princess: names.join('、'),
        budget: 0,
        time: firstStartTime,
        firstType: Array.from(new Set(firstTypes)).join('/'),
      },
    });
    const saved = JSON.parse(localStorage.getItem('firstLabels') || '{}');
    saved[selectedTable] = Array.from(new Set(firstTypes)).join('/');
    localStorage.setItem('firstLabels', JSON.stringify(saved));
    window.dispatchEvent(new Event('firstLabelsUpdated'));
    closeFirstModal();
  };

  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    dispatch({ type: 'DELETE_TABLE', payload: id });
    // 削除時にもラベルを除外
    setFirstLabels(prev => {
      const next = { ...prev };
      delete next[t.tableNumber];
      localStorage.setItem('firstLabels', JSON.stringify(next));
      window.dispatchEvent(new Event('firstLabelsUpdated'));
      return next;
    });
    setDeletingId(id);
    setDeleteMessage(`卓 ${t.tableNumber} を削除しました`);
    setTimeout(() => setDeleteMessage(''), 1000);
  }, [dispatch, tables]);

  // フィルタリング
  const filteredTables: Table[] = useMemo(() => {
    switch (filter) {
      case 'occupied':   return tables;
      case 'first':      return tables.filter(t => firstLabels[t.tableNumber] !== undefined);
      case 'empty':
        return tableSettings
          .filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({ id: Date.now() + Number(num), tableNumber: num, princess: '', budget: 0, time: '' } as Table));
      case 'all':
      default:
        const empty = tableSettings
          .filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({ id: Date.now() + Number(num), tableNumber: num, princess: '', budget: 0, time: '' } as Table));
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  // テーブル描画
  const renderedTables = filteredTables.map((table, idx) => (
    <div key={idx} className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between">
      {table.princess && (
        <button
          onClick={() => handleDelete(table.id)}
          disabled={deletingId === table.id}
          className={`absolute top-1 right-1 text-sm hover:underline ${deletingId === table.id ? 'text-gray-400' : 'text-red-500'}`}
        >
          {deletingId === table.id ? '削除中...' : '削除'}
        </button>
      )}
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
  ));

  return (
    <>
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">{deleteMessage}</div>
        </div>
      )}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded max-w-md text-center">{overlayMessage}</div>
        </div>
      )}
      <header className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline">
        <button onClick={() => setFilter('first')} className={`justify-self-start bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter === 'first' ? 'font-bold text-black' : 'text-gray-700'}`}>初回</button>
        <h2 className="justify-self-center text-2xl font-bold">卓状況</h2>
        <div className="flex space-x-1 justify-self-end">
          <button onClick={() => setFilter('all')} className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter === 'all' ? 'font-bold text-black' : 'text-gray-700'}`}>全卓</button>
          <button onClick={() => setFilter('occupied')} className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter === 'occupied' ? 'font-bold text-black' : 'text-gray-700'}`}>使用中</button>
          <button onClick={() => setFilter('empty')} className={`bg-gray-100 rounded-full px-1 py-0.5 text-xs ${filter === 'empty' ? 'font-bold text-black' : 'text-gray-700'}`}>空卓</button>
        </div>
      </header>
      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">
        {renderedTables}
      </main>

      {/* 初回来店モーダル（以下AppInnerと同じ） */}
      {firstModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">[…モーダル内容省略…]</div>
        </div>
      )}

      <Footer currentUser={null} onOpenAddReservation={() => {}} onOpenFirst={openFirstModal} />
    </>
  )
}
