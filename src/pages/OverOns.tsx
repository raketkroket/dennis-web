import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { usePageTitle } from '../i18n/format';
import Img from '../components/ui/Img';
import Reveal from '../components/ui/Reveal';
import CTASection from '../components/CTASection';
import { useProjectText } from '../components/projects/useProjectText';

export default function OverOns() {
  const { t } = useLanguage();
  const { projects } = useSiteContent();
  const { pick } = useProjectText();
  usePageTitle(t('aboutPage.label'), t('aboutPage.description'));
  const valueTitles = t('aboutPage.values').split('|');
  const valueDescriptions = t('aboutPage.valueDescriptions').split('|');
  const promises = t('aboutPage.promises').split('|');
  const large = projects.filter((project) => project.cover && project.cover.image.width >= 700);
  const [first, second] = [large.find((project) => project.category === 'badkamer'), large.find((project) => project.category === 'interieur')];
  // These figures were on the previous version of the page; Dennis can change them under "Website aanpassen".
  const figures = [
    { value: t('aboutPage.customersValue'), label: t('aboutPage.customers') },
    { value: t('aboutPage.experienceValue'), label: t('aboutPage.experience') },
  ].filter((figure) => figure.value.trim());

  return (
    <>
      <section className="pb-16 pt-8 md:pt-14 lg:pb-24" aria-labelledby="about-heading">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="eyebrow">{t('aboutPage.label')}</p>
            <h1 id="about-heading" className="display-xl mt-6">
              {t('aboutPage.title').split('|').map((line, index) => <span key={line} className={`block ${index === 1 ? 'italic text-denra-bronze' : ''}`}>{line}</span>)}
            </h1>
            <p className="lede mt-7">{t('aboutPage.description')}</p>
            <p className="mt-5 leading-relaxed text-denra-muted">{t('aboutPage.intro')}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary">{t('aboutPage.consultation')}<ArrowRight size={16} aria-hidden="true" /></Link>
              <Link to="/projecten" className="btn-secondary">{t('aboutPage.viewProjects')}</Link>
            </div>
            {figures.length > 0 && (
              <dl className="mt-12 grid max-w-md grid-cols-2 border-t border-denra-ink/70">
                {figures.map((figure, index) => (
                  <div key={figure.label} className={`flex flex-col pt-5 ${index ? 'border-l border-denra-line pl-6' : ''}`}>
                    <dt className="text-sm text-denra-muted">{figure.label}</dt>
                    <dd className="order-first font-serif text-4xl">{figure.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="grid grid-cols-12 items-start gap-4 lg:col-span-6">
            {first?.cover && (
              <Link to={`/projecten/${first.slug}`} className="group frame zoom-on-hover col-span-8 block aspect-[4/5]">
                <Img image={first.cover.image} alt={pick(first.cover.altNl, first.cover.altEn)} sizes="(min-width: 1024px) 32vw, 66vw" priority />
              </Link>
            )}
            <div className="col-span-4 mt-24 space-y-4">
              {second?.cover && (
                <Link to={`/projecten/${second.slug}`} className="group frame zoom-on-hover block aspect-[3/4]">
                  <Img image={second.cover.image} alt={pick(second.cover.altNl, second.cover.altEn)} sizes="(min-width: 1024px) 16vw, 33vw" />
                </Link>
              )}
            </div>
            <blockquote className="col-span-12 border-l-2 border-denra-bronze pl-5 font-serif text-2xl leading-snug sm:col-span-10">
              {t('aboutPage.quote')}
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-denra-stone py-20 md:py-28" aria-labelledby="why-heading">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">{t('aboutPage.whyLabel')}</p>
            <h2 id="why-heading" className="display-lg mt-5">{t('aboutPage.whyTitle')}</h2>
            <p className="lede mt-6">{t('aboutPage.whyDescription')}</p>
          </Reveal>
          <div className="mt-12 grid border-t border-denra-ink/70 lg:grid-cols-3">
            {valueTitles.map((title, index) => (
              <Reveal key={title} delay={index * 0.05} className={`border-b border-denra-line py-8 lg:border-b-0 lg:pr-10 ${index ? 'lg:border-l lg:pl-10' : ''}`}>
                <span className="font-serif text-lg text-denra-bronze">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-serif text-3xl">{title}</h3>
                <p className="mt-3 leading-relaxed text-denra-muted">{valueDescriptions[index]}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" aria-labelledby="promise-heading">
        <Reveal className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">{t('aboutPage.promiseLabel')}</p>
            <h2 id="promise-heading" className="display-lg mt-5">{t('aboutPage.promiseTitle')}</h2>
            <p className="lede mt-6">{t('aboutPage.promiseDescription')}</p>
          </div>
          <ul className="border-t border-denra-ink/70 lg:col-span-6 lg:col-start-7">
            {promises.map((promise) => <li key={promise} className="border-b border-denra-line py-5 font-serif text-2xl">{promise}</li>)}
          </ul>
        </Reveal>
      </section>

      <CTASection title={t('aboutPage.ctaTitle')} text={t('aboutPage.ctaDescription')} />
    </>
  );
}
