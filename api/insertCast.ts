import { supabase } from '@/lib/supabaseClient'; // 修正済みのsupabaseクライアント
import { v4 as uuidv4 } from 'uuid';

/**
 * キャスト登録処理
 */
export async function insertCast({ role = 'cast' }: { role: string }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('ログインユーザーの取得に失敗しました');
  }

  const store_id = user.user_metadata?.store_id;
  const created_by = user.id;
  const invite_token = uuidv4(); // 一意トークンを生成

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
    console.error('INSERT失敗:', error.message);
    throw new Error(`キャスト登録に失敗しました: ${error.message}`);
  }

  return invite_token;
}
