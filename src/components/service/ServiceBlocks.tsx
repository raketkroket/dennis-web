import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ProjectCategory } from '../../content/defaults';
import type { Project } from '../../content/types';
import { useSiteContent } from '../../content/SiteContentProvider';
import { useLanguage } from '../../i18n/useLanguage';
import Img from '../ui/Img';
import Reveal from '../ui/Reveal';
import ProjectCard from '../projects/ProjectCard';
import { categoryService, useProjectText } from '../projects/useProjectText';

/** Projects of one category; ones from `city` first. Large photos lead. */
// eslint-disable-next-line react-refresh/only-export-components
export function useCategoryProjects(category: ProjectCategory, city?: string) {
  const { projects } = useSiteContent();
  const inCategory = projects.filter((project) => project.category === category && project.cover);
  const score = (project: Project) => (city && project.location?.toLowerCase().includes(city.toLowerCase()) ? 2 : 0) + (project.isFeatured ? 1 : 0) + ((project.cover?.image.width ?? 0) >= 700 ? 1 : 0);
  return [...inCategory].sort((first, second) => score(second) - score(first));
}

interface ServiceHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  category: ProjectCategory;
  project?: Project;
  children?: ReactNode;
}

export function ServiceHero({ eyebrow, title, description, category, project, children }: ServiceHeroProps) {
  const { t } = useLanguage();
  const { title: projectTitle, pick } = useProjectText();
  return (
    <section className="pb-16 pt-8 md:pt-14 lg:pb-24" aria-labelledby="service-heading">
      <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="service-heading" className="display-xl mt-6">{title}</h1>
          <p className="lede mt-6 max-w-xl">{description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to={`/contact?dienst=${categoryService[category]}`} className="btn-primary">{t('site.quote')}<ArrowRight size={16} aria-hidden="true" /></Link>
            <Link to={`/projecten?categorie=${category}`} className="btn-secondary">{t('site.viewProjects')}</Link>
          </div>
          {children}
        </div>
        {project?.cover && (
          <div className="lg:col-span-5 lg:col-start-8">
            <Link to={`/projecten/${project.slug}`} className="group frame zoom-on-hover block aspect-[4/5]">
              <Img image={project.cover.image} alt={pick(project.cover.altNl, project.cover.altEn)} sizes="(min-width: 1024px) 40vw, 100vw" priority />
            </Link>
            <p className="mt-3 text-sm text-denra-muted">{projectTitle(project)}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function ScopeSection({ title, description, items, project }: { title: string; description: string; items: string[]; project?: Project }) {
  const { pick } = useProjectText();
  return (
    <section className="bg-denra-stone py-20 md:py-28" aria-labelledby="scope-heading">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <h2 id="scope-heading" className="display-lg">{title.split('|').map((line, index) => <span key={line} className="block">{index ? <span className="italic text-denra-bronze">{line}</span> : line}</span>)}</h2>
          <p className="lede mt-6">{description}</p>
          {project?.cover && (
            <div className="frame mt-10 hidden aspect-[4/3] lg:block">
              <Img image={project.cover.image} alt={pick(project.cover.altNl, project.cover.altEn)} sizes="40vw" />
            </div>
          )}
        </Reveal>
        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.06}>
          <ol className="border-t border-denra-ink/70">
            {items.map((item, index) => (
              <li key={item} className="flex items-baseline gap-6 border-b border-denra-line py-4 text-[17px]">
                <span className="w-6 shrink-0 font-serif text-denra-bronze">{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

export function GuidanceSection({ eyebrow, title, paragraphs, conclusion }: { eyebrow: string; title: string; paragraphs: string[]; conclusion: string }) {
  return (
    <section className="py-20 md:py-28" aria-labelledby="guidance-heading">
      <Reveal className="shell grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="guidance-heading" className="display-lg mt-5">{title}</h2>
        </div>
        <div className="space-y-5 text-[17px] leading-relaxed text-denra-muted lg:col-span-6 lg:col-start-7">
          {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="border-l-2 border-denra-bronze pl-5 font-serif text-2xl leading-snug text-denra-ink">{conclusion}</p>
        </div>
      </Reveal>
    </section>
  );
}

export function RelatedProjects({ title, category, projects }: { title: string; category: ProjectCategory; projects: Project[] }) {
  const { t } = useLanguage();
  if (!projects.length) return null;
  return (
    <section className="border-t border-denra-line py-20 md:py-28" aria-labelledby="related-projects-heading">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="related-projects-heading" className="display-lg">{title}</h2>
          <Link to={`/projecten?categorie=${category}`} className="link-arrow">{t('site.allProjects')}<ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((project) => <li key={project.id}><ProjectCard project={project} /></li>)}
        </ul>
      </div>
    </section>
  );
}
