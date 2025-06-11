import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

/**
 * キャスト登録処理（RLS対応 + デバッグログ付き）
 */
export async function insertCast({ role = 'cast' }: { role: string }) {
  // Supabaseのユーザー情報を取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('ログインユーザーの取得に失敗:', userError?.message);
    throw new Error('ログインユーザーの取得に失敗しました');
  }

  // user_metadataからstore_idを取得
  const store_id = String(user.user_metadata?.store_id ?? '');
  const created_by = user.id;
  const invite_token = uuidv4(); // 一意トークンを生成

  // 🔍 デバッグログ出力
  console.log('🔍 INSERT DEBUG');
  console.log('  - store_id:', store_id);
  console.log('  - created_by:', created_by);
  console.log('  - invite_token:', invite_token);
  console.log('  - role:', role);

  if (!store_id) {
    throw new Error('store_id が未設定です。ユーザー情報を確認してください');
  }

  const { error } = await supabase.from('casts').insert([
    {
      invite_token,
      store_id,
      role,
      created_by,
      is_active: true,
    },
  ]);

  if (error) {
    console.error('❌ INSERT失敗:', error.message);
    throw new Error(`キャスト登録に失敗しました: ${error.message}`);
  }

  console.log('✅ キャスト登録成功');
  return invite_token;
}
