import React from 'react';
import { m } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RelatedProjects from '../components/RelatedProjects';
import FaqList from '../components/FaqList';
import ServiceArea from '../components/ServiceArea';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';
import { pagePhotoAlt, usePagePhoto } from '../content/pagePhotos';
import { useLanguage } from '../i18n/useLanguage';
import { useStartedOnClient } from '../lib/hydration';
import { altForSrc } from '../content/photoAlt';
import { useSiteContent } from '../content/SiteContentProvider';
import { fill } from '../i18n/format';
import { formatEuro, formatNumber } from '../lib/calculator';

export default function Badkamerrenovatie() {
  const { t, language } = useLanguage();
  const featuresPhoto = usePagePhoto('bathroomFeatures');
  const heroPhoto = usePagePhoto('bathroomHero');
  // First page load: show the prerendered content at once; animate on later visits.
  const animateIn = useStartedOnClient();
  const features = t('bathroomPage.features').split('|');
  const projectTitles = t('bathroomPage.projectTitles').split('|');
  const projectDescriptions = t('bathroomPage.projectDescriptions').split('|');
  const projects = [0, 1, 2].map((photoIndex, index) => ({ image: sitePhotos[photoIndex], title: projectTitles[index], desc: projectDescriptions[index] }));
  const processSteps = t('bathroomPage.processSteps').split('|');
  const processDescriptions = t('bathroomPage.processDescriptions').split('|');
  const { calculator } = useSiteContent();
  const bathroom = calculator.rooms.find((room) => room.roomType === 'badkamer' && room.isActive);

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        {/* Hero */}
        <section className="relative pt-40 pb-24 bg-c-f7f1ea overflow-hidden" aria-label={t('bathroomPage.heroAria')}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-14 xl:gap-20 items-center">
              <m.div
                initial={animateIn && { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="denra-line" />
                  <span className="denra-label bg-c-efe2d2 text-c-4d3d33">{t('bathroomPage.eyebrow')}</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-c-231a12 leading-[0.96] mb-6">
                  {t('bathroomPage.title')}
                </h1>
                <p className="text-c-6b5d50 leading-relaxed mb-8 text-lg">
                  {t('bathroomPage.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/configurator"
                    className="inline-flex items-center justify-center gap-2 bg-c-231a12 text-c-f6f0e8 font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-c-3a2d23 transition-all duration-200 text-sm"
                  >
                    {t('common.calculatePrice')}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-c-7a6552/20 text-c-231a12 font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-c-231a12 hover:text-white transition-all duration-200 text-sm"
                  >
                    {t('bathroomPage.consultation')}
                  </Link>
                </div>
              </m.div>
              <m.div
                initial={animateIn && { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative rounded-[32px] overflow-hidden aspect-[4/3] border border-c-d6c3a9 shadow-[0_20px_40px_rgba(40,30,25,0.08)] bg-c-efe4d5"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-c-1a120d/10 to-transparent" />
                <img
                  src={heroPhoto?.image.src ?? sitePhotos[0]}
                  srcSet={heroPhoto?.image.srcSet}
                  alt={heroPhoto ? pagePhotoAlt(heroPhoto, language) : altForSrc(sitePhotos[0], language) ?? t('bathroomPage.heroAlt')}
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </m.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-c-faf6f0" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 id="features-heading" className="font-serif text-4xl font-semibold text-c-231a12 mb-6">
                  {t('bathroomPage.featuresTitle').split('|').map((line, index) => <React.Fragment key={line}>{index > 0 && <br />}{line}</React.Fragment>)}
                </h2>
                <p className="text-c-6b5d50 leading-relaxed mb-8">
                  {t('bathroomPage.featuresDescription')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <m.div
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-c-e8ddcf flex items-center justify-center shrink-0">
                        <Check size={11} className="text-c-7a6552" />
                      </div>
                      <span className="text-sm text-c-4a3f35">{f}</span>
                    </m.div>
                  ))}
                </div>
              </m.div>
              <m.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl overflow-hidden aspect-square"
              >
                <img loading="lazy" decoding="async"
                  src={featuresPhoto?.image.src ?? sitePhotos[8]}
                  srcSet={featuresPhoto?.image.srcSet}
                  alt={featuresPhoto ? pagePhotoAlt(featuresPhoto, language) : altForSrc(sitePhotos[8], language) ?? t('bathroomPage.featuresAlt')}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </m.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-c-f4efe8" aria-labelledby="badkamer-werkwijze-heading">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="denra-line" />
              <span className="denra-label">{t('bathroomPage.processEyebrow')}</span>
            </div>
            <h2 id="badkamer-werkwijze-heading" className="font-serif text-4xl font-semibold text-c-231a12 mb-10">{t('bathroomPage.processTitle')}</h2>
            <ol className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {processSteps.map((step, index) => (
                <li key={step} className="flex gap-5 border-t border-c-cfbca7/55 pt-5">
                  <span className="font-serif text-2xl font-semibold text-c-7a6552/80 w-10 shrink-0" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-c-231a12 mb-2">{step}</h3>
                    <p className="text-c-5f544a leading-relaxed">{processDescriptions[index]}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-10 text-c-4a3f35 leading-relaxed max-w-3xl">{t('bathroomPage.processDuration')}</p>
          </div>
        </section>

        <section className="py-20 bg-c-faf6f0" aria-labelledby="badkamer-verbouwen-heading">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 grid gap-12 md:grid-cols-2">
            <div>
              <h2 id="badkamer-verbouwen-heading" className="font-serif text-3xl font-semibold text-c-231a12 mb-4">{t('bathroomPage.remodelTitle')}</h2>
              <p className="text-c-5f544a leading-relaxed">{t('bathroomPage.remodelText')}</p>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-semibold text-c-231a12 mb-4">{t('bathroomPage.showerTitle')}</h2>
              <p className="text-c-5f544a leading-relaxed">{t('bathroomPage.showerText')}</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-c-f4efe8" aria-labelledby="badkamer-begeleiding-heading">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="denra-line" />
              <span className="denra-label">{t('bathroomPage.guidanceEyebrow')}</span>
              <div className="denra-line" />
            </div>
            <h2 id="badkamer-begeleiding-heading" className="font-serif text-4xl font-semibold text-c-231a12 mb-6">
              {t('bathroomPage.guidanceTitle')}
            </h2>
            <p className="text-c-6b5d50 leading-relaxed mb-4">
              {t('bathroomPage.guidanceFirst')}
            </p>
            <p className="text-c-6b5d50 leading-relaxed mb-4">
              {t('bathroomPage.guidanceSecond')}
            </p>
            <p className="text-c-4a3f35 font-medium leading-relaxed">
              {t('bathroomPage.guidanceConclusion')}
            </p>
          </div>
        </section>

        {/* Projects */}
        <section className="py-20 bg-c-f6f0e8" aria-labelledby="badkamer-projecten-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 id="badkamer-projecten-heading" className="font-serif text-4xl font-semibold text-c-231a12">
                {t('bathroomPage.projectsTitle')}
              </h2>
            </m.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <m.div
                  key={p.image}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group"
                >
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                    <img loading="lazy" decoding="async"
                      src={p.image}
                      alt={altForSrc(p.image, language) ?? p.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-c-231a12 mb-1">{p.title}</h3>
                  <p className="text-sm text-c-8a7a6a">{p.desc}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {bathroom && (
          <section className="py-20 bg-c-f6f0e8" aria-labelledby="badkamer-kosten-heading">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="denra-line" />
                <span className="denra-label">{t('site.priceLabel')}</span>
              </div>
              <h2 id="badkamer-kosten-heading" className="font-serif text-4xl font-semibold text-c-231a12 mb-4">{t('bathroomPage.costTitle')}</h2>
              <p className="text-c-6b5d50 leading-relaxed mb-8">{fill(t('bathroomPage.costText'), { price: formatEuro(bathroom.basePrice, language), area: formatNumber(bathroom.includedArea, language) })}</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link to="/badkamer-renovatie-kosten" className="inline-flex items-center justify-center gap-2 bg-c-231a12 text-c-f6f0e8 font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-c-3a2d23 transition-all duration-200 text-sm">
                  {t('bathroomPage.costLink')}
                  <ArrowRight size={16} />
                </Link>
                <Link to="/configurator" className="text-sm font-medium text-c-231a12 underline decoration-c-7a6552/40 underline-offset-4 hover:decoration-c-231a12">{t('common.calculatePrice')}</Link>
              </div>
            </div>
          </section>
        )}
        <RelatedProjects category="badkamer" title={t('site.relatedBathrooms')} id="badkamer-meer-projecten" />
        <FaqList pages={['badkamer', 'algemeen']} id="badkamer-faq" />
        <ServiceArea service="badkamer" id="badkamer-werkgebied" />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}