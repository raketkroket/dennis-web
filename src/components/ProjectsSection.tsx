import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '../content/types';
import { useLanguage } from '../i18n/useLanguage';
import ProjectCard from './projects/ProjectCard';
import Reveal from './ui/Reveal';

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const { t } = useLanguage();
  if (!projects.length) return null;

  return (
    <section className="bg-denra-stone py-20 md:py-28 lg:pb-44" aria-labelledby="projecten-heading">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('site.featuredLabel')}</p>
            <h2 id="projecten-heading" className="display-lg mt-5">{t('site.featuredTitle')}</h2>
            <p className="lede mt-5">{t('site.featuredIntro')}</p>
          </div>
          <Link to="/projecten" className="btn-secondary shrink-0 self-start md:self-auto">
            {t('site.allProjects')}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>

        {/* Phones: a swipeable row. Larger screens: three staggered columns. */}
        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 lg:gap-x-8">
          {projects.map((project, index) => (
            <li key={project.id} className={`w-[78vw] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none ${index % 3 === 1 ? 'lg:translate-y-16' : ''}`}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
