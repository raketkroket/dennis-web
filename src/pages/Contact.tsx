import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import FaqSection from '../components/FaqSection';
import { useSiteContent } from '../content/SiteContentProvider';
import { loadQuoteConfiguration, saveQuoteConfiguration, type QuoteConfiguration } from '../types/quote';
import { useLanguage } from '../i18n/useLanguage';
import { usePageTitle, useLocalized } from '../i18n/format';

export default function Contact() {
  const { t, language } = useLanguage();
  const pick = useLocalized();
  const { business, projects } = useSiteContent();
  const [searchParams] = useSearchParams();
  const [quote, setQuote] = useState<QuoteConfiguration | null>(() => loadQuoteConfiguration());
  usePageTitle(t('nav.contact'), t('home.contactDescription'));

  const service = searchParams.get('dienst') ?? '';
  const project = projects.find((candidate) => candidate.slug === searchParams.get('project'));
  const projectMessage = project
    ? (language === 'en' ? `I am interested in a project like "${pick(project.titleNl, project.titleEn)}".` : `Ik ben geïnteresseerd in een project zoals ‘${project.titleNl}’.`)
    : '';

  const removeQuote = () => {
    saveQuoteConfiguration(null);
    setQuote(null);
  };

  const contactItems = [
    { icon: Phone, label: t('form.phone'), value: business.phoneDisplay, href: `tel:${business.phoneLink}` },
    { icon: MessageCircle, label: t('site.whatsapp'), value: t('common.whatsappUs'), href: `https://wa.me/${business.whatsappNumber}`, external: true },
    { icon: Mail, label: t('form.email'), value: business.email, href: `mailto:${business.email}` },
    { icon: MapPin, label: t('home.businessAddress'), value: pick(business.addressNl, business.addressEn) },
    { icon: Clock, label: t('home.available'), value: pick(business.hoursNl, business.hoursEn) },
  ];

  return (
    <>
      <section className="pb-20 pt-8 md:pb-28 md:pt-14" aria-labelledby="contact-heading">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow">{t('home.contactUs')}</p>
            <h1 id="contact-heading" className="display-xl mt-6">{t('home.getAcquainted')}</h1>
            <p className="lede mt-6">{t('home.contactDescription')}</p>

            <h2 className="eyebrow-plain mt-12">{t('site.directContact')}</h2>
            <ul className="mt-4 border-t border-denra-ink/70">
              {contactItems.map((item) => (
                <li key={item.label} className="border-b border-denra-line">
                  {item.href ? (
                    <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} className="flex min-h-16 items-center gap-4 py-3 hover:text-denra-bronze">
                      <item.icon size={18} className="shrink-0 text-denra-bronze" aria-hidden="true" />
                      <span className="min-w-0"><span className="block text-xs text-denra-muted">{item.label}</span><span className="block break-words text-[17px]">{item.value}</span></span>
                    </a>
                  ) : (
                    <div className="flex min-h-16 items-center gap-4 py-3">
                      <item.icon size={18} className="shrink-0 text-denra-bronze" aria-hidden="true" />
                      <span><span className="block text-xs text-denra-muted">{item.label}</span><span className="block text-[17px]">{item.value}</span></span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="border border-denra-line bg-denra-paper p-5 sm:p-8 lg:p-10">
              <h2 className="display-md">{t('home.sendMessage')}</h2>
              <p className="mt-2 text-denra-muted">{t('home.contactWithin24')}</p>
              <div className="mt-8">
                <ContactForm quote={quote} onRemoveQuote={removeQuote} defaultService={service} defaultMessage={projectMessage} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FaqSection pages={['algemeen']} tone="stone" />
    </>
  );
}
