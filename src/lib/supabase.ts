import { createClient } from '@supabase/supabase-js';
import localforage from 'localforage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('supabaseUrl is required');
if (!supabaseAnonKey) throw new Error('supabaseAnonKey is required');

const customStorage = {
  getItem: (key: string): Promise<string | null> =>
    localforage.getItem<string>(key),
  setItem: (key: string, value: string): Promise<void> =>
    localforage.setItem(key, value).then(() => {}),
  removeItem: (key: string): Promise<void> =>
    localforage.removeItem(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
