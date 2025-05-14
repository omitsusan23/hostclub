// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext, Table } from '../context/AppContext';

const TableStatusPage: React.FC = () => {
  const {
    state: { tables },
    dispatch,
  } = useAppContext();

  // 削除前後のメッセージはオーバーレイで表示
  const [overlayMessage, setOverlayMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 時刻を「HH:MM」のみで表示
  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    return h && m ? `${h}:${m}` : time;
  };

  const handleDelete = useCallback(
    async (id: number) => {
      const table = tables.find((t) => t.id === id);
      if (!table) return;
      if (!window.confirm(`本当に卓 ${table.tableNumber} を削除しますか？`))
        return;

      setError('');
      setDeletingId(id);
      try {
        dispatch({ type: 'DELETE_TABLE', payload: id });
        // オーバーレイメッセージを表示して1秒後に消す
        setOverlayMessage(`卓 ${table.tableNumber} を削除しました`);
        setTimeout(() => setOverlayMessage(''), 1000);
      } catch {
        setError('卓の削除に失敗しました');
      } finally {
        setDeletingId(null);
      }
    },
    [dispatch, tables]
  );

  const renderedTables = useMemo(
    () =>
      tables.map((table: Table) => (
        <div
          key={table.id}
          className="border rounded p-4 shadow-sm bg-white flex justify-between items-start"
        >
          <div>
            <p>
              <strong>卓番号:</strong> {table.tableNumber}
            </p>
            <p>
              <strong>姫名:</strong> {table.princess}
            </p>
            <p>
              <strong>予算:</strong>{' '}
              {table.budget === 0
                ? '未定'
                : `${table.budget.toLocaleString()}円`}
            </p>
            <p>
              <strong>開始時間:</strong> {formatTime(table.time)}
            </p>
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
      )),
    [tables, handleDelete, deletingId]
  );

  return (
    <main id="main-content" className="p-4 pb-16 relative">
      {/* 削除完了オーバーレイ */}
      {overlayMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">
            {overlayMessage}
          </div>
        </div>
      )}

      {/* エラーメッセージ（失敗時のみ） */}
      {error && (
        <div aria-live="polite" className="mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 見出し */}
      <h2 className="text-2xl font-bold mb-4 text-center">卓状況</h2>

      {tables.length === 0 ? (
        <p className="text-gray-500">まだ反映された卓はありません。</p>
      ) : (
        <div className="space-y-3">{renderedTables}</div>
      )}
    </main>
  );
};

export default TableStatusPage;
