import { supabase } from '@/lib/supabaseClient';

export async function insertCast({ role = 'cast' }: { role: string }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('ログインユーザーの取得に失敗しました');
  }

  // ✅ メタデータの確認用ログ
  console.log('📦 Supabase user metadata:', user.user_metadata);
  console.log('🏪 store_id:', user.user_metadata?.store_id);

  const store_id = user.user_metadata?.store_id;
  const created_by = user.id;

  if (!store_id) {
    throw new Error('store_id がユーザーメタデータに含まれていません。RLSで拒否される可能性があります。');
  }

  const invite_token = uuidv4();

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
