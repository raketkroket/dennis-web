import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { calculateEstimate } from '../lib/calculator';
import { useSiteContent } from '../content/SiteContentProvider';
import type { QuoteConfiguration } from '../types/quote';
import { useLanguage } from '../i18n/useLanguage';
import EstimateBreakdown from './EstimateBreakdown';

type FormData = { name: string; email: string; phone: string; city: string; service: string; message: string; website: string };

interface ContactFormProps {
  quote: QuoteConfiguration | null;
  onRemoveQuote: () => void;
  defaultService?: string;
  defaultMessage?: string;
}

const services = ['badkamer', 'wc', 'binnen', 'stucwerk', 'schilderwerk', 'vloeren', 'plafond'] as const;

export default function ContactForm({ quote, onRemoveQuote, defaultService = '', defaultMessage = '' }: ContactFormProps) {
  const { t, language } = useLanguage();
  const { calculator } = useSiteContent();
  const [serverError, setServerError] = useState('');
  const [sent, setSent] = useState<null | { confirmationSent: boolean }>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const estimateResult = quote ? calculateEstimate(calculator, quote) : null;
  const estimate = estimateResult?.ok ? estimateResult.estimate : null;

  const schema = z.object({
    name: z.string().trim().min(2, t('form.nameRequired')).max(120),
    email: z.string().trim().email(t('form.invalidEmail')).max(254),
    phone: z.string().trim().min(10, t('form.phoneRequired')).max(40),
    city: z.string().trim().max(100),
    service: z.string().min(1, t('form.serviceRequired')),
    message: z.string().trim().min(10, t('form.messageShort')).max(5000),
    website: z.string().max(0),
  });

  const { register, handleSubmit, reset, setValue, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '', city: '', service: quote?.roomType ?? defaultService, message: defaultMessage, website: '' },
  });

  // The page can learn about a calculation or project after the first render.
  useEffect(() => {
    if (quote?.roomType) setValue('service', quote.roomType);
    else if (defaultService && !getValues('service')) setValue('service', defaultService);
  }, [quote?.roomType, defaultService, setValue, getValues]);
  useEffect(() => {
    if (defaultMessage && !getValues('message')) setValue('message', defaultMessage);
  }, [defaultMessage, setValue, getValues]);

  useEffect(() => {
    if (sent) sentRef.current?.focus();
  }, [sent]);
  useEffect(() => {
    if (serverError) errorRef.current?.focus();
  }, [serverError]);

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      const response = await fetch('/api/offerte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          language,
          configuration: estimate && quote ? { ...quote, clientTotal: estimate.total } : undefined,
        }),
      });
      const result = await response.json().catch(() => null) as { error?: string; confirmationSent?: boolean } | null;
      if (!response.ok) throw new Error(result?.error ?? t('form.sendFailed'));
      setSent({ confirmationSent: result?.confirmationSent !== false });
      reset();
      onRemoveQuote();
    } catch (error) {
      setServerError(error instanceof Error && error.message !== 'Failed to fetch' ? error.message : t('form.sendFailed'));
    }
  };

  if (sent) {
    return (
      <div ref={sentRef} tabIndex={-1} role="status" className="outline-none">
        <span className="flex h-12 w-12 items-center justify-center bg-denra-ink text-denra-ivory"><Check size={22} aria-hidden="true" /></span>
        <h2 className="display-md mt-6">{t('site.sentTitle')}</h2>
        <p className="mt-4 leading-relaxed text-denra-muted">{sent.confirmationSent ? t('site.sentText') : t('site.sentTextNoConfirmation')}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/projecten" className="btn-primary">{t('site.viewProjects')}<ArrowRight size={16} aria-hidden="true" /></Link>
          <button type="button" onClick={() => setSent(null)} className="btn-secondary">{t('site.sendAnother')}</button>
        </div>
      </div>
    );
  }

  const fieldError = (name: keyof FormData) => errors[name]?.message;
  const describedBy = (name: keyof FormData) => (errors[name] ? `${name}-error` : undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <p className="text-sm text-denra-muted">{t('site.formIntro')}</p>

      {quote && (
        <section className="border border-denra-ink/15 bg-denra-ivory p-5" aria-labelledby="quote-summary-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 id="quote-summary-heading" className="font-serif text-2xl">{t('site.yourCalculation')}</h3>
            <div className="flex gap-4 text-sm">
              <Link to="/configurator" className="underline underline-offset-4 hover:text-denra-bronze">{t('site.editCalculation')}</Link>
              <button type="button" onClick={onRemoveQuote} className="text-denra-muted underline underline-offset-4 hover:text-denra-ink">{t('site.removeCalculation')}</button>
            </div>
          </div>
          {estimate ? (
            <div className="mt-4"><EstimateBreakdown estimate={estimate} config={calculator} compact /></div>
          ) : (
            <p className="mt-3 text-sm text-[#A33B32]">{t('form.sendFailed')}</p>
          )}
        </section>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">{t('form.name')} *</label>
          <input id="name" autoComplete="name" {...register('name')} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} className="field" />
          {fieldError('name') && <p id="name-error" className="field-error">{fieldError('name')}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="field-label">{t('form.phone')} *</label>
          <input id="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="06 12 34 56 78" {...register('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy('phone')} className="field" />
          {fieldError('phone') && <p id="phone-error" className="field-error">{fieldError('phone')}</p>}
        </div>
        <div>
          <label htmlFor="email" className="field-label">{t('form.email')} *</label>
          <input id="email" type="email" autoComplete="email" inputMode="email" {...register('email')} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} className="field" />
          {fieldError('email') && <p id="email-error" className="field-error">{fieldError('email')}</p>}
        </div>
        <div>
          <label htmlFor="city" className="field-label">{t('site.formCity')} <span className="font-normal text-denra-muted">({t('site.optional')})</span></label>
          <input id="city" autoComplete="address-level2" {...register('city')} className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="field-label">{t('form.service')} *</label>
        <div className="relative">
          <select id="service" {...register('service')} aria-invalid={Boolean(errors.service)} aria-describedby={describedBy('service')} className="field appearance-none pr-10">
            <option value="">{t('form.selectService')}</option>
            {services.map((service) => (
              <option key={service} value={service}>{t({ badkamer: 'form.bathroom', wc: 'form.toilet', binnen: 'form.interior', stucwerk: 'form.plastering', schilderwerk: 'form.painting', vloeren: 'form.floors', plafond: 'form.ceiling' }[service])}</option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-denra-muted" aria-hidden="true" />
        </div>
        {fieldError('service') && <p id="service-error" className="field-error">{fieldError('service')}</p>}
      </div>

      <div>
        <label htmlFor="message" className="field-label">{t('form.message')} *</label>
        <textarea id="message" rows={5} placeholder={t('form.messagePlaceholder')} {...register('message')} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy('message')} className="field resize-y" />
        {fieldError('message') && <p id="message-error" className="field-error">{fieldError('message')}</p>}
      </div>

      <div className="hidden" aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label>
      </div>

      {serverError && (
        <div ref={errorRef} tabIndex={-1} role="alert" className="border-l-2 border-[#A33B32] bg-[#A33B32]/5 px-4 py-3 text-sm text-[#7d2b24] outline-none">
          <p>{serverError}</p>
          <p className="mt-1 text-denra-muted">{t('site.errorKept')}</p>
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
        {isSubmitting ? t('form.sending') : t('form.sendRequest')}
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
