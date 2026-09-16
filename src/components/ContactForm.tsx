import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Send } from 'lucide-react';
import type { QuoteConfiguration } from '../types/quote';
import { useLanguage } from '../i18n/useLanguage';

type FormData = { name: string; email: string; phone: string; service: string; message: string };

interface ContactFormProps {
  quoteConfiguration?: QuoteConfiguration;
}

const formatCurrency = (value: number) => `€${value.toLocaleString('nl-NL')}`;

export default function ContactForm({ quoteConfiguration }: ContactFormProps) {
  const { t, language } = useLanguage();
  const schema = z.object({
    name: z.string().min(2, t('form.nameRequired')),
    email: z.string().email(t('form.invalidEmail')),
    phone: z.string().min(10, t('form.phoneRequired')),
    service: z.string().min(1, t('form.serviceRequired')),
    message: z.string().min(10, t('form.messageShort')),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { service: quoteConfiguration?.roomType ?? '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/offerte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          language,
          roomType: quoteConfiguration?.roomType,
          length: quoteConfiguration?.length,
          width: quoteConfiguration?.width,
          area: quoteConfiguration?.area,
          selectedOptions: quoteConfiguration?.selectedOptions ?? [],
          totalPrice: quoteConfiguration?.totalPrice,
        }),
      });

      const result = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) throw new Error(result?.error ?? t('form.sendFailed'));

      toast.success(t('form.sent'));
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('form.sendFailed'));
    }
  };

  const inputClass = 'denra-field text-sm';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#231A12] mb-2">{t('form.name')} *</label>
          <input id="name" {...register('name')} placeholder={t('form.fullName')} className={inputClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#231A12] mb-2">{t('form.phone')} *</label>
          <input id="phone" {...register('phone')} placeholder="06 12 34 56 78" className={inputClass} />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#231A12] mb-2">{t('form.email')} *</label>
        <input id="email" type="email" {...register('email')} placeholder="uw@email.nl" className={inputClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-[#231A12] mb-2">{t('form.service')} *</label>
        <select id="service" {...register('service')} className={inputClass}>
          <option value="">{t('form.selectService')}</option>
          <option value="badkamer">{t('form.bathroom')}</option>
          <option value="wc">{t('form.toilet')}</option>
          <option value="binnen">{t('form.interior')}</option>
          <option value="stucwerk">{t('form.plastering')}</option>
          <option value="schilderwerk">{t('form.painting')}</option>
          <option value="vloeren">{t('form.floors')}</option>
          <option value="plafond">{t('form.ceiling')}</option>
        </select>
        {errors.service && <p className={errorClass}>{errors.service.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#231A12] mb-2">{t('form.message')} *</label>
        <textarea
          id="message"
          {...register('message')}
          rows={4}
          placeholder={t('form.messagePlaceholder')}
          className={`${inputClass} resize-none`}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>
      {quoteConfiguration && (
        <div className="border border-[#cfbca7]/55 bg-[#f4ede4] p-5 rounded-sm text-sm text-[#6B5D50]">
          <p className="denra-label text-[#7a6552] mb-3">{t('form.quoteCalculation')}</p>
          <dl className="space-y-2">
            <div className="flex justify-between gap-4"><dt>{t('form.room')}</dt><dd className="font-medium text-[#231A12] capitalize">{quoteConfiguration.roomType === 'wc' ? t('form.toilet') : t('form.bathroom')}</dd></div>
            <div className="flex justify-between gap-4"><dt>{t('form.dimensions')}</dt><dd className="font-medium text-[#231A12]">{quoteConfiguration.length} m × {quoteConfiguration.width} m</dd></div>
            <div className="flex justify-between gap-4"><dt>{t('form.area')}</dt><dd className="font-medium text-[#231A12]">{quoteConfiguration.area} m²</dd></div>
          </dl>
          <div className="border-t border-[#cfbca7]/55 mt-4 pt-4">
            <p className="mb-2">{t('form.selectedOptions')}</p>
            {quoteConfiguration.selectedOptions.length > 0 ? (
              <ul className="space-y-1">
                {quoteConfiguration.selectedOptions.map((option) => <li key={option.id} className="flex justify-between gap-4"><span>{option.label}</span><span>+ {formatCurrency(option.price)}</span></li>)}
              </ul>
            ) : <p>{t('form.noOptions')}</p>}
          </div>
          <div className="flex justify-between gap-4 border-t border-[#cfbca7]/55 mt-4 pt-4 font-semibold text-[#231A12]">
            <span>{t('form.totalEstimate')}</span><span>{formatCurrency(quoteConfiguration.totalPrice)}</span>
          </div>
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 text-sm"
      >
        {isSubmitting ? t('form.sending') : t('form.sendRequest')}
        <Send size={16} />
      </button>
    </form>
  );
}