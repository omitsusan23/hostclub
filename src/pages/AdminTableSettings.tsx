import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, type User } from '../context/AppContext';
import Header from '../components/Header';

type TableSetting = string;

interface AdminTableSettingsProps {
  setCurrentUser?: (user: User | null) => void;
}

const AdminTableSettings: React.FC<AdminTableSettingsProps> = ({ setCurrentUser }) => {
  const { state, dispatch } = useAppContext();
  const { tableSettings = [] as TableSetting[] } = state;

  const [newTable, setNewTable] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setCurrentUser?.(null);
    dispatch({ type: 'LOGOUT' });
    navigate('/', { replace: true });
  }, [setCurrentUser, dispatch, navigate]);

  const handleAdd = useCallback(async (): Promise<void> => {
    setError('');
    const trimmed = newTable.trim();
    if (!trimmed) return;
    setIsLoading(true);
    try {
      dispatch({ type: 'ADD_TABLE_SETTING', payload: trimmed });
      setNewTable('');
      setMessage(`卓 ${trimmed} を追加しました`);
    } catch (e) {
      console.error(e);
      setError('卓の追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, newTable]);

  const handleDelete = useCallback(async (table: TableSetting): Promise<void> => {
    if (!window.confirm(`本当に卓 ${table} を削除しますか？`)) return;
    setError('');
    setIsLoading(true);
    try {
      dispatch({ type: 'REMOVE_TABLE_SETTING', payload: table });
      setMessage(`卓 ${table} を削除しました`);
    } catch (e) {
      console.error(e);
      setError('卓の削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const renderedTableSettings = useMemo(() => {
    return tableSettings.map((t) => (
      <li
        key={t}
        className="flex justify-between items-center border p-2 rounded bg-gray-50"
      >
        <span>{t}</span>
        <button
          onClick={() => handleDelete(t)}
          disabled={isLoading}
          className={`text-sm hover:underline ${
            isLoading ? 'text-gray-400' : 'text-red-500'
          }`}
          aria-label={`卓 ${t} を削除`}
        >
          {isLoading ? '削除中...' : '削除'}
        </button>
      </li>
    ));
  }, [tableSettings, handleDelete, isLoading]);

  return (
    <>
      <Header title="設定">
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 underline"
        >
          ログアウト
        </button>
      </Header>

      <main id="main-content" className="p-6 pt-[calc(env(safe-area-inset-top)+66px)]">
        <div aria-live="polite" className="mb-4">
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>

        <p className="text-gray-600 mb-4">
          ※ この画面はシステム管理者のみアクセス可能です
        </p>

        <h2 className="text-xl font-semibold mb-2">卓設定</h2>
        <div className="flex mb-4 space-x-2 items-center">
          <label htmlFor="new-table-input" className="sr-only">
            卓番号を入力
          </label>
          <input
            id="new-table-input"
            type="text"
            placeholder="例: T4"
            value={newTable}
            onChange={(e) => setNewTable(e.target.value)}
            className="border p-2 rounded flex-grow"
            disabled={isLoading}
          />
          <button
            onClick={handleAdd}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              isLoading
                ? 'bg-gray-400 text-gray-200'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading ? '追加中...' : '追加'}
          </button>
        </div>

        {tableSettings.length === 0 ? (
          <p className="text-gray-500">設定された卓はありません。</p>
        ) : (
          <ul className="space-y-2">{renderedTableSettings}</ul>
        )}
      </main>
    </>
  );
};

export default AdminTableSettings;
