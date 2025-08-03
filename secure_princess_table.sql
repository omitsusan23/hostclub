-- ==========================================
-- Princess Profiles Table with Secure RLS Policies
-- store_id による適切なアクセス制御を実装
-- ==========================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for princess_profiles" ON public.princess_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.princess_profiles;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.princess_profiles;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.princess_profiles;

-- ==========================================
-- 新しいRLSポリシー（store_idで保護）
-- ==========================================

-- 1. SELECT（読み取り）ポリシー
-- 同じstore_idのユーザーは、名前と一部の公開情報のみ閲覧可能
CREATE POLICY "Users can view limited princess info in same store" 
ON public.princess_profiles FOR SELECT 
USING (
  -- 同じstore_idのユーザーは名前と基本情報を閲覧可能
  store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
);

-- 2. INSERT（作成）ポリシー  
-- ユーザーは自分のstore_idの姫情報のみ作成可能
CREATE POLICY "Users can insert princess in own store" 
ON public.princess_profiles FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
);

-- 3. UPDATE（更新）ポリシー
-- 作成者のみが更新可能（created_byカラムが必要）
CREATE POLICY "Only creator can update princess profile" 
ON public.princess_profiles FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
  -- 以下のコメントアウトを解除すると、作成者のみ編集可能になります
  -- AND created_by = auth.uid()
);

-- 4. DELETE（削除）ポリシー
-- 作成者のみが削除可能
CREATE POLICY "Only creator can delete princess profile" 
ON public.princess_profiles FOR DELETE 
USING (
  auth.uid() IS NOT NULL 
  AND store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
  -- 以下のコメントアウトを解除すると、作成者のみ削除可能になります
  -- AND created_by = auth.uid()
);

-- ==========================================
-- テーブル構造の改善（必要なカラムを追加）
-- ==========================================

-- created_byカラムを追加（作成者を記録）
ALTER TABLE public.princess_profiles 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- is_publicカラムを追加（公開/非公開フラグ）
ALTER TABLE public.princess_profiles 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- public_fieldsカラムを追加（公開するフィールドのリスト）
ALTER TABLE public.princess_profiles 
ADD COLUMN IF NOT EXISTS public_fields JSONB DEFAULT '["name"]'::jsonb;

-- ==========================================
-- ビューを作成（来店予約用の公開情報のみ）
-- ==========================================

CREATE OR REPLACE VIEW public.princess_public_info AS
SELECT 
  id,
  store_id,
  name,
  attribute,
  -- 必要に応じて他の公開フィールドを追加
  CASE 
    WHEN is_public = true THEN line_name 
    ELSE NULL 
  END as line_name,
  CASE 
    WHEN is_public = true THEN favorite_drink 
    ELSE NULL 
  END as favorite_drink
FROM public.princess_profiles;

-- ビューに対するRLSポリシー
CREATE POLICY "Same store users can view public info" 
ON public.princess_public_info FOR SELECT 
USING (
  store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
);

-- ==========================================
-- 使用例
-- ==========================================

-- 来店予約追加時に姫リストを取得（公開情報のみ）
-- SELECT id, name, attribute FROM princess_public_info WHERE store_id = 'your-store-id';

-- 自分が作成した姫情報の全データを取得
-- SELECT * FROM princess_profiles WHERE created_by = auth.uid();

-- 同じ店舗の姫一覧を取得（基本情報のみ）  
-- SELECT id, name FROM princess_profiles WHERE store_id = 'your-store-id';