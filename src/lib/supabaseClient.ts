// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import localforage from 'localforage';

// 環境変数の取得と安全性チェック
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('supabaseUrl is required');
if (!supabaseAnonKey) throw new Error('supabaseAnonKey is required');

// セッションをlocalForageで永続保存
const customStorage = {
  getItem: (key: string): Promise<string | null> =>
    localforage.getItem<string>(key),
  setItem: (key: string, value: string): Promise<void> =>
    localforage.setItem(key, value).then(() => {}),
  removeItem: (key: string): Promise<void> =>
    localforage.removeItem(key),
};

// Supabaseクライアント作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token', // 任意で変更可
  },
});
