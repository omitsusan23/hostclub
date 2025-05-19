// src/components/TableCard.tsx

import React, { useState, useRef, useCallback } from 'react';

export interface Table {
  id: string;
  tableNumber: string;
  cast: string;
  princess: string;
  time: string;
  note: string;
}

interface TableCardProps {
  table: Table;
  onAssign?: (table: Table) => void;
  onDelete?: (id: string) => void;
}

function TableCard({ table, onAssign, onDelete }: TableCardProps) {
  const [showPrincess, setShowPrincess] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // 姫名表示切替
  const togglePrincess = useCallback(() => {
    setShowPrincess((prev) => !prev);
  }, []);

  // 備考編集フィールドにフォーカス
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
      <div className="text-lg font-bold text-blue-800 mb-1">
        卓番号: {table.tableNumber}
      </div>
      <div className="text-sm text-gray-700">担当: {table.cast}</div>

      {showPrincess && (
        <div className="text-sm text-gray-700">姫名: {table.princess}</div>
      )}

      <div className="text-sm text-gray-700">開始: {table.time}</div>

      <div className="mt-2">
        <button
          onClick={focusInput}
          className="text-xs text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600 mb-2"
        >
          備考を編集
        </button>
        <input
          ref={inputRef}
          type="text"
          defaultValue={table.note}
          className="border border-gray-300 rounded px-2 py-1 w-full text-sm"
        />
      </div>

      <button
        onClick={togglePrincess}
        className="mt-2 text-xs text-blue-600 underline"
      >
        {showPrincess ? '姫名を隠す' : '姫名を表示'}
      </button>

      <div className="mt-2 space-x-2">
        {onAssign && (
          <button
            onClick={() => onAssign(table)}
            className="text-sm text-green-600 underline"
          >
            卓に反映
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(table.id)}
            className="text-sm text-red-500 underline"
          >
            削除
          </button>
        )}
      </div>
    </div>
  );
}

// props が変わらなければ再レンダリングを抑制
export default React.memo(TableCard);
