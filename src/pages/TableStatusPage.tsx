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
  const { state: { tables, tableSettings, currentUser }, dispatch } = useAppContext();

  // 初回割り当て用ラベル
  const [firstLabels, setFirstLabels] = useState<Record<string, string>>({});
  const [firstInitial, setFirstInitial] = useState(true);
  const [firstDesignation, setFirstDesignation] = useState(false);

  // フィルター
  const [filter, setFilter] = useState<Filter>('all');

  // モーダル・オーバーレイ状態
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

  // ローカルからラベルを復元
  useEffect(() => {
    const saved = localStorage.getItem('firstLabels');
    if (saved) {
      try { setFirstLabels(JSON.parse(saved)); } catch {}
    }
  }, []);

  // 初回モーダル開閉
  const openFirstModal = () => {
    setFirstStartTime(new Date().toTimeString().slice(0,5));
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

  // 削除ハンドラ
  const handleDelete = useCallback((id: number) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    setDeletingId(id);
    dispatch({ type: 'DELETE_TABLE', payload: id });
    setDeleteMessage(`卓 ${t.tableNumber} を削除しました`);
    setTimeout(() => setDeleteMessage(''), 1000);
  }, [dispatch, tables]);

  // 初回確定
  const confirmFirst = () => {
    // 割り当て
    dispatch({
      type: 'ASSIGN_TABLE',
      payload: {
        id: Date.now(),
        princess: names.join('、'),
        requestedTable: selectedTable,
        budget: 0,
      },
    });
    // ラベル更新
    const types: string[] = [];
    if (firstInitial) types.push('初回');
    if (firstDesignation) types.push('初回指名');
    const labelString = types.join('、');
    setFirstLabels(prev => {
      if (prev[selectedTable] === labelString) return prev;
      const next = { ...prev, [selectedTable]: labelString };
      localStorage.setItem('firstLabels', JSON.stringify(next));
      return next;
    });
    // オーバーレイ
    const entries = names.map((n,i) => {
      const pos = positionLabelsByCount[selectedCount][i];
      const pname = n || 'お客様';
      const pcast = photos[i] !== 'なし' ? `（指名：${photos[i]}）` : '';
      return (pos ? `${pos}: ` : '') + `${pname}${pcast}`;
    });
    setOverlayMessage(`卓【${selectedTable}】に着席：${entries.join('、')}`);
    setTimeout(() => setOverlayMessage(''), 1000);
    closeFirstModal();
  };

  // フィルタリング
  const filteredTables = useMemo(() => {
    const empty = tableSettings
      .filter(num => !tables.some(t => t.tableNumber === num))
      .map(num => ({ id: Date.now()+num.length, tableNumber: num, princess: '', budget:0, time:'' }));
    if (filter === 'occupied') return tables;
    if (filter === 'first') return tables.filter(t => firstLabels[t.tableNumber]);
    if (filter === 'empty') return empty;
    return [...tables, ...empty];
  }, [filter, tables, tableSettings, firstLabels, selectedCount]);

  // 描画
  const rendered = useMemo(() => filteredTables.map((table, idx) => (
    <div key={idx} className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between">
      {table.princess && (
        <button onClick={() => handleDelete(table.id)} disabled={deletingId===table.id}
          className={`absolute top-1 right-1 text-sm hover:underline ${deletingId===table.id?'text-gray-400':'text-red-500'}`}
        >{deletingId===table.id?'削除中...':'削除'}</button>
      )}
      <p className="text-center font-bold">
        {table.tableNumber}{firstLabels[table.tableNumber] && ` (${firstLabels[table.tableNumber]})`}
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
  )), [filteredTables, handleDelete, deletingId, firstLabels]);

  return (
    <>
      {/* 削除通知 */}
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">{deleteMessage}</div>
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
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline">
        <button onClick={()=>setFilter('first')} className={`text-xs px-1 rounded-full ${filter==='first'?'font-bold':''}`}>初回</button>
        <h2 className="text-xl font-bold">卓状況</h2>
        <div className="flex space-x-2">
          <button onClick={()=>setFilter('all')} className={`text-xs px-1 rounded-full ${filter==='all'?'font-bold':''}`}>全卓</button>
          <button onClick={()=>setFilter('occupied')} className={`text-xs px-1 rounded-full ${filter==='occupied'?'font-bold':''}`}>使用中</button>
          <button onClick={()=>setFilter('empty')} className={`text-xs px-1 rounded-full ${filter==='empty'?'font-bold':''}`}>空卓</button>
        </div>
      </header>
      {/* テーブルグリッド */}
      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">{rendered}</main>
      {/* 初回来店モーダル */}
      {firstModalOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="mb-4 flex items-center space-x-4 justify-center">
              <label className="inline-flex items-center space-x-1">
                <input type="checkbox" checked={firstInitial} onChange={()=>{
                  const v=!firstInitial; if(!v&&!firstDesignation) return; setFirstInitial(v);
                }} />
                <span className="text-sm">初回</span>
              </label>
              <label className="inline-flex items-center space-x-1">
                <input type="checkbox" checked={firstDesignation} onChange={()=>{
                  const v=!firstDesignation; if(!v&&!firstInitial) return; setFirstDesignation(v);
                }} />
                <span className="text-sm">初回指名</span>
              </label>
            </div>
            {step1 ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">初回来店：卓と人数を選択</h3>
                <label className="block text-sm mb-2">卓を選択</label>
                <select value={selectedTable} onChange={e=>setSelectedTable(e.target.value)} className="border p-2 w-full rounded mb-4">
                  <option value="">選択してください</option>
                  {tableSettings.map(t=>(
                    tables.some(tab=>tab.tableNumber===t)?
                      <option key={t} value={t} disabled>{t}（使用中）</option>:
                      <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <label className="block text-sm mb-2">開始時間</label>
                <input type="time" value={firstStartTime} onChange={e=>setFirstStartTime(e.target.value)} className="border p-2 w-full rounded mb-4" />
                <label className="block text-sm mb-2">人数を選択</label>
                <select value={selectedCount} onChange={e=>setSelectedCount(Number(e.target.value))} className="border p-2 w-full rounded mb-4">
                  <option value={0}>人数を選択</option>
                  {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} 名</option>)}
                </select>
                <div className="flex justify-end space-x-2">
                  <button onClick={closeFirstModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">キャンセル</button>
                  <button onClick={nextStep} disabled={!selectedTable||selectedCount<1} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">次へ</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">初回来店：お客様情報入力</h3>
                <div className="flex justify-end space-x-2">
                  <button onClick={()=>setStep1(true)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">戻る</button>
                  <button onClick={confirmFirst} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">反映</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Footer currentUser={currentUser} onOpenAddReservation={()=>{}} onOpenFirst={openFirstModal} />
    </>
  );
}
