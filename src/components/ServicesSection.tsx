import React from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { Bath, Toilet, Layers, Paintbrush, Grid3x3, Waves, ChevronRight } from 'lucide-react';
import { sitePhotos } from '../data/sitePhotos';
import { pagePhotoAlt, usePagePhoto } from '../content/pagePhotos';
import { useLanguage } from '../i18n/useLanguage';
import { altForSrc } from '../content/photoAlt';

export default function ServicesSection() {
  const { t, language } = useLanguage();
  const servicesPhoto = usePagePhoto('homeServices');
  const services = [
    { icon: Bath, title: t('marketing.bathroomService'), desc: t('marketing.bathroomServiceDesc'), path: '/badkamerrenovatie' },
    { icon: Waves, title: t('marketing.floorService'), desc: t('marketing.floorServiceDesc'), path: '/binnenrenovatie' },
    { icon: Toilet, title: t('marketing.toiletService'), desc: t('marketing.toiletServiceDesc'), path: '/wc-renovatie' },
    { icon: Paintbrush, title: t('marketing.paintingService'), desc: t('marketing.paintingServiceDesc'), path: '/binnenrenovatie' },
    { icon: Layers, title: t('marketing.plasterService'), desc: t('marketing.plasterServiceDesc'), path: '/binnenrenovatie' },
    { icon: Grid3x3, title: t('marketing.ceilingService'), desc: t('marketing.ceilingServiceDesc'), path: '/binnenrenovatie' },
  ];
  return (
    <section className="py-24 lg:py-28 bg-transparent overflow-x-clip" aria-labelledby="diensten-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div className="min-w-0">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="denra-line" />
                <span className="denra-label">{t('marketing.servicesLabel')}</span>
              </div>
              <h2 id="diensten-heading" className="font-serif text-4xl md:text-5xl font-semibold text-c-1d1712 leading-tight mb-6">
                {t('marketing.servicesTitle')}
              </h2>
              <p className="text-c-5f544a leading-relaxed mb-10 max-w-md">
                {t('marketing.servicesDescription')}
              </p>
            </m.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, i) => (
                <m.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    to={service.path}
                    className="group flex min-w-0 items-start gap-4 p-5 bg-c-d8cdbd/42 border border-c-5c5147/12 hover:border-c-5c5147/22 transition-all duration-300"
                  >
                    <div className="w-10 h-10 border border-c-5c5147/14 flex items-center justify-center shrink-0 group-hover:border-c-5c5147/28 transition-colors duration-300">
                      <service.icon size={18} className="text-c-302922" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-c-1d1712 mb-1">{service.title}</p>
                      <p className="text-xs text-c-5f544a leading-relaxed">{service.desc}</p>
                    </div>
                  </Link>
                </m.div>
              ))}
            </div>

            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10"
            >
              <Link
                to="/projecten"
                className="inline-flex items-center gap-2 text-sm font-medium text-c-1d1712 border border-c-5c5147/18 px-6 py-3 rounded-sm tracking-[0.16em] uppercase hover:bg-c-d8d0c4 transition-all duration-200"
              >
                {t('marketing.allServices')}
                <ChevronRight size={16} />
              </Link>
            </m.div>
          </div>

          {/* Right — Configurator teaser */}
          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative min-w-0"
          >
            <div className="bg-c-1b1611 p-10 text-white relative overflow-hidden rounded-sm">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-white/30" />
                  <span className="denra-label text-white/55">{t('marketing.estimateLabel')}</span>
                </div>
                <h3 className="font-serif text-3xl font-semibold leading-tight mb-6 text-c-f7f2ea">
                  {t('marketing.estimateTitle')}
                </h3>
                <ul className="space-y-3 mb-8">
                  {t('marketing.estimateSteps').split('|').map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                      <div className="w-5 h-5 border border-white/18 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-px bg-white/60" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/configurator"
                  className="inline-flex items-center gap-2 bg-c-f6f0e8 text-c-1d1712 font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-c-e0d6c7 transition-all duration-200 text-sm w-full justify-center"
                >
                  {t('marketing.startCalculation')}
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Decorative image */}
            <div className="mt-6 overflow-hidden h-48 border border-c-5c5147/12">
              <img loading="lazy" decoding="async"
                src={servicesPhoto?.image.src ?? sitePhotos[0]}
                srcSet={servicesPhoto?.image.srcSet}
                alt={servicesPhoto ? pagePhotoAlt(servicesPhoto, language) : altForSrc(sitePhotos[0], language) ?? t('marketing.bathroomService')}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}