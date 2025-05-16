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
  const { state: { tables, tableSettings, casts, currentUser }, dispatch } = useAppContext();

  // 初回ラベル管理
  const [firstLabels, setFirstLabels] = useState<Record<string, string>>({});
  const [firstType, setFirstType] = useState<'初回' | '初回指名'>('初回');

  // フィルター
  const [filter, setFilter] = useState<Filter>('all');

  // モーダル・オーバーレイ
  const [firstModalOpen, setFirstModalOpen] = useState(false);
  const [step1, setStep1] = useState(true);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCount, setSelectedCount] = useState(0);
  const [names, setNames] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [firstStartTime, setFirstStartTime] = useState('');
  const [overlayMessage, setOverlayMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // localStorage読み込み
  useEffect(() => {
    const saved = localStorage.getItem('firstLabels');
    if (saved) {
      try { setFirstLabels(JSON.parse(saved)); } catch {}
    }
  }, []);

  // モーダル制御
  const openFirstModal = () => {
    setFirstStartTime(new Date().toTimeString().slice(0,5));
    setStep1(true);
    setSelectedTable('');
    setSelectedCount(0);
    setNames([]);
    setPhotos([]);
    setFirstType('初回');
    setFirstModalOpen(true);
  };
  const closeFirstModal = () => setFirstModalOpen(false);
  const nextStep = () => {
    if (!selectedTable || selectedCount < 1) return;
    setNames(Array(selectedCount).fill(''));
    setPhotos(Array(selectedCount).fill('なし'));
    setStep1(false);
  };

  // 卓削除
  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t || !window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    setDeletingId(id);
    dispatch({ type: 'DELETE_TABLE', payload: id });
    setDeleteMessage(`卓 ${t.tableNumber} を削除しました`);
    setTimeout(() => setDeleteMessage(''), 1000);
  }, [dispatch, tables]);

  // 初回来店確定
  const confirmFirst = () => {
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: { id: Date.now(), tableNumber: selectedTable, princess: names.join('、'), budget: 0, time: firstStartTime }
    });
    // ラベル更新
    const types: string[] = [];
    if (firstType === '初回') types.push('初回');
    if (firstType === '初回指名') types.push('初回指名');
    const label = types.join('、');
    setFirstLabels(prev => {
      const next = { ...prev, [selectedTable]: label };
      localStorage.setItem('firstLabels', JSON.stringify(next));
      return next;
    });
    // オーバーレイ
    const entries = names.map((n,i) => {
      const pos = positionLabelsByCount[selectedCount][i] || '';
      return (pos ? `${pos}: ` : '') + (n || 'お客様');
    });
    setOverlayMessage(`卓【${selectedTable}】に着席：${entries.join('、')}`);
    setTimeout(() => setOverlayMessage(''), 1000);
    closeFirstModal();
  };

  // フィルタリング
  const filteredTables: Table[] = useMemo(() => {
    const empty = tableSettings
      .filter(num => !tables.some(t => t.tableNumber === num))
      .map(num => ({ id: Date.now()+parseInt(num), tableNumber: num, princess: '', budget:0, time: '' }));
    if (filter==='occupied') return tables;
    if (filter==='first') return tables.filter(t=> firstLabels[t.tableNumber]);
    if (filter==='empty') return empty;
    return [...tables, ...empty];
  }, [filter, tables, tableSettings, firstLabels]);

  // 描画
  return (
    <>
      {/* 削除通知 */}
      {deleteMessage && <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-black bg-opacity-75 text-white p-4 rounded">{deleteMessage}</div>
      </div>}
      {/* オーバーレイ */}
      {overlayMessage && <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-black bg-opacity-75 text-white p-4 rounded max-w-md text-center">{overlayMessage}</div>
      </div>}

      {/* ヘッダーは未変更 */}
      <header className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline">
        <button onClick={()=>setFilter('first')} className={`text-xs px-1 rounded-full ${filter==='first'?'font-bold':''}`}>初回</button>
        <h2 className="text-2xl font-bold">卓状況</h2>
        <div className="flex space-x-2">
          <button onClick={()=>setFilter('all')} className={`text-xs px-1 rounded-full ${filter==='all'?'font-bold':''}`}>全卓</button>
          <button onClick={()=>setFilter('occupied')} className={`text-xs px-1 rounded-full ${filter==='occupied'?'font-bold':''}`}>使用中</button>
          <button onClick={()=>setFilter('empty')} className={`text-xs px-1 rounded-full ${filter==='empty'?'font-bold':''}`}>空卓</button>
        </div>
      </header>

      {/* グリッド */}
      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">
        {filteredTables.map((table, idx) => (
          <div key={idx} className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between">
            {table.princess && (
              <button onClick={()=>handleDelete(table.id)} disabled={deletingId===table.id}
                className={`absolute top-1 right-1 text-sm hover:underline ${deletingId===table.id?'text-gray-400':'text-red-500'}`}
              >{deletingId===table.id?'削除中...':'削除'}</button>
            )}
            <p className="text-center font-bold">
              {table.tableNumber}{firstLabels[table.tableNumber] && ` (${firstLabels[table.tableNumber]})`}
            </p>
            {table.princess ? (
              <> <p className="text-sm mt-2"><strong>姫名:</strong> {table.princess}</p>
                   <p className="text-sm"><strong>開始:</strong> {table.time.slice(0,5)}</p> </>
            ) : (
              <p className="text-sm mt-4 text-gray-400 text-center">空卓</p>
            )}
          </div>
        ))}
      </main>

      {/* 初回来店モーダル */}
      {firstModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {/* モーダルUI は TableStatusPage.tsx で定義 */}
            {/* ... */}
          </div>
        </div>
      )}

      <Footer
        currentUser={currentUser}
        onOpenAddReservation={()=>{}}
        onOpenFirst={openFirstModal}
      />
    </>
  );
}