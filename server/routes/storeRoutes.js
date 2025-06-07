// server/routes/storeRoutes.js
import express from 'express'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Supabase 管理者クライアント（Service Role）
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET: サブドメインに該当する管理者が存在するか確認
router.get('/is-store-registered/:storeId', async (req, res) => {
  const { storeId } = req.params

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('Supabase listUsers error:', error)
      return res.status(500).json({ error: 'Supabase API error' })
    }

    // ユーザーの中に指定 store_id を持つ管理者がいるか
    const exists = users.users.some(
      (u) => u.user_metadata?.store_id === storeId && u.user_metadata?.role === 'admin'
    )

    return res.json({ isRegistered: exists })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
