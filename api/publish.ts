import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// "Website bijwerken" in the admin: starts a new build on Vercel (deploy hook),
// which bakes Dennis's latest texts, photos, colours and projects into the
// pages (scripts/prerender.mjs). Only a logged-in admin may start it.

const lastPublishedKey = 'publish.lastAt';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Methode niet toegestaan.' });
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return response.status(503).json({ error: 'De database is nog niet gekoppeld.', code: 'NOT_CONFIGURED' });
  const client = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

  // Who is asking: the admin's own login token, checked by Supabase itself.
  const token = /^Bearer (.+)$/.exec(request.headers.authorization ?? '')?.[1];
  if (!token) return response.status(401).json({ error: 'Log opnieuw in.' });
  const { data: user, error: userError } = await client.auth.getUser(token);
  if (userError || !user.user) return response.status(401).json({ error: 'Log opnieuw in.' });
  const { data: admin, error: adminError } = await client.from('admin_users').select('user_id').eq('user_id', user.user.id).maybeSingle();
  if (adminError) return response.status(503).json({ error: 'Kon niet controleren of u beheerder bent. Probeer het zo opnieuw.' });
  if (!admin) return response.status(403).json({ error: 'Alleen een beheerder kan de website bijwerken.' });

  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return response.status(503).json({ error: 'Website bijwerken is nog niet ingesteld. Uw wijzigingen staan wel al op de website.', code: 'HOOK_NOT_CONFIGURED' });

  // One build at a time is plenty: a click within two minutes of the last one is not repeated.
  const { data: last } = await client.from('site_content').select('value_nl').eq('key', lastPublishedKey).maybeSingle();
  const lastAt = last?.value_nl ? Date.parse(last.value_nl) : 0;
  if (Date.now() - lastAt < 2 * 60 * 1000) return response.status(200).json({ success: true, startedAt: last?.value_nl, alreadyRunning: true });

  const started = await fetch(hook, { method: 'POST' }).catch(() => null);
  if (!started?.ok) return response.status(502).json({ error: 'Vercel reageerde niet. Probeer het over een paar minuten opnieuw.' });

  const startedAt = new Date().toISOString();
  const { error: saveError } = await client.from('site_content').upsert({ key: lastPublishedKey, value_nl: startedAt, value_en: '' });
  if (saveError) console.error('Could not record the publish time', saveError);
  return response.status(200).json({ success: true, startedAt });
}
