import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import logo from '../assets/denra-logo.png';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { useLocalized } from '../i18n/format';

export default function Footer() {
  const { t } = useLanguage();
  const pick = useLocalized();
  const { business } = useSiteContent();

  const services = [
    { label: t('form.bathroom'), path: '/badkamerrenovatie' },
    { label: t('form.toilet'), path: '/wc-renovatie' },
    { label: t('form.interior'), path: '/binnenrenovatie' },
    { label: 'Badkamer renovatie Almere', path: '/badkamer-renovatie-almere' },
    { label: 'Badkamer renovatie Amsterdam', path: '/badkamer-renovatie-amsterdam' },
    { label: 'WC renovatie Almere', path: '/wc-renovatie-almere' },
    { label: 'WC renovatie Amsterdam', path: '/wc-renovatie-amsterdam' },
  ];
  const pages = [
    { label: t('nav.projects'), path: '/projecten' },
    { label: t('nav.reviews'), path: '/ervaringen' },
    { label: t('nav.about'), path: '/over-ons' },
    { label: t('common.calculatePrice'), path: '/configurator' },
    { label: t('nav.contact'), path: '/contact' },
    { label: t('shared.terms'), path: '/algemene-voorwaarden' },
  ];
  const socials = [
    { label: 'Instagram', href: business.instagramUrl },
    { label: 'Facebook', href: business.facebookUrl },
    { label: 'TikTok', href: business.tiktokUrl },
  ].filter((social) => social.href);
  const linkClass = 'text-[15px] text-denra-ivory/75 transition-colors hover:text-denra-ivory';

  return (
    <footer className="bg-denra-night text-denra-ivory">
      <div className="shell grid gap-12 py-16 md:py-20 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] lg:gap-10">
        <div className="max-w-sm">
          <img src={logo} alt="Denra Badkamers" width={445} height={120} className="h-10 w-auto invert sepia-[0.15]" />
          <p className="mt-6 leading-relaxed text-denra-ivory/70">{t('shared.footerDescription')}</p>
          {business.legalName && (
            <p className="mt-4 text-sm text-denra-ivory/50">
              {t('site.kvkNote')} {business.legalName}
            </p>
          )}
        </div>

        <div>
          <h2 className="eyebrow-plain text-denra-greige">{t('site.footerServices')}</h2>
          <ul className="mt-5 space-y-3">
            {services.map((item) => <li key={item.path}><Link to={item.path} className={linkClass}>{item.label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow-plain text-denra-greige">{t('site.footerPages')}</h2>
          <ul className="mt-5 space-y-3">
            {pages.map((item) => <li key={item.path}><Link to={item.path} className={linkClass}>{item.label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow-plain text-denra-greige">{t('site.footerContact')}</h2>
          <ul className="mt-5 space-y-3">
            <li><a href={`tel:${business.phoneLink}`} className={linkClass}>{business.phoneDisplay}</a></li>
            <li><a href={`mailto:${business.email}`} className={`${linkClass} break-all`}>{business.email}</a></li>
            <li><a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={linkClass}>{t('site.whatsapp')}</a></li>
            <li className="text-[15px] text-denra-ivory/60">{pick(business.addressNl, business.addressEn)}</li>
            <li className="text-[15px] text-denra-ivory/60">{pick(business.hoursNl, business.hoursEn)}</li>
          </ul>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-denra-ivory/75 hover:text-denra-ivory">
                    {social.label}<ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {business.serviceAreas.length > 0 && (
        <div className="shell border-t border-denra-ivory/10 py-8">
          <p className="text-sm leading-relaxed text-denra-ivory/55">
            <span className="mr-3 text-denra-greige">{t('site.regions')}</span>
            {business.serviceAreas.join(' · ')}
          </p>
        </div>
      )}

      <div className="shell flex flex-col gap-2 border-t border-denra-ivory/10 py-6 text-xs text-denra-ivory/45 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} {business.companyName}. {t('shared.allRightsReserved')}</p>
        <p>{t('shared.footerTagline')}</p>
      </div>
    </footer>
  );
}
