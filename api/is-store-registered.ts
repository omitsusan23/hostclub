// api/is-store-registered.ts (Vercel Edge Function 対応)
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
      (user) => user.user_metadata?.store_id === subdomain
    );

    return res.status(200).json({ exists });
  } catch (err) {
    console.error('[Handler Error]', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
