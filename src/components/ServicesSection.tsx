import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ProjectCategory } from '../content/defaults';
import { useSiteContent } from '../content/SiteContentProvider';
import type { Project } from '../content/types';
import { useLanguage } from '../i18n/useLanguage';
import { fill } from '../i18n/format';
import Img from './ui/Img';
import Reveal from './ui/Reveal';
import { categoryPaths, useProjectText } from './projects/useProjectText';

export default function ServicesSection({ showcases }: { showcases: Partial<Record<ProjectCategory, Project>> }) {
  const { t } = useLanguage();
  const { projects } = useSiteContent();
  const { pick } = useProjectText();

  const services: { category: ProjectCategory; title: string; description: string; scope: string[] }[] = [
    { category: 'badkamer', title: t('marketing.bathroomService'), description: t('bathroomPage.description'), scope: t('bathroomPage.features').split('|').slice(0, 6) },
    { category: 'toilet', title: t('marketing.toiletService'), description: t('wcPage.featuresDescription'), scope: t('wcPage.features').split('|').slice(0, 6) },
    { category: 'interieur', title: t('form.interior'), description: t('interiorPage.description'), scope: t('interiorPage.services').split('|') },
  ];

  return (
    <section className="py-20 md:py-28" aria-labelledby="diensten-heading">
      <div className="shell">
        <Reveal className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">{t('marketing.servicesLabel')}</p>
            <h2 id="diensten-heading" className="display-lg mt-5">{t('marketing.servicesTitle')}</h2>
          </div>
          <p className="lede lg:col-span-6 lg:col-start-7 lg:self-end">{t('marketing.servicesDescription')}</p>
        </Reveal>

        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {services.map((service, index) => {
            const inCategory = projects.filter((project) => project.category === service.category && project.cover);
            const showcase = showcases[service.category];
            const reversed = index % 2 === 1;
            return (
              <Reveal key={service.category} as="article" className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                {showcase?.cover && (
                  <Link to={categoryPaths[service.category]} className={`group frame zoom-on-hover block aspect-[4/5] sm:aspect-[5/4] lg:col-span-6 lg:aspect-[4/5] xl:aspect-[5/6] ${reversed ? 'lg:order-2 lg:col-start-7' : ''}`} tabIndex={-1} aria-hidden="true">
                    <Img image={showcase.cover.image} alt={pick(showcase.cover.altNl, showcase.cover.altEn)} sizes="(min-width: 1024px) 45vw, 100vw" />
                  </Link>
                )}
                <div className={`lg:col-span-5 ${reversed ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'}`}>
                  <p className="font-serif text-lg text-denra-bronze">0{index + 1}</p>
                  <h3 className="display-md mt-2">
                    <Link to={categoryPaths[service.category]} className="hover:text-denra-bronze">{service.title}</Link>
                  </h3>
                  <p className="mt-5 leading-relaxed text-denra-muted">{service.description}</p>
                  <ul className="mt-7 grid gap-x-6 border-t border-denra-line sm:grid-cols-2">
                    {service.scope.map((item) => (
                      <li key={item} className="border-b border-denra-line py-3 text-[15px] text-denra-ink">{item}</li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Link to={categoryPaths[service.category]} className="link-arrow">
                      {fill(t('site.serviceMore'), { service: service.title.toLowerCase() })}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                    {inCategory.length > 0 && (
                      <Link to={`/projecten?categorie=${service.category}`} className="text-[14px] text-denra-muted underline-offset-4 hover:text-denra-ink hover:underline">
                        {fill(t('site.serviceProjects'), { count: inCategory.length })}
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
