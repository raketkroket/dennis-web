import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Clock, Home, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';

export default function TrustBar() {
  const { t } = useLanguage();
  const items = [{ icon: Award, title: t('home.luxuryFinish'), desc: t('home.luxuryFinishDesc') }, { icon: Shield, title: t('home.fixedPrice'), desc: t('home.fixedPriceDesc') }, { icon: Clock, title: t('home.tightPlanning'), desc: t('home.tightPlanningDesc') }, { icon: Home, title: t('home.allUnderOneRoof'), desc: t('home.allUnderOneRoofDesc') }, { icon: MapPin, title: t('home.activeRegion'), desc: t('home.activeRegionDesc') }];
  return (
    <section className="bg-transparent border-y border-[#5c5147]/12" aria-label={t('home.promises')}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col items-start gap-3"
            >
              <div className="denra-line" />
              <div>
                <p className="text-sm font-semibold text-[#1d1712] leading-snug">{item.title}</p>
                <p className="text-xs text-[#5f544a] mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}