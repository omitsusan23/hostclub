import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Service Role Keyを使用してクライアントを作成
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createPrincessTable() {
  console.log('🚀 姫プロフィールテーブルの作成を開始します...');

  try {
    // まずテーブルが存在するか確認
    const { data: checkData, error: checkError } = await supabase
      .from('princess_profiles')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ princess_profilesテーブルは既に存在します！');
      
      // テーブルの構造を確認
      const { data: columns, error: colError } = await supabase.rpc('get_table_columns', {
        table_name: 'princess_profiles'
      }).catch(() => ({ data: null, error: 'Function not available' }));
      
      if (columns) {
        console.log('📋 現在のテーブル構造:', columns);
      }
      return;
    }

    if (checkError.code !== '42P01') {
      console.log('⚠️ 予期しないエラー:', checkError);
      return;
    }

    console.log('📝 テーブルが存在しません。作成します...');
    console.log('');
    console.log('=================================================================');
    console.log('以下のSQLをSupabaseダッシュボードのSQL Editorで実行してください:');
    console.log('=================================================================');
    console.log('');

    const fullSQL = `
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
CREATE INDEX IF NOT EXISTS idx_princess_profiles_store_id ON public.princess_profiles(store_id);
CREATE INDEX IF NOT EXISTS idx_princess_profiles_name ON public.princess_profiles(name);
CREATE INDEX IF NOT EXISTS idx_princess_profiles_created_by ON public.princess_profiles(created_by);

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

    console.log(fullSQL);
    console.log('');
    console.log('=================================================================');
    console.log('');

    // Supabase CLIがインストールされている場合の代替方法
    console.log('または、Supabase CLIを使用:');
    console.log('npx supabase db execute --sql "上記のSQL"');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  }
}

// 実行
createPrincessTable();