import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { z } from 'zod';

const quoteOptionSchema = z.object({
  id: z.string().min(1).max(80),
  label: z.string().min(1).max(120),
  price: z.number().nonnegative().max(100000),
});

const requestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(10).max(40),
  service: z.string().trim().min(1).max(100),
  message: z.string().trim().min(10).max(5000),
  roomType: z.enum(['badkamer', 'wc']).optional(),
  length: z.number().positive().max(20).optional(),
  width: z.number().positive().max(20).optional(),
  area: z.number().positive().max(400).optional(),
  selectedOptions: z.array(quoteOptionSchema).max(30).default([]),
  totalPrice: z.number().nonnegative().max(1000000).optional(),
}).superRefine((data, context) => {
  const configurationValues = [data.roomType, data.length, data.width, data.area, data.totalPrice];
  if (configurationValues.some((value) => value !== undefined) && configurationValues.some((value) => value === undefined)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'Onvolledige prijsberekening.' });
  }
});

type QuoteRequest = z.infer<typeof requestSchema>;

const escapeHtml = (value: string | number) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const euro = (value: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

const hasQuote = (data: QuoteRequest): data is QuoteRequest & Required<Pick<QuoteRequest, 'roomType' | 'length' | 'width' | 'area' | 'totalPrice'>> => (
  data.roomType !== undefined && data.length !== undefined && data.width !== undefined && data.area !== undefined && data.totalPrice !== undefined
);

const quoteDetails = (data: QuoteRequest) => {
  if (!hasQuote(data)) return '';
  const options = data.selectedOptions.length
    ? data.selectedOptions.map((option) => `<tr><td style="padding:8px 0;color:#6B5D50;">${escapeHtml(option.label)}</td><td align="right" style="padding:8px 0;color:#231A12;font-weight:600;">+ ${euro(option.price)}</td></tr>`).join('')
    : '<tr><td style="padding:8px 0;color:#6B5D50;">Geen extra opties geselecteerd.</td></tr>';
  return `<tr><td style="padding:28px 0 12px;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">UW RENOVATIE</td></tr>
    <tr><td style="padding:6px 0;color:#6B5D50;">Ruimte</td><td align="right" style="padding:6px 0;color:#231A12;font-weight:600;text-transform:capitalize;">${escapeHtml(data.roomType)}</td></tr>
    <tr><td style="padding:6px 0;color:#6B5D50;">Afmetingen</td><td align="right" style="padding:6px 0;color:#231A12;font-weight:600;">${escapeHtml(data.length)} m × ${escapeHtml(data.width)} m</td></tr>
    <tr><td style="padding:6px 0 20px;color:#6B5D50;">Oppervlakte</td><td align="right" style="padding:6px 0 20px;color:#231A12;font-weight:600;">${escapeHtml(data.area)} m²</td></tr>
    <tr><td colspan="2" style="border-top:1px solid #cfbca7;"></td></tr>
    <tr><td colspan="2" style="padding-top:24px;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">GESELECTEERDE OPTIES</td></tr>${options}
    <tr><td colspan="2" style="padding-top:24px;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#231A12;"><tr><td style="padding:22px 24px;color:#f6f0e8;"><div style="font-size:11px;letter-spacing:1.5px;color:#cfbca7;font-weight:700;">UW PRIJSINDICATIE</div><div style="font-family:Georgia,serif;font-size:30px;font-weight:700;padding-top:6px;">${euro(data.totalPrice)}</div></td></tr></table></td></tr>`;
};

const emailShell = (content: string, siteUrl: string) => `<!doctype html><html lang="nl"><body style="margin:0;padding:0;background:#f4efe8;font-family:Arial,sans-serif;color:#231A12;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4efe8;"><tr><td align="center" style="padding:32px 16px;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;background:#faf6f0;border:1px solid #cfbca7;"><tr><td style="padding:32px 32px 12px;"><img src="${escapeHtml(siteUrl)}/denralogobg.png" alt="Denra Badkamers" width="160" style="display:block;max-width:160px;height:auto;"></td></tr><tr><td style="padding:12px 32px 32px;">${content}</td></tr></table></td></tr></table></body></html>`;

const customerConfirmationEmail = (data: QuoteRequest, siteUrl: string) => emailShell(`<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:30px;line-height:1.2;color:#231A12;">Bedankt voor uw aanvraag</h1><p style="margin:0 0 14px;line-height:1.6;">Beste ${escapeHtml(data.name)},</p><p style="margin:0 0 20px;line-height:1.6;color:#6B5D50;">Bedankt voor uw interesse in Denra Badkamers. Wij hebben uw offerteaanvraag goed ontvangen. Hieronder vindt u een overzicht van uw aanvraag.</p><table width="100%" cellpadding="0" cellspacing="0" role="presentation">${quoteDetails(data)}<tr><td colspan="2" style="border-top:1px solid #cfbca7;"></td></tr><tr><td colspan="2" style="padding-top:24px;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">CONTACTGEGEVENS</td></tr><tr><td colspan="2" style="padding-top:10px;color:#6B5D50;line-height:1.7;">Naam: ${escapeHtml(data.name)}<br>E-mail: ${escapeHtml(data.email)}<br>Telefoon: ${escapeHtml(data.phone)}<br><br>Opmerking:<br>${escapeHtml(data.message).replace(/\n/g, '<br>')}</td></tr></table><div style="margin-top:28px;padding-top:20px;border-top:1px solid #cfbca7;color:#6B5D50;font-size:13px;line-height:1.6;"><strong style="color:#231A12;">BELANGRIJK</strong><br>Deze prijs betreft een vrijblijvende prijsindicatie en is geen definitieve offerte. De definitieve offerte wordt opgesteld na een persoonlijk gesprek en/of opname op locatie.<br><br>Wij nemen zo spoedig mogelijk contact met u op om de aanvraag te bespreken.<br><br>Met vriendelijke groet,<br>Denra Badkamers</div>`, siteUrl);

const adminQuoteRequestEmail = (data: QuoteRequest, siteUrl: string) => emailShell(`<p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">NIEUWE OFFERTEAANVRAAG</p><h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;color:#231A12;">${escapeHtml(data.name)}</h1><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="padding:6px 0;color:#6B5D50;">E-mail</td><td align="right" style="padding:6px 0;color:#231A12;font-weight:600;">${escapeHtml(data.email)}</td></tr><tr><td style="padding:6px 0;color:#6B5D50;">Telefoon</td><td align="right" style="padding:6px 0;color:#231A12;font-weight:600;">${escapeHtml(data.phone)}</td></tr><tr><td style="padding:6px 0 20px;color:#6B5D50;">Dienst</td><td align="right" style="padding:6px 0 20px;color:#231A12;font-weight:600;">${escapeHtml(data.service)}</td></tr>${quoteDetails(data)}<tr><td colspan="2" style="padding-top:28px;color:#6B5D50;line-height:1.6;"><strong style="color:#231A12;">Opmerking klant</strong><br>${escapeHtml(data.message).replace(/\n/g, '<br>')}</td></tr></table>`, siteUrl);

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Methode niet toegestaan.' });

  const parsedRequest = requestSchema.safeParse(request.body);
  if (!parsedRequest.success) return response.status(400).json({ error: 'Controleer de ingevulde gegevens en probeer het opnieuw.' });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipient = process.env.QUOTE_RECIPIENT_EMAIL ?? 'info@denrabadkamers.nl';
  if (!apiKey || !from) return response.status(500).json({ error: 'De e-mailservice is nog niet geconfigureerd.' });

  const data = parsedRequest.data;
  const siteUrl = (process.env.PUBLIC_SITE_URL ?? 'https://denrabadkamers.nl').replace(/\/$/, '');
  const resend = new Resend(apiKey);

  try {
    const results = await Promise.all([
      resend.emails.send({ from, to: recipient, replyTo: data.email, subject: `Nieuwe offerteaanvraag - ${data.name}`, html: adminQuoteRequestEmail(data, siteUrl) }),
      resend.emails.send({ from, to: data.email, subject: 'Bevestiging van uw offerteaanvraag | Denra Badkamers', html: customerConfirmationEmail(data, siteUrl) }),
    ]);
    if (results.some((result) => result.error)) throw new Error('Resend kon de e-mail niet versturen.');
    return response.status(200).json({ success: true });
  } catch {
    return response.status(502).json({ error: 'Versturen is niet gelukt. Probeer het opnieuw.' });
  }
}