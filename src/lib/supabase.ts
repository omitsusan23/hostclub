import { createClient } from '@supabase/supabase-js';
import localforage from 'localforage';

// 環境変数の取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// エラーハンドリング
if (!supabaseUrl) throw new Error('supabaseUrl is required');
if (!supabaseAnonKey) throw new Error('supabaseAnonKey is required');

// セッション保存用のlocalForageラッパー
const customStorage = {
  getItem: (key: string): Promise<string | null> =>
    localforage.getItem<string>(key),
  setItem: (key: string, value: string): Promise<void> =>
    localforage.setItem(key, value).then(() => {}),
  removeItem: (key: string): Promise<void> =>
    localforage.removeItem(key),
};

// Supabaseクライアント作成（セッションを永続保存）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token', // ← 任意キー（明示的に指定）
  },
});
