import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '../content/types';
import { useLanguage } from '../i18n/useLanguage';
import Img from './ui/Img';
import { useProjectText } from './projects/useProjectText';

export default function HeroSection({ main, second }: { main?: Project; second?: Project }) {
  const { t } = useLanguage();
  const { title, pick } = useProjectText();

  return (
    <section className="relative" aria-labelledby="hero-heading">
      <div className="shell grid items-center gap-10 pb-16 pt-8 lg:grid-cols-12 lg:gap-12 lg:pb-24 lg:pt-14">
        <div className="lg:col-span-5">
          <p className="eyebrow">{t('marketing.heroLabel')}</p>
          <h1 id="hero-heading" className="display-xl mt-6">
            {t('marketing.heroTitle')}{' '}
            <span className="italic text-denra-bronze">{t('marketing.heroTitleAccent')}</span>
          </h1>
          <p className="lede mt-6 max-w-xl">{t('marketing.heroDescription')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary">
              {t('site.quote')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/projecten" className="btn-secondary">{t('site.viewProjects')}</Link>
          </div>
          <Link to="/configurator" className="mt-6 inline-flex text-[15px] text-denra-muted underline decoration-denra-line underline-offset-[6px] hover:text-denra-ink hover:decoration-denra-ink">
            {t('site.calculatorLink')}
          </Link>
        </div>

        {main?.cover && (
          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-12 items-end gap-3 sm:gap-4">
              <Link to={`/projecten/${main.slug}`} className={`group frame zoom-on-hover block aspect-[4/5] ${second?.cover ? 'col-span-12 sm:col-span-8' : 'col-span-12'}`}>
                <Img image={main.cover.image} alt={pick(main.cover.altNl, main.cover.altEn)} sizes="(min-width: 1024px) 40vw, (min-width: 640px) 66vw, 100vw" priority />
              </Link>
              {second?.cover && (
                <Link to={`/projecten/${second.slug}`} className="group frame zoom-on-hover col-span-4 hidden aspect-[3/4] sm:mb-16 sm:block">
                  <Img image={second.cover.image} alt={pick(second.cover.altNl, second.cover.altEn)} sizes="(min-width: 1024px) 20vw, 33vw" />
                </Link>
              )}
            </div>
            <Link to={`/projecten/${main.slug}`} className="mt-4 flex items-center justify-between gap-4 border-t border-denra-line pt-4 text-sm text-denra-muted hover:text-denra-ink">
              <span className="min-w-0 truncate">
                <span className="eyebrow-plain mr-3">{t('site.heroProject')}</span>
                {title(main)}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5">{t('site.viewThisProject')}<ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
