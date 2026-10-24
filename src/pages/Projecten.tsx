import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projectCategories, type ProjectCategory } from '../content/defaults';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { fill, usePageTitle } from '../i18n/format';
import ProjectCard from '../components/projects/ProjectCard';
import { useProjectText } from '../components/projects/useProjectText';
import CTASection from '../components/CTASection';

export default function Projecten() {
  const { t } = useLanguage();
  const { projects } = useSiteContent();
  const { categoryLabel } = useProjectText();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('categorie');
  const active: ProjectCategory | 'alle' = projectCategories.includes(requested as ProjectCategory) ? requested as ProjectCategory : 'alle';
  const visible = projects.filter((project) => project.cover && (active === 'alle' || project.category === active));
  usePageTitle(`${t('portfolioPage.eyebrow')} – ${active === 'alle' ? t('site.allProjects') : categoryLabel(active, true)}`, t('portfolioPage.description'));

  const filters: { id: ProjectCategory | 'alle'; label: string; count: number }[] = [
    { id: 'alle', label: t('site.projectsAll'), count: projects.length },
    ...projectCategories.map((category) => ({ id: category, label: categoryLabel(category, true), count: projects.filter((project) => project.category === category).length })),
  ];
  const [lead, ...rest] = visible;

  return (
    <>
      <section className="pb-10 pt-10 md:pb-14 md:pt-16" aria-labelledby="projects-heading">
        <div className="shell grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t('portfolioPage.eyebrow')}</p>
            <h1 id="projects-heading" className="display-xl mt-6">
              {t('portfolioPage.title').split('|').map((line, index) => <span key={line} className={index ? 'block italic text-denra-bronze' : 'block'}>{line}</span>)}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="lede">{t('portfolioPage.description')}</p>
            <Link to="/contact" className="link-arrow mt-6">{t('site.quote')}<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <div className="sticky top-[var(--header-height)] z-30 border-y border-denra-line bg-denra-ivory/95 backdrop-blur-md">
        <div className="shell">
          <nav className="-mx-4 flex gap-1 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0" aria-label={t('portfolioPage.filterAria')}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSearchParams(filter.id === 'alle' ? {} : { categorie: filter.id }, { replace: true })}
                aria-pressed={active === filter.id}
                className={`min-h-11 shrink-0 px-4 text-[15px] transition-colors ${active === filter.id ? 'bg-denra-ink text-denra-ivory' : 'text-denra-ink hover:bg-denra-stone'}`}
              >
                {filter.label} <span className="ml-1 text-[13px] opacity-60">{filter.count}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <section className="py-12 md:py-16" aria-label={t('portfolioPage.overview')}>
        <div className="shell">
          <p className="mb-8 text-sm text-denra-muted" aria-live="polite">
            {visible.length === 1 ? t('site.projectsCountOne') : fill(t('site.projectsCount'), { count: visible.length })}
          </p>
          {lead ? (
            <>
              <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-12">
                <div className="sm:col-span-2 lg:col-span-7">
                  <ProjectCard project={lead} headingLevel="h2" sizes="(min-width: 1024px) 55vw, 100vw" priority />
                </div>
                <div className="grid content-start gap-y-14 sm:col-span-2 sm:grid-cols-2 sm:gap-x-8 lg:col-span-5 lg:grid-cols-1">
                  {rest.slice(0, 1).map((project) => <ProjectCard key={project.id} project={project} headingLevel="h2" priority />)}
                </div>
              </div>
              <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(1).map((project) => <li key={project.id}><ProjectCard project={project} headingLevel="h2" /></li>)}
              </ul>
            </>
          ) : (
            <div className="border-y border-denra-line py-14 text-center">
              <p className="font-serif text-2xl">{t('portfolioPage.noProjects')}</p>
              <button type="button" onClick={() => setSearchParams({}, { replace: true })} className="link-arrow mt-5">{t('portfolioPage.clearFilters')}</button>
            </div>
          )}
        </div>
      </section>

      <CTASection title={t('portfolioPage.ctaTitle').replace('|', ' ')} text={t('portfolioPage.ctaDescription')} />
    </>
  );
}
