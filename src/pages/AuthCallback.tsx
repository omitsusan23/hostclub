// src/pages/AuthCallback.tsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../contexts/StoreContext'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { setSession, setUserMetadata } = useStore()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session || !session.user) {
        console.error('❌ セッション取得失敗:', error)
        setErrorMessage('ログインに失敗しました。')
        return
      }

      const user = session.user
      const metadata = user.user_metadata
      const role = metadata.role
      const storeId = metadata.store_id
      const email = metadata.email

      if (!role || !storeId || !email) {
        console.warn('⚠️ 必須情報が不足しています')
        setErrorMessage('ユーザー情報が不足しています。')
        return
      }

      const table = role === 'cast' ? 'casts' : role === 'operator' ? 'operators' : 'admins'

      // 🔍 invite_tokenでレコード確認（auth_user_idがnullの状態で確認）
      const { data: invitedRow, error: findError } = await supabase
        .from(table)
        .select('id, auth_user_id, invite_token')
        .eq('invite_token', metadata.invite_token)  // invite_tokenを使って検索
        .eq('store_id', storeId)
        .maybeSingle()

      if (findError) {
        console.error('🔍 招待レコード取得エラー:', findError)
        setErrorMessage('招待確認中にエラーが発生しました。')
        return
      }

      if (!invitedRow) {
        console.warn('⚠️ 招待レコードが見つかりません')
        setErrorMessage('このメールアドレスは招待されていません。管理者に確認してください。')
        setTimeout(() => navigate('/login'), 3000)
        return
      }

      // ✅ セッションとユーザーメタデータを保存
      setSession(session)
      setUserMetadata(metadata)

      // 🎯 auth_user_idがnullの場合にのみauth_user_idを更新
      if (invitedRow.auth_user_id === null) {
        const { error: updateError } = await supabase
          .from(table)
          .update({ auth_user_id: user.id, is_active: true }) // auth_user_idを更新
          .eq('invite_token', metadata.invite_token)
          .eq('store_id', storeId)

        if (updateError) {
          console.error('🔍 招待レコード更新エラー:', updateError)
          setErrorMessage('招待レコードの更新に失敗しました。')
          return
        }
      }

      // 🎯 次のページに遷移
      if (role === 'cast') {
        navigate('/cast/profile')
      } else if (role === 'operator') {
        navigate('/operator/profile')
      } else {
        navigate('/admin/profile')
      }
    }

    handleCallback()
  }, [navigate, setSession, setUserMetadata])

  return (
    <div className="flex items-center justify-center h-screen">
      {errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <p className="text-gray-700">ログイン中です...</p>
      )}
    </div>
  )
}

export default AuthCallback
