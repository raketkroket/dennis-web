import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { fill, useLocalized } from '../i18n/format';
import { formatEuro, formatNumber } from '../lib/calculator';
import Reveal from './ui/Reveal';

export default function CalculatorTeaser() {
  const { language, t } = useLanguage();
  const pick = useLocalized();
  const { calculator } = useSiteContent();
  const rooms = calculator.rooms.filter((room) => room.isActive);

  return (
    <section className="bg-denra-night py-20 text-denra-ivory md:py-24" aria-labelledby="calculator-heading">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow text-denra-greige">{t('site.calcLabel')}</p>
          <h2 id="calculator-heading" className="display-lg mt-5 text-denra-ivory">{t('site.calcTitle')}</h2>
          <p className="mt-6 max-w-xl leading-relaxed text-denra-ivory/70">{t('site.calcText')}</p>
          <Link to="/configurator" className="btn-light mt-9">
            {t('marketing.startCalculation')}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.08}>
          <ul className="border-t border-denra-ivory/20">
            {rooms.map((room) => (
              <li key={room.roomType} className="flex items-baseline justify-between gap-6 border-b border-denra-ivory/20 py-6">
                <div>
                  <p className="font-serif text-2xl">{pick(room.labelNl, room.labelEn)}</p>
                  <p className="mt-1 text-sm text-denra-ivory/55">{fill(t('site.calcUpTo'), { area: formatNumber(room.includedArea, language) })}</p>
                </div>
                <p className="text-right">
                  <span className="block text-xs uppercase tracking-[0.18em] text-denra-greige">{t('site.calcFrom')}</span>
                  <span className="font-serif text-3xl">{formatEuro(room.basePrice, language)}</span>
                  <span className="block text-xs text-denra-ivory/55">{t('configurator.includingVat')}</span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
