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
  const [firstInitial, setFirstInitial] = useState(true);
  const [firstDesignation, setFirstDesignation] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [step1, setStep1] = useState(true);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [overlayMsg, setOverlayMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('firstLabels');
    if (saved) setFirstLabels(JSON.parse(saved));
  }, []);

  const openModal = () => {
    setStartTime(new Date().toTimeString().slice(0,5));
    setStep1(true);
    setSelectedTable('');
    setSelectedCount(0);
    setNames([]);
    setPhotos([]);
    setFirstInitial(true);
    setFirstDesignation(false);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const next = () => {
    if (!selectedTable || selectedCount < 1) return;
    setNames(Array(selectedCount).fill(''));
    setPhotos(Array(selectedCount).fill('なし'));
    setStep1(false);
  };

  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t || !window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    setDeletingId(id);
    dispatch({ type: 'DELETE_TABLE', payload: id });
    setDeleteMsg(`卓 ${t.tableNumber} を削除しました`);
    setTimeout(() => setDeleteMsg(''), 1000);
  }, [dispatch, tables]);

  const confirm = () => {
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        id: Date.now(),
        tableNumber: selectedTable,
        princess: names.join('、'),
        budget: 0,
        time: startTime,
      },
    });
    const types: string[] = [];
    if (firstInitial) types.push('初回');
    if (firstDesignation) types.push('初回指名');
    const label = types.join('、');
    setFirstLabels(prev => {
      const next = { ...prev, [selectedTable]: label };
      localStorage.setItem('firstLabels', JSON.stringify(next));
      return next;
    });
    const entries = names.map((n,i) => {
      const pos = positionLabelsByCount[selectedCount][i] || '';
      const pname = n || 'お客様';
      return (pos ? `${pos}: ` : '') + pname;
    });
    setOverlayMsg(`卓【${selectedTable}】に着席：${entries.join('、')}`);
    setTimeout(() => setOverlayMsg(''), 1000);
    closeModal();
  };

  const filtered = useMemo(() => {
    const empty = tableSettings
      .filter(num => !tables.some(t => t.tableNumber === num))
      .map(num => ({ id: Date.now()+parseInt(num), tableNumber: num, princess:'', budget:0, time:'' }));
    if (filter === 'occupied') return tables;
    if (filter === 'first') return tables.filter(t => firstLabels[t.tableNumber]);
    if (filter === 'empty') return empty;
    return [...tables, ...empty];
  }, [filter, tables, tableSettings, firstLabels]);

  const rendered = filtered.map((table,idx) => (
    <div key={idx} className="relative border rounded p-4 shadow bg-white flex flex-col justify-between">
      {table.princess && (
        <button onClick={() => handleDelete(table.id)} disabled={deletingId===table.id}
          className={`absolute top-1 right-1 text-sm hover:underline ${deletingId===table.id?'text-gray-400':'text-red-500'}`}
        >{deletingId===table.id?'削除中...':'削除'}</button>
      )}
      <p className="text-center font-bold">
        {table.tableNumber}{firstLabels[table.tableNumber] && ` (${firstLabels[table.tableNumber]})`}
      </p>
      {table.princess ? <>
        <p className="text-sm mt-2"><strong>姫名:</strong> {table.princess}</p>
        <p className="text-sm"><strong>開始:</strong> {table.time}</p>
      </> : <p className="text-sm mt-4 text-gray-400 text-center">空卓</p>}
    </div>
  ));

  return (
    <>
      {deleteMsg && <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-black bg-opacity-75 text-white p-4 rounded">{deleteMsg}</div>
      </div>}
      {overlayMsg && <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-black bg-opacity-75 text-white p-4 rounded">{overlayMsg}</div>
      </div>}

      <header className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline">
        <button onClick={()=>setFilter('first')} className={`text-xs px-1 rounded-full ${filter==='first'?'font-bold':''}`}>初回</button>
        <h2 className="text-xl font-bold">卓状況</h2>
        <div className="flex space-x-2">
          <button onClick={()=>setFilter('all')} className={`text-xs px-1 rounded-full ${filter==='all'?'font-bold':''}`}>全卓</button>
          <button onClick={()=>setFilter('occupied')} className={`text-xs px-1 rounded-full ${filter==='occupied'?'font-bold':''}`}>使用中</button>
          <button onClick={()=>setFilter('empty')} className={`text-xs px-1 rounded-full ${filter==='empty'?'font-bold':''}`}>空卓</button>
        </div>
      </header>

      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">
        {rendered}
      </main>

      <Footer currentUser={null} onOpenAddReservation={()=>{}} onOpenFirst={openModal} />
    </>
  );
}
