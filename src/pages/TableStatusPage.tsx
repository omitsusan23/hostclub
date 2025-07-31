import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppContext, Table } from '../context/AppContext';
import Header from '../components/Header';
import TableStatusBar from '../components/TableStatusBar';

type Filter = 'all' | 'occupied' | 'empty' | 'first' | 'used';

export default function TableStatusPage() {
  const { state: { tables, tableSettings }, dispatch } = useAppContext();
  const [filter, setFilter] = useState<Filter>('all');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const firstLabels = useMemo<Record<string, string>>(() => {
    const raw = localStorage.getItem('firstLabels');
    return raw ? JSON.parse(raw) : {};
  }, [tables, tableSettings]);

  const handleDelete = useCallback((id: string) => {
    const t = tables.find(x => x.id === id);
    if (!t) return;
    if (!window.confirm(`本当に卓 ${t.tableNumber} を削除しますか？`)) return;
    dispatch({ type: 'DELETE_TABLE', payload: id });
    const saved = JSON.parse(localStorage.getItem('firstLabels') || '{}') as Record<string, string>;
    delete saved[t.tableNumber];
    localStorage.setItem('firstLabels', JSON.stringify(saved));
    setDeleteMessage(`卓 ${t.tableNumber} を削除しました`);
  }, [dispatch, tables]);

  useEffect(() => {
    if (!deleteMessage) return;
    const h = setTimeout(() => setDeleteMessage(''), 1000);
    return () => clearTimeout(h);
  }, [deleteMessage]);

  const filteredTables: Table[] = useMemo(() => {
    const generateEmptyTable = (n: string) => ({
      id: `${Date.now()}-${n}`,
      tableNumber: n,
      princess: '',
      budget: 0,
      time: ''
    });

    switch (filter) {
      case 'occupied':
        return tables;
      case 'first':
        return tables.filter(t => firstLabels[t.tableNumber] !== undefined);
      case 'used':
        return [];
      case 'empty':
        return tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(generateEmptyTable);
      case 'all':
      default:
        const empty = tableSettings
          .filter(n => !tables.some(t => t.tableNumber === n))
          .map(generateEmptyTable);
        return [...tables, ...empty];
    }
  }, [filter, tables, tableSettings, firstLabels]);

  const openDetailModal = useCallback((table: Table) => {
    setSelectedTable(table);
    setDetailModalOpen(true);
  }, []);
  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedTable(null);
  }, []);

  const renderedTables = useMemo(() =>
    filteredTables.map((table, idx) => {
      const isInitial = firstLabels[table.tableNumber] === '初回';
      return (
        <div
          key={idx}
          className="border rounded shadow-sm overflow-hidden flex flex-col cursor-pointer"
          onClick={() => openDetailModal(table)}
        >
          <div className="bg-gray-200 px-0.5 py-1 flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="sr-only">卓番号:</span>
              <span className="text-lg font-bold leading-none self-baseline">
                {table.tableNumber}
              </span>
              {isInitial ? (
                <span className="text-[10px] leading-none self-baseline">🔰</span>
              ) : firstLabels[table.tableNumber] ? (
                <span className="px-0.5 py-0.5 bg-gray-300 rounded-full text-sm leading-none self-baseline">
                  {firstLabels[table.tableNumber]}
                </span>
              ) : null}
            </div>
            {table.princess && (
              <button
                onClick={e => { e.stopPropagation(); handleDelete(table.id); }}
                aria-label={`卓 ${table.tableNumber} を削除`}
                className="text-[10px] leading-none self-baseline"
              >
                🗑
              </button>
            )}
          </div>
          <div className="p-1 flex-grow grid grid-cols-[6ch_1fr] gap-x-2 gap-y-0.5 items-baseline">
            {table.princess ? (
              <>
                <span className="text-[8px]">姫名</span>
                <span className="text-[10px]">{table.princess}</span>
                <span className="text-[8px]">開始</span>
                <span className="text-[10px]">{table.time.slice(0, 5)}</span>
                {!isInitial && (
                  <>
                    <span className="text-[8px]">予算</span>
                    <span className="text-[10px]">
                      {table.budget === 0 ? '未定' : `${table.budget.toLocaleString()}円`}
                    </span>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm mt-5 text-gray-400 text-center">空卓</p>
            )}
          </div>
        </div>
      );
    }),
    [filteredTables, firstLabels, handleDelete, openDetailModal]
  );

  return (
    <>
      {deleteMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black bg-opacity-75 text-white p-4 rounded">
            {deleteMessage}
          </div>
        </div>
      )}

      <Header title="卓状況" />
      
      <TableStatusBar
        selectedFilter={filter === 'all' ? 'occupied' : filter}
        onFilterChange={(newFilter) => setFilter(newFilter)}
      />

      <main id="main-content" className="container mx-auto px-2 pt-[calc(env(safe-area-inset-top)+66px)] pb-4">
        <div className="grid grid-cols-3 gap-3">
          {renderedTables}
        </div>
      </main>

      {detailModalOpen && selectedTable && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4">
          <div className="bg-white w-full h-full max-w-lg rounded shadow-lg overflow-auto relative">
            <button
              onClick={closeDetailModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
}
