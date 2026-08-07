import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { Send } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Naam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().min(10, 'Telefoonnummer is verplicht'),
  service: z.string().min(1, 'Selecteer een dienst'),
  message: z.string().min(10, 'Bericht is te kort'),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Bedankt! Wij nemen binnen 24 uur contact met u op.');
    reset();
    void data;
  };

  const inputClass = 'denra-field text-sm';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#231A12] mb-2">Naam *</label>
          <input id="name" {...register('name')} placeholder="Uw volledige naam" className={inputClass} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#231A12] mb-2">Telefoon *</label>
          <input id="phone" {...register('phone')} placeholder="06 12 34 56 78" className={inputClass} />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#231A12] mb-2">E-mailadres *</label>
        <input id="email" type="email" {...register('email')} placeholder="uw@email.nl" className={inputClass} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-[#231A12] mb-2">Dienst *</label>
        <select id="service" {...register('service')} className={inputClass}>
          <option value="">Selecteer een dienst</option>
          <option value="badkamer">Badkamerrenovatie</option>
          <option value="wc">WC-renovatie</option>
          <option value="binnen">Binnenrenovatie</option>
          <option value="stucwerk">Stucwerk</option>
          <option value="schilderwerk">Schilderwerk</option>
          <option value="vloeren">Vloeren leggen</option>
          <option value="plafond">Verlaagd plafond & spotjes</option>
        </select>
        {errors.service && <p className={errorClass}>{errors.service.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#231A12] mb-2">Bericht *</label>
        <textarea
          id="message"
          {...register('message')}
          rows={4}
          placeholder="Vertel ons over uw renovatiewensen..."
          className={`${inputClass} resize-none`}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 text-sm"
      >
        {isSubmitting ? 'Verzenden...' : 'Verstuur aanvraag'}
        <Send size={16} />
      </button>
    </form>
  );
}