import { supabase } from './supabaseClient';

export const uploadAvatar = async ({
  file,
  storeId,
  userId,
}: {
  file: File;
  storeId: string;
  userId: string;
}) => {
  const filePath = `${storeId}/${userId}.jpg`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || 'image/jpeg',
    });

  if (error) {
    console.error('🛑 Avatar upload failed:', error.message);
    throw new Error('アップロードに失敗しました');
  }

  // ✅ public URL を生成して返す
  const { data: publicData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  if (!publicData?.publicUrl) {
    console.error('🛑 publicUrl が取得できません');
    throw new Error('画像URLの取得に失敗しました');
  }

  return publicData.publicUrl;
};
