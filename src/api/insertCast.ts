import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * キャスト登録処理（RLS対応 + デバッグログ付き・型安全強化版）
 */
export async function insertCast({ role = 'cast' }: { role: string }) {
  // Supabaseのユーザー情報を取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // ✅ ユーザー情報の検証ログ
  console.log('🟡 Supabase user:', user);
  console.log('🟡 Supabase user_metadata:', user?.user_metadata);

  if (userError || !user) {
    console.error('❌ ログインユーザーの取得に失敗:', userError?.message);
    throw new Error('ログインユーザーの取得に失敗しました');
  }

  const store_id = String(user.user_metadata?.store_id ?? '');
  const created_by = user.id;
  const invite_token = uuidv4(); // 一意トークンを生成

  // 🔍 デバッグログ出力（各値の詳細）
  console.log('🔍 INSERT DEBUG');
  console.log('  - store_id (typeof):', typeof store_id, store_id);
  console.log('  - created_by (typeof):', typeof created_by, created_by);
  console.log('  - invite_token:', invite_token);
  console.log('  - role:', role);

  // ❗store_idのバリデーション
  if (!store_id || typeof store_id !== 'string' || store_id.trim() === '') {
    throw new Error('❌ store_id が未設定または不正です。user_metadata を確認してください。');
  }

  // ❗created_byのUUIDバリデーション（簡易チェック）
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(created_by)) {
    throw new Error(`❌ created_by が不正なUUID形式です: ${created_by}`);
  }

  const payload = {
    invite_token,
    store_id,
    role,
    created_by,
    is_active: true,
  };

  console.log('📦 INSERT payload:', payload);

  const { error } = await supabase.from('casts').insert([payload]);

  if (error) {
    console.error('❌ INSERT失敗:', error.message, error.details ?? '', error.hint ?? '');
    throw new Error(`キャスト登録に失敗しました: ${error.message}`);
  }

  console.log('✅ キャスト登録成功 🎉');
  return invite_token;
}
