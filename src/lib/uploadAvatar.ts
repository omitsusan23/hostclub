// lib/uploadAvatar.ts
import { supabase } from './supabaseClient'

export const uploadAvatar = async ({
  file,
  storeId,
  userId,
}: {
  file: File
  storeId: string
  userId: string
}) => {
  const filePath = `${storeId}/${userId}.jpg`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    })

  if (error) {
    throw error
  }

  return data.path
}
