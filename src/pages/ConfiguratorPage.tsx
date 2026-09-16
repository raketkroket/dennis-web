import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Configurator from '../components/Configurator';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';
import { useLanguage } from '../i18n/useLanguage';

export default function ConfiguratorPage() {
  const { t } = useLanguage();
  return (
    <>
      <Header />
      <main>
        <section className="pt-40 pb-24 bg-[#f6f0e8]" aria-label={t('common.calculatePrice')}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="denra-line" />
                  <span className="denra-label">{t('configuratorPage.label')}</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#231A12] leading-tight mb-6">
                  {t('configuratorPage.title').split('|')[0]}<br />{t('configuratorPage.title').split('|')[1]}
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-md">
                  {t('configuratorPage.description')}
                </p>
                <div className="space-y-4">
                  {[
                    { step: '01', title: t('configuratorPage.chooseRoom'), desc: t('configuratorPage.chooseRoomDescription') },
                    { step: '02', title: t('configuratorPage.enterDimensions'), desc: t('configuratorPage.enterDimensionsDescription') },
                    { step: '03', title: t('configuratorPage.selectOptions'), desc: t('configuratorPage.selectOptionsDescription') },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="font-serif text-2xl font-semibold text-[#7a6552]/30 w-10 shrink-0">{item.step}</span>
                      <div>
                        <p className="font-semibold text-[#231A12] text-sm">{item.title}</p>
                        <p className="text-xs text-[#8A7A6A]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl overflow-hidden aspect-[16/9]">
                  <img
                    src={sitePhotos[0]}
                    alt={t('marketing.heroTitle')}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Configurator />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}