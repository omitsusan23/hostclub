// src/pages/TableStatusPage.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { useAppContext, Table } from '../context/AppContext';

const TableStatusPage: React.FC = () => {
  const {
    state: { tables },
    dispatch,
  } = useAppContext();
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 時刻を「HH:MM」のみで表示
  const formatTime = (time: string) => {
    const parts = time.split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : time;
  };

  const handleDelete = useCallback(
    async (id: number) => {
      const table = tables.find((t) => t.id === id);
      if (!table) return;
      if (!window.confirm(`本当に卓 ${table.tableNumber} を削除しますか？`)) return;

      setError('');
      setDeletingId(id);
      try {
        dispatch({ type: 'DELETE_TABLE', payload: id });
        setMessage(`卓 ${table.tableNumber} を削除しました`);
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
    <main id="main-content" className="p-4 pb-16">
      {/* メッセージ／エラー */}
      {(message || error) && (
        <div aria-live="polite" className="mb-4">
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
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
