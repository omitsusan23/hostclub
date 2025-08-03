-- princess_profilesテーブルにメモと飾り・キープフィールドを追加
ALTER TABLE public.princess_profiles 
ADD COLUMN IF NOT EXISTS memo TEXT,
ADD COLUMN IF NOT EXISTS decoration_keep TEXT;