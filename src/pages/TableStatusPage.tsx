// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext, Table } from '../context/AppContext';
import Footer from '../components/Footer';

const positionLabelsByCount: Record<number, string[]> = {
  1: [], // 一名時はラベルなし
  2: ['左', '右'],
  3: ['左', '中', '右'],
  4: ['左端', '左', '右', '右端'],
  5: ['左端', '左', '中', '右', '右端'],
  6: ['左端', '左中', '左', '右', '右中', '右端'],
};

export default function TableStatusPage() {
  const { state: { tables, tableSettings, casts, user }, dispatch } = useAppContext();

  const [overlayMessage, setOverlayMessage] = useState('');
  const [deleteMessage, setDeleteMessage]   = useState('');
  const [deletingId, setDeletingId]         = useState<number | null>(null);

  // ―― 初回来店モーダル管理 ――
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

  const renderedTables = useMemo(() => tables.map(table => (
    <div
      key={table.id}
      className="border rounded p-4 shadow-sm bg-white flex justify-between items-start"
    >
      <div>
        <p className="text-center"><strong>卓番号:</strong> {table.tableNumber}</p>
        <p className="text-center"><strong>姫名:</strong> {table.princess}</p>
        <p className="text-center">
          <strong>予算:</strong> {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}
        </p>
        <p className="text-center"><strong>開始時間:</strong> {table.time}</p>
      </div>
      <button
        onClick={() => handleDelete(table.id)}
        disabled={deletingId === table.id}
        className={`text-sm hover:underline ${
          deletingId === table.id ? 'text-gray-400' : 'text-red-500'
        }`}
        aria-label={`卓 ${table.tableNumber} を削除`}
      >
        {deletingId === table.id ? '削除中...' : '削除'}
      </button>
    </div>
  )), [tables, handleDelete, deletingId]);

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

      <main id="main-content" className="p-4 pb-16">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-2xl font-bold text-center">卓状況</h2>
        </div>

        {tables.length === 0 ? (
          <p className="text-gray-500 text-center">まだ反映された卓はありません。</p>
        ) : (
          <div className="space-y-3">{renderedTables}</div>
        )}
      </main>

      {firstModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          {/* モーダル内容省略（既存通り） */}
        </div>
      )}

      {/* ページ固有のフッター */}
      <Footer
        currentUser={user}
        onOpenAddReservation={() => {}}
        onOpenFirst={openFirstModal}
      />
    </>
  );
}
