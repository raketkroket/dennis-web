import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';

export default function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="py-24 bg-transparent" aria-label={t('shared.callToAction')}>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="denra-line" />
            <span className="denra-label">{t('shared.callToAction')}</span>
            <div className="denra-line" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-[#1d1712] leading-tight mb-6">
            {t('shared.dreamRenovation')}
          </h2>
          <p className="text-[#5f544a] leading-relaxed mb-10 max-w-lg mx-auto">
            {t('shared.ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/configurator"
              className="inline-flex items-center justify-center gap-2 bg-[#1d1712] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#0f0d0b] transition-all duration-200 text-sm"
            >
              {t('common.calculatePrice')}
              <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+31614966756"
              className="inline-flex items-center justify-center gap-2 border border-[#5c5147]/18 text-[#1d1712] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#1d1712] hover:text-white transition-all duration-200 text-sm"
            >
              <Phone size={16} />
              {t('shared.callUs')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}