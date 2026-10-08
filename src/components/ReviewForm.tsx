import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLanguage } from '../i18n/useLanguage';

export default function ReviewForm() {
  const { language } = useLanguage();
  const en = language === 'en';
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const copy = (nl: string, english: string) => en ? english : nl;
  const fieldClass = 'mt-2 w-full border border-[#bdaa95] bg-white/60 p-3 text-[#231A12] focus:outline-none focus:ring-2 focus:ring-[#7a6552]';
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setStatus('sending');
    try {
      const response = await fetch('/api/review', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fields.get('name'), email: fields.get('email'), city: fields.get('city'), project: fields.get('project'), rating: Number(fields.get('rating')), text: fields.get('text'), website: fields.get('website'), consent: fields.get('consent') === 'on' }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Review not sent');
      setStatus('success');
      form.reset();
    } catch { setStatus('error'); }
  }
  return <section id="review-schrijven" className="bg-[#f6f0e8] px-6 py-16 lg:px-8" aria-labelledby="review-form-title">
    <div className="mx-auto max-w-3xl">
      <h2 id="review-form-title" className="font-serif text-3xl text-[#231A12]">{copy('Deel uw ervaring', 'Share your experience')}</h2>
      <p className="mt-3 text-[#6b5d50]">{copy('Voor klanten van Denra. Dennis controleert iedere inzending. Uw review verschijnt pas na goedkeuring; uw e-mailadres blijft privé.', 'For Denra customers. Dennis checks each submission. Your review is only published after approval; your email remains private.')}</p>
      <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
        <label>{copy('Naam', 'Name')}<input name="name" autoComplete="name" required minLength={2} maxLength={120} className={fieldClass} /></label>
        <label>{copy('E-mailadres', 'Email')}<input name="email" type="email" autoComplete="email" required maxLength={254} className={fieldClass} /></label>
        <label>{copy('Plaats', 'City')}<input name="city" autoComplete="address-level2" required minLength={2} maxLength={100} className={fieldClass} /></label>
        <label>{copy('Project', 'Project')}<select name="project" className={fieldClass}>{['Badkamer', 'Toilet', 'Renovatie', 'Aanbouw'].map((p, i) => <option key={p} value={p}>{en ? ['Bathroom', 'Toilet', 'Renovation', 'Extension'][i] : p}</option>)}</select></label>
        <label>{copy('Beoordeling', 'Rating')}<select name="rating" required defaultValue="" className={fieldClass}><option value="" disabled>{copy('Kies uw beoordeling', 'Choose your rating')}</option>{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></label>
        <label className="sm:col-span-2">{copy('Uw ervaring', 'Your experience')}<textarea name="text" required minLength={20} maxLength={3000} rows={5} className={fieldClass} /></label>
        <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="flex items-start gap-3 sm:col-span-2"><input name="consent" type="checkbox" required className="mt-1 h-5 w-5" /><span>{copy('Ik ben klant van Denra en geef toestemming om mijn naam, plaats en review na controle te publiceren.', 'I am a Denra customer and consent to publication of my name, city and review after verification.')}</span></label>
        <div className="sm:col-span-2"><button disabled={status === 'sending'} className="denra-button-primary disabled:opacity-50" type="submit">{status === 'sending' ? copy('Versturen…', 'Sending…') : copy('Review insturen', 'Submit review')}</button></div>
        <p role={status === 'error' ? 'alert' : 'status'} className="sm:col-span-2 text-[#6b5d50]">{status === 'success' ? copy('Bedankt! Uw review is naar Dennis verstuurd ter controle en is nog niet gepubliceerd.', 'Thank you! Your review has been sent to Dennis for verification and has not been published yet.') : status === 'error' ? copy('Versturen is niet gelukt. Uw tekst is bewaard in het formulier; probeer het opnieuw.', 'Could not send your review. Your text is still in the form; please try again.') : ''}</p>
      </form>
    </div>
  </section>;
}
