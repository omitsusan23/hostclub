// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
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

  // ―― 初回で反映した卓番号リスト ――
  const [firstTables, setFirstTables] = useState<string[]>([]);

  // ―― フィルタリング状態 ――
  const [filter, setFilter] = useState<Filter>('all');

  // ―― 各種モーダル／オーバーレイ用 state ――
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

  // モーダル開閉・ステップ管理
  const openFirstModal = () => {
    const now = new Date();
    setFirstStartTime(now.toTimeString().slice(0,5));
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

  // 卓削除
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
    // ① Context に割り当て （ここが修正点: requestedTable → tableNumber）
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

    // ② 初回リストに追加
    setFirstTables(prev =>
      prev.includes(selectedTable) ? prev : [...prev, selectedTable]
    );

    // オーバーレイ表示
    const entries = names.map((n,i) => {
      const label = positionLabelsByCount[selectedCount][i];
      const pname = n || 'お客様';
      const pcast = photos[i] !== 'なし' ? `（指名：${photos[i]}）` : '';
      return (label ? `${label}: ` : '') + `${pname}${pcast}`;
    });
    setOverlayMessage(`卓【${selectedTable}】に着席：${entries.join('、')}`);
    setTimeout(() => setOverlayMessage(''), 1000);

    closeFirstModal();
  };

  // テーブルフィルタリング
  const filteredTables: Table[] = useMemo(() => {
    switch (filter) {
      case 'occupied':
        return tables;
      case 'first':
        return tables.filter(t => firstTables.includes(t.tableNumber));
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
  }, [filter, tables, tableSettings, firstTables]);

  // テーブル描画
  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => (
      <div
        key={idx}
        className="relative border rounded p-4 shadow-sm bg-white flex flex-col justify-between"
      >
        {/* 削除ボタン（姫がいる卓のみ） */}
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

        {/* 卓番号＋(初回)マーク */}
        <p className="text-center font-bold">
          {table.tableNumber}
          {firstTables.includes(table.tableNumber) && ' (初回)'}
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
    )),
  [filteredTables, handleDelete, deletingId, firstTables]);

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

      {/* 着席オーバーレイ */}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded max-w-md text-center">
            {overlayMessage}
          </div>
        </div>
      )}

      {/* 固定ヘッダー */}
      <header
        className="sticky top-0 bg-white z-50 border-b
                   px-4 py-5
                   grid grid-cols-[1fr_auto_1fr] items-baseline"
      >
        {/* 左端: 初回 */}
        <button
          onClick={() => setFilter('first')}
          className={`justify-self-start bg-gray-100 rounded-full px-1 py-0.5 text-xs ${
            filter === 'first' ? 'font-bold text-black' : 'text-gray-700'
          }`}
        >
          初回
        </button>

        {/* 中央: 卓状況 */}
        <h2 className="justify-self-center text-2xl font-bold">
          卓状況
        </h2>

        {/* 右端: 全卓・使用中・空卓 */}
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
      </header>

      {/* テーブルグリッド（3列） */}
      <main id="main-content" className="px-4 py-4 grid grid-cols-3 gap-4">
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
                {/* 既存フォームはそのまま */}
                <label className="block text-sm mb-2">卓を選択</label>
                <select
                  value={selectedTable}
                  onChange={e => setSelectedTable(e.target.value)}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value="">選択してください</option>
                  {tableSettings.map(t =>
                    tables.some(tab => tab.tableNumber === t) ? (
                      <option key={t} value={t} disabled>
                        {t}（使用中）
                      </option>
                    ) : (
                      <option key={t} value={t}>{t}</option>
                    )
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
                  onChange={e => setSelectedCount(Number(e.target.value))}
                  className="border p-2 w-full rounded mb-4"
                >
                  <option value={0}>人数を選択してください</option>
                  {[1,2,3,4,5,6].map(n => (
                    <option key={n} value={n}>{n} 名</option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closeFirstModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >キャンセル</button>
                  <button
                    onClick={nextStep}
                    disabled={!selectedTable||selectedCount<1}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >次へ</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  初回来店：お客様情報
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {names.map((_,i) => (
                    <div key={i}>
                      {positionLabelsByCount[selectedCount][i] && (
                        <label className="block text-xs text-gray-500 mb-1">
                          {positionLabelsByCount[selectedCount][i]}
                        </label>
                      )}
                      <input
                        type="text"
                        placeholder="名前"
                        value={names[i]}
                        onChange={e => {
                          const a = [...names]; a[i] = e.target.value.slice(0,6);
                          setNames(a);
                        }}
                        className="border p-2 rounded w-full"
                      />
                      <select
                        value={photos[i]}
                        onChange={e => {
                          const b = [...photos]; b[i] = e.target.value;
                          setPhotos(b);
                        }}
                        className="border p-2 rounded w-full mt-1"
                      >
                        <option value="なし">写真指名なし</option>
                        {casts.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setStep1(true)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >戻る</button>
                  <button
                    onClick={confirmFirst}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >反映</button>
                </div>
              </>
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
