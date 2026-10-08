import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const actionValues = ['approve', 'delete'] as const;
type Action = (typeof actionValues)[number];

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

function actionTokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function reviewClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error('Review storage is not configured.');
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

function page(title: string, message: string, form?: string) {
  return `<!doctype html><html lang="nl"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;padding:32px 16px;background:#f4efe8;font-family:Arial,sans-serif;color:#231A12;"><main style="max-width:560px;margin:auto;padding:32px;background:#faf6f0;border:1px solid #cfbca7;"><p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">DENRA BADKAMERS</p><h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:30px;">${escapeHtml(title)}</h1><p style="margin:0;color:#6B5D50;line-height:1.6;">${escapeHtml(message)}</p>${form ?? ''}</main></body></html>`;
}

function actionForm(action: Action, token: string) {
  const isApproval = action === 'approve';
  return `<form method="post" style="margin-top:28px;"><input type="hidden" name="action" value="${action}"><input type="hidden" name="token" value="${escapeHtml(token)}"><button type="submit" style="padding:13px 20px;border:0;background:${isApproval ? '#231A12' : '#a33b32'};color:#f6f0e8;font:inherit;font-weight:700;cursor:pointer;">${isApproval ? 'Ja, publiceer deze review' : 'Ja, verwijder deze review'}</button></form>`;
}

function parseAction(value: unknown): Action | undefined {
  return typeof value === 'string' && actionValues.includes(value as Action) ? value as Action : undefined;
}

function parseToken(value: unknown): string | undefined {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : undefined;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');

  const source = request.method === 'POST' ? request.body : request.query;
  const action = parseAction(source.action);
  const token = parseToken(source.token);
  if (!action || !token) return response.status(400).send(page('Ongeldige link', 'Deze moderatielink is ongeldig.'));

  if (request.method === 'GET') {
    const title = action === 'approve' ? 'Review goedkeuren?' : 'Review verwijderen?';
    const message = action === 'approve'
      ? 'Na bevestiging wordt deze review direct op de website gepubliceerd.'
      : 'Na bevestiging wordt deze review van de website verwijderd.';
    return response.status(200).send(page(title, message, actionForm(action, token)));
  }
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return response.status(405).send(page('Methode niet toegestaan', 'Gebruik de link uit uw e-mail om een review te beheren.'));
  }

  try {
    const client = reviewClient();
    const { data: review, error: lookupError } = await client
      .from('reviews')
      .select('id, status')
      .eq('action_token_hash', actionTokenHash(token))
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!review) return response.status(404).send(page('Link niet gevonden', 'Deze moderatielink is verlopen of al verwijderd.'));

    if (action === 'approve') {
      if (review.status === 'deleted') return response.status(409).send(page('Review is verwijderd', 'Een verwijderde review kan niet opnieuw worden gepubliceerd.'));
      if (review.status === 'approved') return response.status(200).send(page('Review is al gepubliceerd', 'Er is geen verdere actie nodig.'));

      const { error } = await client.from('reviews').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', review.id).eq('status', 'pending');
      if (error) throw error;
      return response.status(200).send(page('Review gepubliceerd', 'De review staat nu op de website.'));
    }

    if (review.status === 'deleted') return response.status(200).send(page('Review is al verwijderd', 'Er is geen verdere actie nodig.'));
    const { error } = await client.from('reviews').update({ status: 'deleted' }).eq('id', review.id).neq('status', 'deleted');
    if (error) throw error;
    return response.status(200).send(page('Review verwijderd', 'De review staat niet meer op de website.'));
  } catch (error) {
    console.error('Could not moderate review', error);
    return response.status(503).send(page('Actie niet uitgevoerd', 'De reviewservice is tijdelijk niet beschikbaar. Probeer het later opnieuw.'));
  }
}
