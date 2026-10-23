import { MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { usePageTitle } from '../i18n/format';
import { RelatedProjects, ServiceHero, useCategoryProjects } from '../components/service/ServiceBlocks';
import FaqSection from '../components/FaqSection';
import CTASection from '../components/CTASection';
import Reveal from '../components/ui/Reveal';

type LocalServicePageProps = {
  city: string;
  serviceType: 'badkamer' | 'wc';
  title: string;
  intro: string;
  bullets: string[];
  faq: { question: string; answer: string }[];
};

export default function LocalServicePage({ city, serviceType, title, intro, bullets, faq }: LocalServicePageProps) {
  const { t } = useLanguage();
  const isBathroom = serviceType === 'badkamer';
  const category = isBathroom ? 'badkamer' : 'toilet';
  const projects = useCategoryProjects(category, city);
  const service = t(isBathroom ? 'localServicePage.bathroomService' : 'localServicePage.toiletService');
  const scope = t(isBathroom ? 'localServicePage.bathroomScope' : 'localServicePage.toiletScope');
  const replace = (value: string) => value.replace('{city}', city).replace('{service}', service).replace('{scope}', scope);
  const cardTitles = t('localServicePage.cardTitles').split('|').map(replace);
  const cardDescriptions = t('localServicePage.cardDescriptions').split('|').map(replace);
  usePageTitle(title, intro);

  return (
    <>
      <ServiceHero eyebrow={t('localServicePage.brand')} title={title} description={intro} category={category} project={projects[0]}>
        <p className="mt-8 flex items-center gap-2 text-sm text-denra-muted">
          <MapPin size={16} className="text-denra-bronze" aria-hidden="true" />
          {t('localServicePage.serviceArea')} {city} {t('localServicePage.surroundings')}
        </p>
      </ServiceHero>

      <section className="bg-denra-stone py-20 md:py-28" aria-labelledby="local-why-heading">
        <div className="shell">
          <Reveal className="grid gap-6 lg:grid-cols-12">
            <h2 id="local-why-heading" className="display-lg lg:col-span-6">{replace(t('localServicePage.whyTitle'))}</h2>
            <p className="lede lg:col-span-5 lg:col-start-8 lg:self-end">{replace(t(isBathroom ? 'localServicePage.bathroomWhy' : 'localServicePage.toiletWhy'))}</p>
          </Reveal>
          <div className="mt-12 grid gap-10 border-t border-denra-ink/70 pt-10 lg:grid-cols-3">
            {cardTitles.map((heading, index) => (
              <Reveal key={heading} delay={index * 0.05}>
                <h3 className="font-serif text-2xl">{heading}</h3>
                <p className="mt-3 leading-relaxed text-denra-muted">{cardDescriptions[index]}</p>
              </Reveal>
            ))}
          </div>
          <ul className="mt-12 grid border-t border-denra-line md:grid-cols-2 md:gap-x-10">
            {bullets.map((bullet) => <li key={bullet} className="border-b border-denra-line py-4 text-[17px]">{bullet}</li>)}
          </ul>
        </div>
      </section>

      <RelatedProjects title={`${isBathroom ? t('bathroomPage.projectsTitle') : t('wcPage.projectsTitle')}`} category={category} projects={projects.slice(1)} />
      <FaqSection pages={[]} extra={faq} />
      <CTASection title={replace(t('localServicePage.ctaTitle'))} text={replace(t('localServicePage.ctaDescription'))} service={isBathroom ? 'badkamer' : 'wc'} />
    </>
  );
}
