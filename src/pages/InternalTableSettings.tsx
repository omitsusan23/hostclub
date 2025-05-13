// src/pages/InternalTableSettings.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Props = {};

// ─── 環境変数から API ベース URL と社内トークンを取得 ─────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL;           // e.g. http://localhost:3000/api
const API_TOKEN = import.meta.env.VITE_INTERNAL_API_TOKEN!;  // 社内専用トークン

export default function InternalTableSettings({}: Props) {
  // ─── テナント（店舗）リスト ─────────────────────────────────────────
  // 本来は API から取得しても良いですが、まずはハードコーディング例
  const tenantOptions = [
    { id: 'host1', name: 'Host Club A' },
    { id: 'host2', name: 'Host Club B' },
    { id: 'host3', name: 'Host Club C' },
  ];

  // ─── State ───────────────────────────────────────────────────────
  const [tenantId, setTenantId]       = useState<string>(tenantOptions[0].id);
  const [tables, setTables]           = useState<string[]>([]);
  const [newTable, setNewTable]       = useState('');

  // ─── ヘッダー：API 通信用の共通ヘッダー ──────────────────────────
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
  };

  // ─── 初回ロード＆テナント切り替え時に卓一覧を取得 ────────────────────
  useEffect(() => {
    axios
      .get(`${API_BASE}/internal/tables`, {
        headers,
        params: { tenant: tenantId },
      })
      .then((res) => {
        setTables(res.data.tables); // 例: { tables: ['T1','T2',…] }
      })
      .catch((err) => {
        console.error('卓一覧取得エラー', err);
        setTables([]);
      });
  }, [tenantId]);

  // ─── 新規卓を追加 ────────────────────────────────────────────────
  const addTable = () => {
    const name = newTable.trim();
    if (!name) return;
    axios
      .post(
        `${API_BASE}/internal/tables`,
        { tenant_id: tenantId, table_name: name },
        { headers }
      )
      .then((res) => {
        setTables((prev) => [...prev, res.data.table_name]);
        setNewTable('');
      })
      .catch((err) => {
        console.error('卓追加エラー', err);
      });
  };

  // ─── 卓を削除 ─────────────────────────────────────────────────
  const deleteTable = (table: string) => {
    axios
      .delete(
        `${API_BASE}/internal/tables/${tenantId}/${encodeURIComponent(table)}`,
        { headers }
      )
      .then(() => {
        setTables((prev) => prev.filter((t) => t !== table));
      })
      .catch((err) => {
        console.error('卓削除エラー', err);
      });
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* ─── ヘッダー ─────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">社内卓設定管理</h1>
        {/* テナント切り替えプルダウン */}
        <select
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
          className="border p-2 rounded"
        >
          {tenantOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* ─── 卓追加フォーム ───────────────────────────────────────── */}
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          placeholder="新しい卓名を入力"
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={addTable}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>

      {/* ─── 現在の卓一覧 ─────────────────────────────────────────── */}
      {tables.length === 0 ? (
        <p className="text-gray-500">設定された卓はありません。</p>
      ) : (
        <ul className="space-y-2">
          {tables.map((table) => (
            <li
              key={table}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{table}</span>
              <button
                onClick={() => deleteTable(table)}
                className="text-red-500 hover:underline"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
