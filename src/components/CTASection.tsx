import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import Reveal from './ui/Reveal';

interface CTASectionProps {
  title?: string;
  text?: string;
  /** Pre-selects the service in the contact form. */
  service?: string;
}

export default function CTASection({ title, text, service }: CTASectionProps) {
  const { t } = useLanguage();
  const { business } = useSiteContent();

  return (
    <section className="border-t border-denra-line py-20 md:py-28" aria-labelledby="contact-cta-heading">
      <Reveal className="shell grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow">{t('shared.callToAction')}</p>
          <h2 id="contact-cta-heading" className="display-lg mt-5">{title ?? t('site.contactBandTitle')}</h2>
          <p className="lede mt-6 max-w-2xl">{text ?? t('site.contactBandText')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={service ? `/contact?dienst=${service}` : '/contact'} className="btn-primary">
              {t('site.quote')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/configurator" className="btn-secondary">{t('common.calculatePrice')}</Link>
          </div>
        </div>
        <div className="border-t border-denra-line pt-6 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="eyebrow-plain">{t('site.orCall')}</p>
          <a href={`tel:${business.phoneLink}`} className="mt-3 flex items-center gap-3 font-serif text-3xl text-denra-ink hover:text-denra-bronze">
            <Phone size={22} className="text-denra-bronze" aria-hidden="true" />
            {business.phoneDisplay}
          </a>
          <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-denra-muted underline-offset-4 hover:text-denra-ink hover:underline">
            <MessageCircle size={18} aria-hidden="true" />
            {t('common.whatsappUs')}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
