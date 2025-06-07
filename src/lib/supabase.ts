import { createClient } from '@supabase/supabase-js';

// Viteで展開されない場合に備えて、fallbackで process.env を参照
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('supabaseUrl is required');
if (!supabaseAnonKey) throw new Error('supabaseAnonKey is required');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
