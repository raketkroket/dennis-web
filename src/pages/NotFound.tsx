import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-[#f6f0e8] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl font-semibold text-[#7a6552]/20 mb-4">404</p>
        <h1 className="font-serif text-3xl font-semibold text-[#231A12] mb-4">{t('notFound.title')}</h1>
        <p className="text-[#6B5D50] mb-8">{t('notFound.description')}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] transition-all duration-200 text-sm"
        >
          <ArrowLeft size={16} />
          {t('notFound.backHome')}
        </Link>
      </div>
    </main>
  );
}