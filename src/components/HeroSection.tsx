import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import heroImage from '../../headerimg.png?w=768;1280;1720&format=webp&as=picture';
import { useLanguage } from '../i18n/useLanguage';

// Full-width hero with the original header photo, as on the previous site.
export default function HeroSection() {
  const { t } = useLanguage();
  const image = heroImage.img;

  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--header-height))] items-end overflow-hidden lg:items-center" aria-labelledby="hero-heading">
      <img
        src={image.src}
        srcSet={Object.values(heroImage.sources)[0]}
        sizes="100vw"
        width={image.w}
        height={image.h}
        alt=""
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#14100c]/85 via-[#14100c]/45 to-[#14100c]/10 lg:bg-gradient-to-r lg:from-[#14100c]/80 lg:via-[#14100c]/40 lg:to-transparent" aria-hidden="true" />

      <div className="shell w-full pb-14 pt-24 lg:py-24">
        <div className="max-w-xl text-denra-ivory">
          <p className="eyebrow text-denra-ivory/80">{t('marketing.heroLabel')}</p>
          <h1 id="hero-heading" className="display-xl mt-6 text-denra-ivory">
            {t('marketing.heroTitle')}{' '}
            <span className="italic text-denra-greige">{t('marketing.heroTitleAccent')}</span>
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-denra-ivory/90 sm:text-lg">{t('marketing.heroDescription')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn-light">
              {t('site.quote')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/projecten" className="btn-outline-light">{t('site.viewProjects')}</Link>
          </div>
          <Link to="/configurator" className="mt-6 inline-flex text-[15px] text-denra-ivory/80 underline decoration-denra-ivory/40 underline-offset-[6px] hover:text-denra-ivory hover:decoration-denra-ivory">
            {t('site.calculatorLink')}
          </Link>
        </div>
      </div>
    </section>
  );
}
