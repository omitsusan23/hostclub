// server/routes/isStoreRegistered.ts
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const supabaseService = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

router.get('/', async (req, res) => {
  const { store_id } = req.query;
  if (!store_id || typeof store_id !== 'string') {
    return res.status(400).json({ error: 'Missing store_id' });
  }

  try {
    const { data, error } = await supabaseService.auth.admin.listUsers();
    if (error) throw error;

    const matched = data.users.some(
      (user) => user.user_metadata?.store_id === store_id
    );

    return res.json({ exists: matched });
  } catch (err) {
    console.error('Store check failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
