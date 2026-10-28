import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { z } from 'zod';
import { calculateEstimate, defaultCalculatorConfig, type CalculatorConfig, type Estimate, type EstimateError } from '../src/lib/calculator.js';
import { calculatorFromRows, type CalculatorOptionRow, type CalculatorRoomRow, type CalculatorTierRow } from '../src/lib/calculatorRows.js';

const configurationSchema = z.object({
  roomType: z.enum(['badkamer', 'wc']),
  length: z.number().finite(),
  width: z.number().finite(),
  optionIds: z.array(z.string().min(1).max(80)).max(30).default([]),
  clientTotal: z.number().int().nonnegative().max(10_000_000).optional(),
});

const requestSchema = z.object({
  language: z.enum(['nl', 'en']).default('nl'),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(10).max(40),
  city: z.string().trim().max(100).optional().default(''),
  service: z.string().trim().min(1).max(100),
  message: z.string().trim().min(10).max(5000),
  configuration: configurationSchema.optional(),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(0).optional(),
});

type QuoteRequest = z.infer<typeof requestSchema>;
type Language = QuoteRequest['language'];

type EmailCopy = {
  noOptions: string; renovation: string; room: string; dimensions: string; area: string; selectedOptions: string; priceEstimate: string; basePrice: string; upTo: string; extraArea: string; vatNote: string; contactDetails: string; name: string; email: string; phone: string; city: string; note: string; thankYou: string; dear: string; confirmation: string; important: string; disclaimer: string; followUp: string; regards: string; newRequest: string; service: string; customerNote: string; adminSubject: string; customerSubject: string; bathroom: string; toilet: string; storedNote: string; mismatch: string;
};

const emailCopy = (language: Language): EmailCopy => language === 'en' ? {
  noOptions: 'No additional options selected.', renovation: 'YOUR RENOVATION', room: 'Room', dimensions: 'Dimensions', area: 'Area', selectedOptions: 'SELECTED OPTIONS', priceEstimate: 'YOUR PRICE ESTIMATE', basePrice: 'Base price', upTo: 'up to', extraArea: 'Additional area', vatNote: 'Indicative starting price including VAT', contactDetails: 'CONTACT DETAILS', name: 'Name', email: 'Email', phone: 'Phone', city: 'City', note: 'Message', thankYou: 'Thank you for your request', dear: 'Dear', confirmation: 'Thank you for your interest in Denra Badkamers. We have received your quote request. Below is a summary of your request.', important: 'IMPORTANT', disclaimer: 'This price is a non-binding indication and not a final quote. The final quote is prepared after a personal conversation and/or an on-site assessment.', followUp: 'We will contact you as soon as possible to discuss your request.', regards: 'Kind regards', newRequest: 'NEW QUOTE REQUEST', service: 'Service', customerNote: 'Customer message', adminSubject: 'New quote request', customerSubject: 'Confirmation of your quote request', bathroom: 'Bathroom', toilet: 'Toilet', storedNote: 'This request is also stored under Aanvragen in the website admin.', mismatch: 'Note: the price shown in the customer\'s browser was {client}. The amount above was recalculated on the server.',
} : {
  noOptions: 'Geen extra opties geselecteerd.', renovation: 'UW RENOVATIE', room: 'Ruimte', dimensions: 'Afmetingen', area: 'Oppervlakte', selectedOptions: 'GESELECTEERDE OPTIES', priceEstimate: 'UW PRIJSINDICATIE', basePrice: 'Basisprijs', upTo: 'tot', extraArea: 'Extra oppervlakte', vatNote: 'Indicatieve vanafprijs incl. btw', contactDetails: 'CONTACTGEGEVENS', name: 'Naam', email: 'E-mail', phone: 'Telefoon', city: 'Plaats', note: 'Opmerking', thankYou: 'Bedankt voor uw aanvraag', dear: 'Beste', confirmation: 'Bedankt voor uw interesse in Denra Badkamers. Wij hebben uw offerteaanvraag goed ontvangen. Hieronder vindt u een overzicht van uw aanvraag.', important: 'BELANGRIJK', disclaimer: 'Deze prijs betreft een vrijblijvende prijsindicatie en is geen definitieve offerte. De definitieve offerte wordt opgesteld na een persoonlijk gesprek en/of opname op locatie.', followUp: 'Wij nemen zo spoedig mogelijk contact met u op om de aanvraag te bespreken.', regards: 'Met vriendelijke groet', newRequest: 'NIEUWE OFFERTEAANVRAAG', service: 'Dienst', customerNote: 'Opmerking klant', adminSubject: 'Nieuwe offerteaanvraag', customerSubject: 'Bevestiging van uw offerteaanvraag', bathroom: 'Badkamer', toilet: 'WC', storedNote: 'Deze aanvraag staat ook onder Aanvragen in het beheer van de website.', mismatch: 'Let op: in de browser van de klant stond {client}. Het bedrag hierboven is op de server opnieuw berekend.',
};

const estimateErrorMessage = (error: EstimateError, language: Language) => {
  const nl = language === 'nl';
  switch (error.code) {
    case 'conflictingOptions': return nl ? 'Twee gekozen opties dekken hetzelfde werk. Pas uw berekening aan en probeer het opnieuw.' : 'Two selected options cover the same work. Adjust your calculation and try again.';
    case 'unknownOption':
    case 'unavailableOption': return nl ? 'Een gekozen optie is niet meer beschikbaar. Open de calculator opnieuw om de berekening bij te werken.' : 'A selected option is no longer available. Reopen the calculator to update your calculation.';
    case 'invalidDimensions': return nl ? 'De afmetingen moeten tussen 0,5 en 20 meter liggen.' : 'The dimensions must be between 0.5 and 20 metres.';
    default: return nl ? 'Deze ruimte kan niet worden berekend.' : 'This room cannot be calculated.';
  }
};

const escapeHtml = (value: string | number) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const euro = (value: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const decimal = (value: number) => new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 2 }).format(value);

function serviceClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? createClient(url, serviceRoleKey, { auth: { persistSession: false } }) : null;
}

// The price list Dennis maintains in the admin; the built-in list when the
// database is not configured. A configured database that cannot be read is
// an error: the server must not confirm a total from a price list it did
// not check.
async function priceList(client: ReturnType<typeof serviceClient>): Promise<CalculatorConfig> {
  if (!client) return defaultCalculatorConfig;
  const [rooms, tiers, options] = await Promise.all([
    client.from('calculator_rooms').select('*'),
    client.from('calculator_tiers').select('*'),
    client.from('calculator_options').select('*'),
  ]);
  if (rooms.error || tiers.error || options.error) throw rooms.error ?? tiers.error ?? options.error;
  if (!rooms.data.length) return defaultCalculatorConfig;
  return calculatorFromRows(rooms.data as CalculatorRoomRow[], tiers.data as CalculatorTierRow[], options.data as CalculatorOptionRow[]);
}

const row = (label: string, value: string, padding = '6px 0') => `<tr><td style="padding:${padding};color:#6B5D50;">${label}</td><td align="right" style="padding:${padding};color:#231A12;font-weight:600;">${value}</td></tr>`;

function quoteDetails(estimate: Estimate | null, language: Language, copy: EmailCopy) {
  if (!estimate) return '';
  const label = (option: Estimate['options'][number]) => escapeHtml(language === 'en' ? option.labelEn || option.labelNl : option.labelNl);
  const options = estimate.options.length
    ? estimate.options.map((option) => row(label(option), `+ ${euro(option.price)}`, '8px 0')).join('')
    : `<tr><td colspan="2" style="padding:8px 0;color:#6B5D50;">${copy.noOptions}</td></tr>`;
  const areaLines = estimate.areaLines.map((line) => row(`${copy.extraArea} ${decimal(line.squareMetres)} m² × ${euro(line.ratePerM2)}`, `+ ${euro(line.amount)}`)).join('');
  return `<tr><td colspan="2" style="padding:28px 0 12px;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">${copy.renovation}</td></tr>
    ${row(copy.room, estimate.roomType === 'wc' ? copy.toilet : copy.bathroom)}
    ${row(copy.dimensions, `${decimal(estimate.length)} m × ${decimal(estimate.width)} m`)}
    ${row(copy.area, `${decimal(estimate.area)} m²`)}
    ${row(`${copy.basePrice} (${copy.upTo} ${decimal(estimate.includedArea)} m²)`, euro(estimate.basePrice))}
    ${areaLines}
    <tr><td colspan="2" style="padding-top:20px;border-top:1px solid #cfbca7;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">${copy.selectedOptions}</td></tr>${options}
    <tr><td colspan="2" style="padding-top:24px;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#231A12;"><tr><td style="padding:22px 24px;color:#f6f0e8;"><div style="font-size:11px;letter-spacing:1.5px;color:#cfbca7;font-weight:700;">${copy.priceEstimate}</div><div style="font-family:Georgia,serif;font-size:30px;font-weight:700;padding-top:6px;">${euro(estimate.total)}</div><div style="font-size:12px;color:#cfbca7;padding-top:4px;">${copy.vatNote}</div></td></tr></table></td></tr>`;
}

const emailShell = (content: string, siteUrl: string, language: Language) => `<!doctype html><html lang="${language}"><body style="margin:0;padding:0;background:#f4efe8;font-family:Arial,sans-serif;color:#231A12;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f4efe8;"><tr><td align="center" style="padding:32px 16px;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;background:#faf6f0;border:1px solid #cfbca7;"><tr><td style="padding:32px 32px 12px;"><img src="${escapeHtml(siteUrl)}/denralogobg.png" alt="Denra Badkamers" width="160" style="display:block;max-width:160px;height:auto;"></td></tr><tr><td style="padding:12px 32px 32px;">${content}</td></tr></table></td></tr></table></body></html>`;

function customerConfirmationEmail(data: QuoteRequest, estimate: Estimate | null, siteUrl: string) {
  const copy = emailCopy(data.language);
  return emailShell(`<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:30px;line-height:1.2;color:#231A12;">${copy.thankYou}</h1><p style="margin:0 0 14px;line-height:1.6;">${copy.dear} ${escapeHtml(data.name)},</p><p style="margin:0 0 20px;line-height:1.6;color:#6B5D50;">${copy.confirmation}</p><table width="100%" cellpadding="0" cellspacing="0" role="presentation">${quoteDetails(estimate, data.language, copy)}<tr><td colspan="2" style="padding-top:24px;border-top:1px solid #cfbca7;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">${copy.contactDetails}</td></tr><tr><td colspan="2" style="padding-top:10px;color:#6B5D50;line-height:1.7;">${copy.name}: ${escapeHtml(data.name)}<br>${copy.email}: ${escapeHtml(data.email)}<br>${copy.phone}: ${escapeHtml(data.phone)}${data.city ? `<br>${copy.city}: ${escapeHtml(data.city)}` : ''}<br><br>${copy.note}:<br>${escapeHtml(data.message).replace(/\n/g, '<br>')}</td></tr></table><div style="margin-top:28px;padding-top:20px;border-top:1px solid #cfbca7;color:#6B5D50;font-size:13px;line-height:1.6;"><strong style="color:#231A12;">${copy.important}</strong><br>${copy.disclaimer}<br><br>${copy.followUp}<br><br>${copy.regards},<br>Denra Badkamers</div>`, siteUrl, data.language);
}

// Dennis reads the notification in Dutch, whatever language the customer used.
function adminQuoteRequestEmail(data: QuoteRequest, estimate: Estimate | null, siteUrl: string, stored: boolean) {
  const copy = emailCopy('nl');
  const clientTotal = data.configuration?.clientTotal;
  const mismatch = estimate && clientTotal !== undefined && clientTotal !== estimate.total
    ? `<p style="margin:16px 0 0;padding:12px;border:1px solid #a33b32;color:#a33b32;font-size:13px;">${copy.mismatch.replace('{client}', euro(clientTotal))}</p>` : '';
  return emailShell(`<p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;color:#7a6552;font-weight:700;">${copy.newRequest}</p><h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;color:#231A12;">${escapeHtml(data.name)}</h1><table width="100%" cellpadding="0" cellspacing="0" role="presentation">${row(copy.email, escapeHtml(data.email))}${row(copy.phone, escapeHtml(data.phone))}${data.city ? row(copy.city, escapeHtml(data.city)) : ''}${row(copy.service, escapeHtml(data.service), '6px 0 20px')}${quoteDetails(estimate, 'nl', copy)}<tr><td colspan="2" style="padding-top:28px;color:#6B5D50;line-height:1.6;"><strong style="color:#231A12;">${copy.customerNote}</strong><br>${escapeHtml(data.message).replace(/\n/g, '<br>')}</td></tr></table>${mismatch}${stored ? `<p style="margin:24px 0 0;color:#8A7A6A;font-size:12px;">${copy.storedNote}</p>` : ''}`, siteUrl, 'nl');
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader('Cache-Control', 'no-store');
  const language: Language = request.body?.language === 'en' ? 'en' : 'nl';
  const error = (nl: string, en: string) => language === 'en' ? en : nl;
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: error('Methode niet toegestaan.', 'Method not allowed.') });
  }

  // Only the website itself may post here (same check as the review form).
  const origin = request.headers.origin;
  const allowedOrigins = new Set(['https://denrabadkamers.nl', 'https://www.denrabadkamers.nl']);
  if (process.env.PUBLIC_SITE_URL) allowedOrigins.add(new URL(process.env.PUBLIC_SITE_URL).origin);
  if (process.env.VERCEL_URL) allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
  if (origin && !allowedOrigins.has(origin)) return response.status(403).json({ error: error('Niet toegestaan.', 'Forbidden.') });

  const parsedRequest = requestSchema.safeParse(request.body);
  if (!parsedRequest.success) return response.status(400).json({ error: error('Controleer de ingevulde gegevens en probeer het opnieuw.', 'Check the entered details and try again.'), code: 'INVALID_REQUEST' });
  const data = parsedRequest.data;

  const client = serviceClient();
  // Every request also e-mails a confirmation to the given address, so limit
  // how often one address can be used: a real customer never needs more.
  if (client) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await client.from('quote_requests').select('id', { count: 'exact', head: true }).eq('email', data.email).gte('created_at', since);
    if (countError) console.error('Could not check recent requests', countError);
    else if ((count ?? 0) >= 3) return response.status(429).json({ error: error('U heeft het afgelopen uur al meerdere aanvragen gestuurd. Wij nemen contact met u op; u kunt ons ook bellen of WhatsAppen.', 'You have already sent several requests in the past hour. We will contact you; you can also call or WhatsApp us.'), code: 'TOO_MANY_REQUESTS' });
  }

  let estimate: Estimate | null = null;
  if (data.configuration) {
    let prices: CalculatorConfig;
    try {
      prices = await priceList(client);
    } catch (loadError) {
      console.error('Could not load the calculator price list', loadError);
      return response.status(503).json({ error: error('De prijsberekening kon niet worden gecontroleerd. Probeer het over een paar minuten opnieuw.', 'The price calculation could not be checked. Please try again in a few minutes.'), code: 'PRICES_UNAVAILABLE' });
    }
    const result = calculateEstimate(prices, data.configuration);
    if (!result.ok) return response.status(422).json({ error: estimateErrorMessage(result.error, data.language), code: 'INVALID_CONFIGURATION' });
    estimate = result.estimate;
  }

  // Store first, so a request is never lost when e-mail fails.
  let requestId: string | null = null;
  if (client) {
    const { data: stored, error: storeError } = await client.from('quote_requests').insert({
      language: data.language,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      service: data.service,
      message: data.message,
      room_type: estimate?.roomType ?? null,
      length_m: estimate?.length ?? null,
      width_m: estimate?.width ?? null,
      area_m2: estimate?.area ?? null,
      selected_options: estimate?.options.map((option) => ({ id: option.id, label: option.labelNl, price: option.price })) ?? [],
      estimate_total: estimate?.total ?? null,
      client_total: data.configuration?.clientTotal ?? null,
    }).select('id').single();
    if (storeError) console.error('Could not store quote request', storeError);
    else requestId = stored.id;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const setEmailStatus = async (status: 'sent' | 'partly_sent' | 'failed' | 'not_configured') => {
    if (!client || !requestId) return;
    const { error: updateError } = await client.from('quote_requests').update({ email_status: status }).eq('id', requestId);
    if (updateError) console.error('Could not record e-mail status', updateError);
  };

  if (!apiKey || !from) {
    await setEmailStatus('not_configured');
    if (requestId) return response.status(200).json({ success: true, total: estimate?.total ?? null, confirmationSent: false });
    return response.status(503).json({ error: error('De e-mailservice is nog niet geconfigureerd. Bel of WhatsApp ons gerust.', 'The email service has not been configured yet. Feel free to call or WhatsApp us.'), code: 'EMAIL_NOT_CONFIGURED' });
  }

  const recipient = process.env.QUOTE_RECIPIENT_EMAIL ?? 'info@denrabadkamers.nl';
  const siteUrl = (process.env.PUBLIC_SITE_URL ?? 'https://denrabadkamers.nl').replace(/\/$/, '');
  const resend = new Resend(apiKey);
  const copy = emailCopy(data.language);
  const [adminResult, customerResult] = await Promise.allSettled([
    resend.emails.send({ from, to: recipient, replyTo: data.email, subject: `${emailCopy('nl').adminSubject} - ${data.name}`, html: adminQuoteRequestEmail(data, estimate, siteUrl, Boolean(requestId)) }),
    resend.emails.send({ from, to: data.email, subject: `${copy.customerSubject} | Denra Badkamers`, html: customerConfirmationEmail(data, estimate, siteUrl) }),
  ]);
  const delivered = (result: typeof adminResult) => result.status === 'fulfilled' && !result.value.error;
  const adminDelivered = delivered(adminResult);
  const customerDelivered = delivered(customerResult);
  for (const result of [adminResult, customerResult]) {
    if (!delivered(result)) console.error('Could not send quote e-mail', result.status === 'rejected' ? result.reason : result.value.error);
  }
  await setEmailStatus(adminDelivered && customerDelivered ? 'sent' : adminDelivered || customerDelivered ? 'partly_sent' : 'failed');

  // Dennis has the request when it is stored or his notification arrived.
  if (requestId || adminDelivered) return response.status(200).json({ success: true, total: estimate?.total ?? null, confirmationSent: customerDelivered });
  return response.status(502).json({ error: error('Versturen is niet gelukt. Uw gegevens staan nog in het formulier; probeer het opnieuw of bel ons.', 'Could not send your request. Your details are still in the form; please try again or call us.'), code: 'DELIVERY_FAILED' });
}
