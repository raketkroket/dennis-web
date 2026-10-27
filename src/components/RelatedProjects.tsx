import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import type { ProjectCategory } from '../content/defaults';
import { useLanguage } from '../i18n/useLanguage';
import { fill, useLocalized } from '../i18n/format';

/** Projects of one kind with their place and description, as entered in the admin. */
export default function RelatedProjects({ category, title, id, place, limit = 6 }: { category: ProjectCategory; title: string; id: string; place?: string; limit?: number }) {
  const { t } = useLanguage();
  const pick = useLocalized();
  const { projects } = useSiteContent();
  const matching = projects.filter((project) => project.category === category && project.cover && (!place || project.location?.startsWith(place)));
  if (!matching.length) return null;
  // Projects Dennis marked as featured first, otherwise his order.
  const shown = [...matching].sort((first, second) => Number(second.isFeatured) - Number(first.isFeatured)).slice(0, limit);

  return (
    <section className="py-20 bg-[#f4efe8]" aria-labelledby={`${id}-heading`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="denra-line" />
              <span className="denra-label">{t('site.relatedLabel')}</span>
            </div>
            <h2 id={`${id}-heading`} className="font-serif text-4xl font-semibold text-[#231A12]">{title}</h2>
          </div>
          <Link to="/projecten" className="inline-flex items-center gap-2 text-sm font-medium text-[#231A12] border border-[#5c5147]/20 px-6 py-3 rounded-sm tracking-[0.16em] uppercase hover:bg-[#e6ddd3] transition-all duration-200 whitespace-nowrap self-start sm:self-auto">
            {/* The overview shows every project, so only count when nothing is filtered by place. */}
            {place ? t('site.allProjects') : fill(t('site.relatedAll'), { count: matching.length })}
            <ArrowRight size={16} />
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((project) => {
            const cover = project.cover!;
            return (
              <li key={project.id}>
                <article className="h-full">
                  <figure className="overflow-hidden rounded-sm aspect-[4/3] mb-4 border border-[#cfbca7]/55 bg-[#efe6dc]">
                    <img
                      src={cover.image.src}
                      srcSet={cover.image.srcSet}
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      alt={pick(cover.altNl, cover.altEn)}
                      width={cover.image.width}
                      height={cover.image.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <h3 className="font-serif text-2xl font-semibold text-[#231A12] mb-1">{pick(project.titleNl, project.titleEn)}</h3>
                  {project.location && (
                    <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[#7a6552]">
                      <MapPin size={13} aria-hidden="true" />
                      {project.location}
                    </p>
                  )}
                  <p className="text-sm text-[#6B5D50] leading-relaxed">{pick(project.summaryNl, project.summaryEn)}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
