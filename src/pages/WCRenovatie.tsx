import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';
import { useLanguage } from '../i18n/useLanguage';

export default function WCRenovatie() {
  const { t } = useLanguage();
  const features = t('wcPage.features').split('|');
  const pricingLabels = t('wcPage.pricing').split('|');
  const adviceLabels = t('wcPage.advice').split('|');
  const projectDescriptions = t('wcPage.projectDescriptions').split('|');
  const projects = [{ image: sitePhotos[8], title: t('nav.toilet'), desc: projectDescriptions[0] }, { image: sitePhotos[9], title: t('nav.toilet'), desc: projectDescriptions[1] }];
  const luxePricing = pricingLabels.map((label, index) => ({ label, price: ['€300 tot €500', '€400 tot €900', '€700 tot €1.000', '€250 tot €450', '€900 tot €1.500', '€250 tot €450', '€150 tot €300'][index] }));
  const luxeAdvies = adviceLabels.map((label, index) => ({ label, price: ['€4.250', '+ €1.250', '+ €350', '+ €450', '+ €350'][index] }));
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-40 pb-24 bg-[#f2eee9]" aria-label={t('wcPage.heroAria')}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 xl:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="order-2 lg:order-1 rounded-[30px] overflow-hidden aspect-[4/3] border border-[#d3c5b6] shadow-[0_20px_40px_rgba(40,30,25,0.08)] bg-[#e9dfd3]"
              >
                <img
                  src={sitePhotos[8]}
                  alt={t('wcPage.heroAlt')}
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="order-1 lg:order-2 max-w-xl ml-auto"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="denra-line" />
                  <span className="denra-label bg-[#e6ddd3] text-[#42362d]">{t('wcPage.eyebrow')}</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#231A12] leading-[0.96] mb-6">
                  {t('wcPage.title')}
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-8 text-lg">
                  {t('wcPage.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/configurator"
                    className="inline-flex items-center justify-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] transition-all duration-200 text-sm"
                  >
                    {t('common.calculatePrice')}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-[#7a6552]/20 text-[#231A12] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#231A12] hover:text-white transition-all duration-200 text-sm"
                  >
                    {t('wcPage.consultation')}
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#faf6f0]" aria-labelledby="wc-features-heading">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 id="wc-features-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-4">
                {t('wcPage.featuresTitle')}
              </h2>
              <p className="text-[#6B5D50]">{t('wcPage.featuresDescription')}</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-center gap-3 p-4 bg-[#faf6f0] rounded-sm border border-[#cfbca7]/55"
                >
                  <div className="w-6 h-6 rounded-full bg-[#e8ddcf] flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#7a6552]" />
                  </div>
                  <span className="text-sm font-medium text-[#4A3F35]">{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f4efe8]" aria-labelledby="wc-begeleiding-heading">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="denra-line" />
              <span className="denra-label">{t('wcPage.guidanceEyebrow')}</span>
              <div className="denra-line" />
            </div>
            <h2 id="wc-begeleiding-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-6">
              {t('wcPage.guidanceTitle')}
            </h2>
            <p className="text-[#6B5D50] leading-relaxed mb-4">
              {t('wcPage.guidanceFirst')}
            </p>
            <p className="text-[#6B5D50] leading-relaxed mb-4">
              {t('wcPage.guidanceSecond')}
            </p>
            <p className="text-[#4A3F35] font-medium leading-relaxed">
              {t('wcPage.guidanceConclusion')}
            </p>
          </div>
        </section>

        <section className="py-20 bg-[#f6f0e8]" aria-labelledby="wc-luxe-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-sm bg-[#faf6f0] border border-[#cfbca7]/55 p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="denra-line" />
                  <span className="denra-label">{t('wcPage.pricingEyebrow')}</span>
                </div>
                <h2 id="wc-luxe-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-4">
                  {t('wcPage.pricingTitle')}
                </h2>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-2xl">
                  {t('wcPage.pricingDescription')}
                </p>
                <div className="space-y-3">
                  {luxePricing.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 rounded-sm border border-[#cfbca7] bg-[#f6f0e8] px-4 py-3"
                    >
                      <p className="font-medium text-[#231A12]">{item.label}</p>
                      <p className="text-sm font-semibold text-[#7a6552]">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-sm bg-[#231A12] p-6 text-white">
                  <p className="denra-label text-[#cfbca7] mb-2">{t('wcPage.pricingTotalLabel')}</p>
                  <p className="font-serif text-4xl font-semibold mb-2">€3.800 tot €5.200</p>
                  <p className="text-sm text-[#B7A892]">{t('wcPage.pricingTotalDescription')}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-sm bg-[#231A12] p-8 text-white"
              >
                <p className="denra-label text-[#cfbca7] mb-3">{t('wcPage.adviceEyebrow')}</p>
                <h3 className="font-serif text-3xl font-semibold mb-6">{t('wcPage.adviceTitle')}</h3>
                <div className="space-y-4 mb-8">
                  {luxeAdvies.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                      <p className="text-sm text-[#E6DED1]">{item.label}</p>
                      <p className="text-sm font-semibold text-white">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="denra-label text-[#cfbca7] mb-2">{t('wcPage.adviceTitle')}</p>
                  <p className="font-serif text-4xl font-semibold">€5.500 tot €6.500</p>
                </div>
                <p className="mt-6 text-sm text-[#B7A892]">{t('wcPage.adviceDescription')}</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#faf6f0]" aria-labelledby="wc-projecten-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 id="wc-projecten-heading" className="font-serif text-4xl font-semibold text-[#231A12]">
                {t('wcPage.projectsTitle')}
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {projects.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group"
                >
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                    <img
                      src={p.image}
                      alt={p.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#231A12] mb-1">{p.title}</h3>
                  <p className="text-sm text-[#8A7A6A]">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}