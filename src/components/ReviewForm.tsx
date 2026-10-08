import { useState } from 'react';
import { ArrowRight, ChevronDown, Star, Check } from 'lucide-react';
import type { FormEvent } from 'react';
import { useLanguage } from '../i18n/useLanguage';

export default function ReviewForm() {
  const { language } = useLanguage();
  const en = language === 'en';
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const copy = (nl: string, english: string) => en ? english : nl;
  const fieldClass = 'denra-field mt-2 text-sm';
  const labelClass = 'block text-sm font-medium text-[#231A12]';
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
      setRating(0);
    } catch { setStatus('error'); }
  }
  return <section id="review-schrijven" className="denra-review-background scroll-mt-28 px-6 py-12 md:py-16 lg:px-8" aria-labelledby="review-form-title">
    <div className="mx-auto max-w-7xl border-y border-[#bdaa95]/50 py-8 md:py-10">
      <details className="group/review">
        <summary className="flex cursor-pointer list-none flex-col gap-6 marker:content-none sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden">
          <div>
            <div className="mb-3 flex items-center gap-3"><div className="denra-line" /><span className="denra-label">{copy('Uw ervaring', 'Your experience')}</span></div>
            <h2 id="review-form-title" className="font-serif text-3xl font-semibold leading-tight text-[#231A12] md:text-4xl">{copy('Ook geholpen door Denra?', 'Worked with Denra?')}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#6b5d50]">{copy('Vertel ons over uw renovatie. We horen graag hoe u het heeft ervaren.', 'Tell us about your renovation. We would love to hear your experience.')}</p>
          </div>
          <span className="denra-button-secondary shrink-0 self-start sm:self-auto">{copy('Schrijf een review', 'Write a review')}<ChevronDown size={16} className="transition-transform group-open/review:rotate-180" aria-hidden="true" /></span>
        </summary>
        <div className="mt-8 grid gap-8 border-t border-[#bdaa95]/40 pt-8 lg:mt-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:pt-10">
          <aside className="max-w-sm">
            <p className="font-serif text-2xl leading-snug text-[#231A12]">{copy('Een mooi resultaat begint met vertrouwen.', 'A beautiful result begins with trust.')}</p>
            <p className="mt-4 text-sm leading-relaxed text-[#6b5d50]">{copy('Uw ervaring helpt anderen bij de keuze voor hun renovatie.', 'Your experience helps others choose who to trust with their renovation.')}</p>
            <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-[#7a6552]"><Check size={15} className="mt-0.5 shrink-0" aria-hidden="true" />{copy('Elke review wordt gecontroleerd vóór publicatie. Uw e-mailadres blijft privé.', 'Every review is checked before publication. Your email remains private.')}</p>
          </aside>
          <form onSubmit={submit} className="grid min-w-0 gap-5 sm:grid-cols-2">
            <label className={labelClass}>{copy('Naam', 'Name')}<input name="name" placeholder={copy('Uw naam', 'Your name')} autoComplete="name" required minLength={2} maxLength={120} className={fieldClass} /></label>
            <label className={labelClass}>{copy('E-mailadres', 'Email')}<input name="email" placeholder="uw@email.nl" type="email" autoComplete="email" required maxLength={254} className={fieldClass} /></label>
            <label className={labelClass}>{copy('Plaats', 'City')}<input name="city" placeholder={copy('Uw woonplaats', 'Your city')} autoComplete="address-level2" required minLength={2} maxLength={100} className={fieldClass} /></label>
            <label className={labelClass}>{copy('Project', 'Project')}<select name="project" className={fieldClass}>{['Badkamer', 'Toilet', 'Renovatie', 'Aanbouw'].map((p, i) => <option key={p} value={p}>{en ? ['Bathroom', 'Toilet', 'Renovation', 'Extension'][i] : p}</option>)}</select></label>
            <fieldset className="sm:col-span-2">
              <legend className={labelClass}>{copy('Uw beoordeling', 'Your rating')}</legend>
              <div className="mt-2 flex items-center gap-1">{[1, 2, 3, 4, 5].map(n => <label key={n} className="relative flex h-11 w-11 cursor-pointer items-center justify-center text-[#8b6b45]">
                <input className="peer sr-only" type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} required aria-label={`${n} ${copy('van 5 sterren', 'out of 5 stars')}`} />
                <Star size={24} strokeWidth={1.3} fill={rating >= n ? 'currentColor' : 'none'} className="rounded-sm transition-transform hover:scale-110 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#7a6552]" aria-hidden="true" />
              </label>)}<span className="ml-3 text-xs text-[#7a6552]" aria-live="polite">{rating ? `${rating} / 5` : copy('Kies uw sterren', 'Choose your stars')}</span></div>
            </fieldset>
            <label className={`${labelClass} sm:col-span-2`}>{copy('Uw ervaring', 'Your experience')}<textarea name="text" placeholder={copy('Hoe heeft u de samenwerking en het resultaat ervaren?', 'How did you experience the work and the result?')} required minLength={20} maxLength={3000} rows={4} className={`${fieldClass} resize-y`} /></label>
            <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <label className="flex items-start gap-3 text-xs leading-relaxed text-[#6b5d50] sm:col-span-2"><input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#7a6552]" /><span>{copy('Ik ben klant van Denra en geef toestemming om mijn naam, plaats en review na controle te publiceren.', 'I am a Denra customer and consent to publication of my name, city and review after verification.')}</span></label>
            <div className="mt-1 sm:col-span-2"><button disabled={status === 'sending'} className="denra-button-primary w-full disabled:opacity-50 sm:w-auto" type="submit">{status === 'sending' ? copy('Versturen…', 'Sending…') : copy('Verstuur uw review', 'Send your review')}<ArrowRight size={16} aria-hidden="true" /></button></div>
            <p role={status === 'error' ? 'alert' : 'status'} className="text-sm leading-relaxed text-[#6b5d50] sm:col-span-2">{status === 'success' ? copy('Bedankt! Dennis controleert uw review vóór publicatie.', 'Thank you! Dennis will check your review before publication.') : status === 'error' ? copy('Versturen is niet gelukt. Uw tekst staat nog in het formulier; probeer het opnieuw.', 'Could not send your review. Your text is still in the form; please try again.') : ''}</p>
          </form>
        </div>
      </details>
    </div>
  </section>;
}
