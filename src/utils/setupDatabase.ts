import { supabase } from '../lib/supabaseClient';

// ブラウザのコンソールで実行する関数
export async function setupPrincessTable() {
  try {
    // 1. まずテーブルが存在するか確認
    const { data, error } = await supabase
      .from('princess_profiles')
      .select('id')
      .limit(1);

    if (!error) {
      console.log('✅ テーブルは既に存在します！');
      return { success: true, message: 'Table already exists' };
    }

    if (error.code === '42P01') {
      console.log('❌ テーブルが存在しません');
      console.log('Supabaseダッシュボードでservice_roleキーを使用するか、');
      console.log('データベース直接接続権限が必要です。');
      
      // Supabase Edge Functionを使用する場合のコード
      // （Edge Functionの設定が必要）
      /*
      const { data, error: funcError } = await supabase.functions.invoke('create-tables', {
        body: { table: 'princess_profiles' }
      });
      */
      
      return { 
        success: false, 
        message: 'Table does not exist. Please create manually in Supabase dashboard.',
        sql: getCreateTableSQL()
      };
    }

    return { success: false, error };
  } catch (err) {
    console.error('エラー:', err);
    return { success: false, error: err };
  }
}

function getCreateTableSQL() {
  return `
-- UUID拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 姫プロフィールテーブルを作成
CREATE TABLE IF NOT EXISTS public.princess_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    line_name VARCHAR(255),
    attribute VARCHAR(100),
    age INTEGER,
    birth_year INTEGER,
    birth_date VARCHAR(20),
    current_residence VARCHAR(255),
    birthplace VARCHAR(255),
    blood_type VARCHAR(10),
    occupation VARCHAR(255),
    contact_time VARCHAR(100),
    favorite_drink VARCHAR(255),
    favorite_cigarette VARCHAR(255),
    bottle_name VARCHAR(255),
    favorite_help VARCHAR(255),
    hobby TEXT,
    specialty TEXT,
    holiday VARCHAR(100),
    favorite_brand VARCHAR(255),
    marriage VARCHAR(50),
    children VARCHAR(50),
    partner VARCHAR(50),
    is_public BOOLEAN DEFAULT false,
    public_fields JSONB DEFAULT '["name"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成
CREATE INDEX idx_princess_profiles_store_id ON public.princess_profiles(store_id);
CREATE INDEX idx_princess_profiles_name ON public.princess_profiles(name);
CREATE INDEX idx_princess_profiles_created_by ON public.princess_profiles(created_by);

-- RLS有効化
ALTER TABLE public.princess_profiles ENABLE ROW LEVEL SECURITY;

-- RLSポリシー作成
CREATE POLICY "Users can view princess info in same store" 
ON public.princess_profiles FOR SELECT 
USING (store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id'));

CREATE POLICY "Users can insert princess in own store" 
ON public.princess_profiles FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id'));

CREATE POLICY "Users can update princess in same store" 
ON public.princess_profiles FOR UPDATE 
USING (auth.uid() IS NOT NULL AND store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id'));

CREATE POLICY "Users can delete princess in same store" 
ON public.princess_profiles FOR DELETE 
USING (auth.uid() IS NOT NULL AND store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id'));
`;
}

// ブラウザコンソールで実行する例
// const result = await setupPrincessTable();