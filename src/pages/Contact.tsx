import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FaqList from '../components/FaqList';
import ServiceArea from '../components/ServiceArea';
import ContactForm from '../components/ContactForm';
import WhatsAppButton from '../components/WhatsAppButton';
import denraLogoBg from '../../fotos/denralogobg.png?w=854&format=webp';
import { loadQuoteConfiguration, saveQuoteConfiguration, type QuoteConfiguration } from '../types/quote';
import { useStartedOnClient } from '../lib/hydration';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';

export default function Contact() {
  const { t, language } = useLanguage();
  // First page load: show the prerendered content at once and pick up a
  // saved quote right after; on later visits animate and read it directly.
  const animateIn = useStartedOnClient();
  const { business } = useSiteContent();
  const [searchParams] = useSearchParams();
  // The calculator keeps the chosen configuration in session storage until it is sent or removed.
  // On a prerendered page the quote is picked up right after the first render.
  const [quote, setQuote] = useState<QuoteConfiguration | null>(() => (animateIn ? loadQuoteConfiguration() : null));
  const [restoreQuote] = useState(!animateIn);
  useEffect(() => {
    if (restoreQuote) setQuote(loadQuoteConfiguration());
  }, [restoreQuote]);
  const removeQuote = () => {
    saveQuoteConfiguration(null);
    setQuote(null);
  };
  const contactInfo = [
    { icon: Phone, label: t('form.phone'), value: business.phoneDisplay, href: `tel:${business.phoneLink}` }, { icon: Mail, label: t('form.email'), value: business.email, href: `mailto:${business.email}` }, { icon: MapPin, label: t('home.businessAddress'), value: language === 'en' ? business.addressEn || business.addressNl : business.addressNl, href: undefined }, { icon: Clock, label: t('home.available'), value: t('home.availability'), href: undefined },
  ];

  return (
    <>
      <Header />
      <main>
        <section className="pt-40 pb-24 bg-[#f6f0e8]" aria-label={t('nav.contact')}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Left */}
              <m.div
                initial={animateIn && { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="denra-line" />
                  <span className="denra-label">{t('home.contactUs')}</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#231A12] leading-tight mb-6">
                  {t('home.getAcquainted')}
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-10 max-w-md">
                  {t('home.contactDescription')}
                </p>

                <div className="space-y-5 mb-10">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm bg-[#f4ede4] border border-[#cfbca7]/55 flex items-center justify-center shrink-0">
                        <item.icon size={18} className="text-[#7a6552]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#8A7A6A] mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-[#231A12] hover:text-[#7a6552] transition-colors duration-200">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-[#231A12]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-[#f1e7dc] border border-[#cfbca7]/55 flex items-center justify-center p-6">
                  <img loading="lazy" decoding="async"
                    src={denraLogoBg}
                    alt=""
                    width={800}
                    height={450}
                    className="w-full h-full object-contain opacity-80"
                  />
                </div>
              </m.div>

              {/* Right — Form */}
              <m.div
                initial={animateIn && { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-[#faf6f0] rounded-sm p-8 md:p-10 border border-[#cfbca7]/55"
              >
                  <h2 className="font-serif text-2xl font-semibold text-[#231A12] mb-2">{t('home.sendMessage')}</h2>
                <p className="text-sm text-[#8A7A6A] mb-8">{t('home.contactWithin24')}</p>
                <ContactForm quote={quote} onRemoveQuote={removeQuote} defaultService={searchParams.get('dienst') ?? ''} />
              </m.div>
            </div>
          </div>
        </section>
        <FaqList pages={['algemeen']} id="contact-faq" />
        <ServiceArea service="badkamer" id="contact-werkgebied" />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}