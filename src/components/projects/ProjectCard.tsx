import { Link } from 'react-router-dom';
import type { Project } from '../../content/types';
import { useLanguage } from '../../i18n/useLanguage';
import { fill } from '../../i18n/format';
import Img from '../ui/Img';
import { useProjectText } from './useProjectText';

interface ProjectCardProps {
  project: Project;
  sizes?: string;
  priority?: boolean;
  showSummary?: boolean;
  headingLevel?: 'h2' | 'h3';
}

export default function ProjectCard({ project, sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw', priority = false, showSummary = true, headingLevel = 'h3' }: ProjectCardProps) {
  const { t } = useLanguage();
  const { categoryLabel, title, summary, pick } = useProjectText();
  const Heading = headingLevel;
  if (!project.cover) return null;

  return (
    <article className="group relative">
      <div className="frame zoom-on-hover aspect-[4/5]">
        <Img image={project.cover.image} alt={pick(project.cover.altNl, project.cover.altEn)} sizes={sizes} priority={priority} />
        {project.photos.length > 1 && (
          <span className="absolute bottom-3 left-3 bg-denra-ivory/90 px-2.5 py-1 text-[12px] font-medium text-denra-ink">
            {fill(t('site.photos'), { count: project.photos.length })}
          </span>
        )}
      </div>
      <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.18em] text-denra-bronze">
        {categoryLabel(project.category)}{project.location ? ` · ${project.location}` : ''}
      </p>
      <Heading className="mt-1.5 font-serif text-2xl leading-tight text-denra-ink">
        <Link to={`/projecten/${project.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-denra-bronze">
          {title(project)}
        </Link>
      </Heading>
      {showSummary && <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-denra-muted">{summary(project)}</p>}
    </article>
  );
}
