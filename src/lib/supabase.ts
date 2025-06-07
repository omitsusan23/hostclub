import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (window as any).env?.SUPABASE_URL;
const supabaseAnonKey = (window as any).env?.SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error('supabaseUrl is required');
if (!supabaseAnonKey) throw new Error('supabaseAnonKey is required');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
