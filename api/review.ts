import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
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

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method === 'GET') {
    const configured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
    return response.status(configured ? 200 : 503).json({ available: configured, code: configured ? 'READY' : 'EMAIL_NOT_CONFIGURED' });
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
  // No public write endpoint: Dennis receives submissions for manual verification.
  // Customer email stays private and is never added to the public review data.
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: process.env.REVIEW_RECIPIENT_EMAIL ?? process.env.QUOTE_RECIPIENT_EMAIL ?? 'info@denrabadkamers.nl',
      replyTo: data.email,
      subject: `Review ter goedkeuring - ${data.name}`,
      text: `Nieuwe review — nog NIET gepubliceerd. Controleer of dit een echte klant is en bevestig toestemming voordat de review wordt toegevoegd.\n\nNaam: ${data.name}\nE-mail (privé): ${data.email}\nPlaats: ${data.city}\nProject: ${data.project}\nScore: ${data.rating}/5\n\n${data.text}\n\nKlant heeft toestemming gegeven voor publicatie van naam, plaats en review.`,
    });
    if (error) {
      console.error('Review delivery rejected by email provider', { name: error.name, message: error.message });
      return response.status(502).json({ error: 'Could not send review', code: 'EMAIL_DELIVERY_FAILED' });
    }
    return response.status(200).json({ success: true, status: 'pending' });
  } catch (error) {
    console.error('Review delivery failed', error instanceof Error ? error.message : 'Unknown email service error');
    return response.status(502).json({ error: 'Could not send review', code: 'EMAIL_DELIVERY_FAILED' });
  }
}
