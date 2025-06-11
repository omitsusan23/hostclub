import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('supabaseUrl is required');
if (!supabaseAnonKey) throw new Error('supabaseAnonKey is required');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,       // ✅ セッションを localStorage に永続化
    autoRefreshToken: true,     // ✅ トークンを自動で更新（期限切れ防止）
  },
});
