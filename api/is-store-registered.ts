// api/is-store-registered.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!VITE_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const subdomain = req.query.subdomain;

  if (!subdomain || typeof subdomain !== 'string') {
    return res.status(400).json({ error: 'Missing subdomain' });
  }

  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('[Supabase Admin Error]', error.message);
      return res.status(500).json({ error: 'Failed to list users' });
    }

    const exists = data.users.some(
      (user) => String(user.user_metadata?.store_id || '').trim() === subdomain
    );

    return res.status(200).json({ exists });
  } catch (err) {
    console.error('[Handler Error]', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
