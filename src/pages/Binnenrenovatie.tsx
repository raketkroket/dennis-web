import { useLanguage } from '../i18n/useLanguage';
import { usePageTitle } from '../i18n/format';
import { RelatedProjects, ServiceHero, useCategoryProjects } from '../components/service/ServiceBlocks';
import FaqSection from '../components/FaqSection';
import CTASection from '../components/CTASection';
import Reveal from '../components/ui/Reveal';

export default function Binnenrenovatie() {
  const { t } = useLanguage();
  const projects = useCategoryProjects('interieur');
  usePageTitle(t('interiorPage.title'), t('interiorPage.description'));
  const titles = t('interiorPage.services').split('|');
  const descriptions = t('interiorPage.serviceDescriptions').split('|');

  return (
    <>
      <ServiceHero eyebrow={t('interiorPage.eyebrow')} title={t('interiorPage.title')} description={t('interiorPage.description')} category="interieur" project={projects[0]} />
      <section className="bg-denra-stone py-20 md:py-28" aria-labelledby="interior-services-heading">
        <div className="shell">
          <Reveal><h2 id="interior-services-heading" className="display-lg max-w-2xl">{t('interiorPage.servicesTitle')}</h2></Reveal>
          <ol className="mt-12 grid border-t border-denra-ink/70 md:grid-cols-2">
            {titles.map((title, index) => (
              <Reveal as="li" key={title} delay={index * 0.05} className={`border-b border-denra-line py-8 md:pr-10 ${index % 2 === 1 ? 'md:border-l md:pl-10' : ''}`}>
                <span className="font-serif text-lg text-denra-bronze">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-serif text-3xl">{title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-denra-muted">{descriptions[index]}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <RelatedProjects title={t('portfolioPage.interior')} category="interieur" projects={projects.slice(1)} />
      <FaqSection pages={['binnen']} />
      <CTASection service="binnen" />
    </>
  );
}
