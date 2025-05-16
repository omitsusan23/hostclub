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

  // ── 初回割り当てテーブルに付与するラベル (「初回」 or 「初回指名」)
  const [firstLabels, setFirstLabels] = useState<Record<string, string>>({});
  // ── モーダル内の切り替え状態
  const [firstType, setFirstType] = useState<'初回' | '初回指名'>('初回');

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
      try {
        const parsed = JSON.parse(saved);
        console.log('🎉 restored firstLabels:', parsed);
        setFirstLabels(parsed);
      } catch {
        console.warn('firstLabels の復元に失敗しました');
      }
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
    console.log('✅ confirmFirst start', { selectedTable, firstType, names });
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
    setFirstLabels(prev => {
      const prevLabel = prev[selectedTable];
      if (prevLabel === firstType) {
        console.log('firstLabels はすでに存在します', prev);
        return prev;
      }
      const next = { ...prev, [selectedTable]: firstType };
      localStorage.setItem('firstLabels', JSON.stringify(next));
      console.log('✨ firstLabels updated:', next);
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
        console.log('🔍 filtering first:', firstLabels);
        return tables.filter(t => firstLabels[t.tableNumber] !== undefined);
      case 'empty':
        return tableSettings
          .filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({
            id: Date.now() + num.length,
            tableNumber: num,
            princess: '',
            budget: 0,
            time: '',
          }));
      case 'all':
      default:
        const empty = tableSettings
          .filter(num => !tables.some(t => t.tableNumber === num))
          .map(num => ({
            id: Date.now() + num.length,
            tableNumber: num,
            princess: '',
            budget: 0,
            time: '',
          }));
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  // ── テーブル描画
  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => {
      const label = firstLabels[table.tableNumber];
      return (
        <div
          key={idx}
          className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between"
        >
          {table.princess && (
            <button
              onClick={() => handleDelete(table.id)}
              disabled={deletingId === table.id}
              className={`absolute top-1 right-1 text-sm hover:underline ${
                deletingId === table.id ? 'text-gray-400' : 'text-red-500'
              }`}
              aria-label={`卓 ${table.tableNumber} を削除`}
            >
              {deletingId === table.id ? '削除中...' : '削除'}
            </button>
          )}

          {console.log(`🎨 rendering ${table.tableNumber}`, label)}

          <p className="text-center font-bold">
            {table.tableNumber}
            {label && ` （${label}）`}
          </p>

          {table.princess ? (
            <>
              <p className="text-sm mt-2"><strong>姫名:</strong> {table.princess}</p>
              <p className="text-sm"><strong>開始:</strong> {table.time.slice(0,5)}</p>
              <p className="text-sm">
                <strong>予算:</strong>{' '}
                {table.budget === 0
                  ? '未定'
                  : `${table.budget.toLocaleString()}円`}
              </p>
            </>
          ) : (
            <p className="text-sm mt-4 text-gray-400 text-center">空卓</p>
          )}
        </div>
      );
    }),
  [filteredTables, handleDelete, deletingId, firstLabels]);

  return (
    <>
      {/* 削除メッセージ */}
      {deleteMessage && ( /* … */ )}

      {/* 着席オーバーレイ */}
      {overlayMessage && ( /* … */ )}

      {/* 固定ヘッダー */}
      <header className="sticky top-0 bg-white z-50 border-b px-4 py-5 grid grid-cols-[1fr_auto_1fr] items-baseline">
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
          <button onClick={() => setFilter('all')}  className={`…`}>全卓</button>
          <button onClick={() => setFilter('occupied')} className={`…`}>使用中</button>
          <button onClick={() => setFilter('empty')}  className={`…`}>空卓</button>
        </div>
      </header>

      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">
        {renderedTables}
      </main>

      {/* 初回来店モーダル */}
      {firstModalOpen && (
        <div role="dialog" /* … */>
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            {step1 ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  初回来店：卓と人数を選択
                </h3>
                <div className="mb-4 flex items-center space-x-4 justify-center">
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="radio"
                      value="初回"
                      checked={firstType === '初回'}
                      onChange={() => setFirstType('初回')}
                    />
                    <span className="text-sm">初回</span>
                  </label>
                  <label className="inline-flex items-center space-x-1">
                    <input
                      type="radio"
                      value="初回指名"
                      checked={firstType === '初回指名'}
                      onChange={() => setFirstType('初回指名')}
                    />
                    <span className="text-sm">初回指名</span>
                  </label>
                </div>
                {/* 既存：フォーム部分 */}
                {/* … */}
              </>
            ) : (
              /* 二段目フォーム */
              /* … */
            )}
          </div>
        </div>
      )}

      {/* フッター */}
      <Footer
        currentUser={null}
        onOpenAddReservation={() => {}}
        onOpenFirst={openFirstModal}
      />
    </>
  );
}
