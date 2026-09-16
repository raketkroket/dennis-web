import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/useLanguage';

export default function StatsSection() {
  const { t } = useLanguage();
  const stats = [{ value: '100+', label: t('home.satisfiedCustomers') }, { value: `10+ ${t('home.experience')}`, label: t('home.experience') }, { value: 'Premium', label: t('home.materials') }, { value: 'Strak', label: t('home.design') }];
  return (
    <section className="py-20 bg-transparent border-y border-[#5c5147]/12" aria-label={t('home.statistics')}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="denra-line mx-auto mb-4" />
              <div className="font-serif text-3xl md:text-4xl font-semibold mb-2 text-[#1d1712]">
                {stat.value}
              </div>
              <div className="text-sm text-[#5f544a]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}