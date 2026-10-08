import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, randomBytes } from 'node:crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const reviewSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  city: z.string().trim().min(2).max(100),
  project: z.enum(['Badkamer', 'Toilet', 'Renovatie', 'Aanbouw']),
  rating: z.number().int().min(1).max(5),
  text: z.string().trim().min(20).max(3000),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

type ReviewSubmission = z.infer<typeof reviewSchema>;

const actionTokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

function reviewClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new Error('Review storage is not configured.');
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

const escapeHtml = (value: string | number) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

function reviewEmail(data: ReviewSubmission, approveUrl: string, deleteUrl: string) {
  const details = [
    ['Naam', data.name],
    ['E-mail', data.email],
    ['Plaats', data.city],
    ['Project', data.project],
    ['Score', `${data.rating}/5`],
  ].map(([label, value]) => `<tr><td style="padding:6px 16px 6px 0;color:#6B5D50;">${label}</td><td style="padding:6px 0;color:#231A12;font-weight:600;">${escapeHtml(value)}</td></tr>`).join('');

  return `<!doctype html><html lang="nl"><body style="margin:0;padding:24px;background:#f4efe8;font-family:Arial,sans-serif;color:#231A12;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;background:#faf6f0;border:1px solid #cfbca7;"><tr><td style="padding:32px;"><p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">REVIEW TER BEOORDELING</p><h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;">${escapeHtml(data.name)}</h1><table width="100%" cellpadding="0" cellspacing="0" role="presentation">${details}</table><p style="margin:24px 0;line-height:1.6;color:#6B5D50;">${escapeHtml(data.text).replace(/\n/g, '<br>')}</p><p style="margin:0 0 20px;font-size:13px;line-height:1.5;color:#6B5D50;">Kies een actie. De volgende pagina vraagt nog om bevestiging; alleen het openen van deze e-mail verandert niets.</p><p style="margin:0 0 12px;"><a href="${escapeHtml(approveUrl)}" style="display:inline-block;padding:13px 20px;background:#231A12;color:#f6f0e8;text-decoration:none;font-weight:700;">Review goedkeuren</a></p><p style="margin:0;"><a href="${escapeHtml(deleteUrl)}" style="display:inline-block;padding:13px 20px;border:1px solid #a33b32;color:#a33b32;text-decoration:none;font-weight:700;">Review verwijderen</a></p></td></tr></table></td></tr></table></body></html>`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method === 'GET') {
    if (request.query.published !== '1') return response.status(400).json({ error: 'Invalid review request.' });

    try {
      const { data, error } = await reviewClient()
        .from('reviews')
        .select('id, name, city, rating, project, text, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;

      return response.status(200).json({
        reviews: data.map((review) => ({
          id: review.id,
          name: review.name,
          city: review.city,
          rating: review.rating,
          project: review.project,
          text: review.text,
          createdAt: review.created_at,
        })),
      });
    } catch (error) {
      console.error('Could not load published reviews', error);
      return response.status(503).json({ error: 'Published reviews are temporarily unavailable.' });
    }
  }
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }
  const origin = request.headers.origin;
  const allowedOrigins = new Set(['https://denrabadkamers.nl', 'https://www.denrabadkamers.nl']);
  if (process.env.PUBLIC_SITE_URL) allowedOrigins.add(new URL(process.env.PUBLIC_SITE_URL).origin);
  if (process.env.VERCEL_URL) allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
  if (origin && !allowedOrigins.has(origin)) return response.status(403).json({ error: 'Forbidden' });
  const parsed = reviewSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: 'Invalid review', code: 'INVALID_REVIEW' });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return response.status(503).json({ error: 'Email service unavailable', code: 'EMAIL_NOT_CONFIGURED' });
  const data = parsed.data;
  const actionToken = randomBytes(32).toString('base64url');
  const siteUrl = (process.env.PUBLIC_SITE_URL ?? 'https://denrabadkamers.nl').replace(/\/$/, '');
  const actionUrl = new URL('/api/review-action', siteUrl);
  actionUrl.searchParams.set('token', actionToken);

  let reviewId: string | undefined;
  try {
    const { data: review, error: storageError } = await reviewClient()
      .from('reviews')
      .insert({
        name: data.name,
        email: data.email,
        city: data.city,
        project: data.project,
        rating: data.rating,
        text: data.text,
        action_token_hash: actionTokenHash(actionToken),
      })
      .select('id')
      .single();
    if (storageError) throw storageError;
    reviewId = review.id;

    const approveUrl = new URL(actionUrl);
    approveUrl.searchParams.set('action', 'approve');
    const deleteUrl = new URL(actionUrl);
    deleteUrl.searchParams.set('action', 'delete');
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: process.env.REVIEW_RECIPIENT_EMAIL ?? process.env.QUOTE_RECIPIENT_EMAIL ?? 'info@denrabadkamers.nl',
      replyTo: data.email,
      subject: `Review ter goedkeuring - ${data.name}`,
      html: reviewEmail(data, approveUrl.toString(), deleteUrl.toString()),
    });
    if (error) throw error;
    return response.status(200).json({ success: true, status: 'pending' });
  } catch (error) {
    if (reviewId) {
      const { error: deleteError } = await reviewClient().from('reviews').delete().eq('id', reviewId);
      if (deleteError) console.error('Could not remove undelivered review', deleteError);
    }
    console.error('Could not store or deliver review', error);
    return response.status(502).json({ error: 'Could not send review', code: 'REVIEW_DELIVERY_FAILED' });
  }
}
