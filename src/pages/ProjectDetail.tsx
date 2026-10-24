import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { useSiteContent } from '../content/SiteContentProvider';
import { getReviews } from '../data/reviews';
import { useLanguage } from '../i18n/useLanguage';
import { fill, usePageTitle } from '../i18n/format';
import Img from '../components/ui/Img';
import Lightbox from '../components/ui/Lightbox';
import ProjectCard from '../components/projects/ProjectCard';
import { categoryService, useProjectText } from '../components/projects/useProjectText';
import { Stars } from '../components/ReviewCard';
import CTASection from '../components/CTASection';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { projects, ready } = useSiteContent();
  const { language, t } = useLanguage();
  const { categoryLabel, categoryNoun, title, summary, pick } = useProjectText();
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const index = projects.findIndex((project) => project.slug === slug);
  const project = index >= 0 ? projects[index] : undefined;
  usePageTitle(project ? `${title(project)} – ${t('nav.projects')}` : t('nav.projects'), project ? summary(project) : undefined);

  const gallery = useMemo(() => project?.photos.map((photo) => ({
    image: photo.image,
    alt: pick(photo.altNl, photo.altEn),
    caption: pick(photo.captionNl, photo.captionEn) || (photo.kind === 'during' ? t('site.during') : photo.kind === 'before' ? t('site.before') : photo.kind === 'after' ? t('site.after') : ''),
  })) ?? [], [project, pick, t]);

  if (!project) {
    if (!ready) return <div className="min-h-[60vh]" aria-busy="true" />;
    return (
      <section className="shell py-24 text-center">
        <h1 className="display-md">{t('site.projectNotFound')}</h1>
        <Link to="/projecten" className="btn-primary mt-8">{t('site.notFoundProjects')}</Link>
      </section>
    );
  }

  const review = project.reviewRef ? getReviews(language).find((candidate) => candidate.id === project.reviewRef) : undefined;
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const related = projects.filter((candidate) => candidate.category === project.category && candidate.id !== project.id && candidate.cover).slice(0, 3);
  const before = project.photos.find((photo) => photo.kind === 'before');
  const after = project.photos.find((photo) => photo.kind === 'after');
  const service = categoryService[project.category];
  const cover = project.cover ?? project.photos[0];
  const kindLabel = (kind: string) => (kind === 'during' ? t('site.during') : kind === 'before' ? t('site.before') : kind === 'after' ? t('site.after') : '');

  return (
    <>
      <article>
        <div className="shell pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-sm text-denra-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link to="/projecten" className="hover:text-denra-ink">{t('nav.projects')}</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to={`/projecten?categorie=${project.category}`} className="hover:text-denra-ink">{categoryLabel(project.category, true)}</Link></li>
            </ol>
          </nav>
        </div>

        <div className="shell grid gap-8 pb-16 pt-6 lg:grid-cols-12 lg:gap-14 lg:pb-24 lg:pt-8">
          <header className="order-2 lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:order-none lg:col-span-4 lg:self-start">
            <p className="eyebrow">{categoryLabel(project.category)}</p>
            <h1 className="display-lg mt-5">{title(project)}</h1>
            <p className="lede mt-6">{summary(project)}</p>
            <dl className="mt-8 border-t border-denra-line text-[15px]">
              <div className="flex justify-between gap-6 border-b border-denra-line py-3"><dt className="text-denra-muted">{t('site.projectCategory')}</dt><dd>{categoryLabel(project.category)}</dd></div>
              {project.location && <div className="flex justify-between gap-6 border-b border-denra-line py-3"><dt className="text-denra-muted">{t('site.projectLocation')}</dt><dd>{project.location}</dd></div>}
              <div className="flex justify-between gap-6 border-b border-denra-line py-3"><dt className="text-denra-muted">{t('site.projectPhotos')}</dt><dd>{project.photos.length}</dd></div>
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link to={`/contact?dienst=${service}&project=${project.slug}`} className="btn-primary">
                {t('site.quoteForSimilar')}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/configurator" className="btn-secondary">{t('common.calculatePrice')}</Link>
            </div>
          </header>

          <div className="order-1 lg:order-none lg:col-span-8">
            {cover && (
              <button type="button" onClick={() => setPhotoIndex(project.photos.indexOf(cover))} className="group frame zoom-on-hover block aspect-[4/5] w-full sm:aspect-[5/6] lg:aspect-[4/5]" aria-label={fill(t('site.openPhoto'), { index: project.photos.indexOf(cover) + 1, total: project.photos.length })}>
                <Img image={cover.image} alt={pick(cover.altNl, cover.altEn)} sizes="(min-width: 1024px) 60vw, 100vw" priority />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-denra-ivory/90 px-3 py-2 text-[13px] font-medium text-denra-ink"><Expand size={14} aria-hidden="true" />{project.photos.length > 1 ? fill(t('site.photos'), { count: project.photos.length }) : t('site.photo')}</span>
              </button>
            )}

            {before && after && (
              <section className="mt-12" aria-labelledby="before-after-heading">
                <h2 id="before-after-heading" className="display-md">{t('site.beforeAfter')}</h2>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                  {[before, after].map((photo) => (
                    <figure key={photo.id}>
                      <button type="button" onClick={() => setPhotoIndex(project.photos.indexOf(photo))} className="frame block aspect-[4/5] w-full" aria-label={fill(t('site.openPhoto'), { index: project.photos.indexOf(photo) + 1, total: project.photos.length })}>
                        <Img image={photo.image} alt={pick(photo.altNl, photo.altEn)} sizes="(min-width: 1024px) 30vw, 50vw" />
                      </button>
                      <figcaption className="mt-2 text-sm text-denra-muted">{kindLabel(photo.kind)}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            {project.photos.length > 1 && (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                {project.photos.map((photo, photoPosition) => photo === cover ? null : (
                  <li key={photo.id}>
                    <button type="button" onClick={() => setPhotoIndex(photoPosition)} className="group frame zoom-on-hover block aspect-[4/5] w-full" aria-label={fill(t('site.openPhoto'), { index: photoPosition + 1, total: project.photos.length })}>
                      <Img image={photo.image} alt={pick(photo.altNl, photo.altEn)} sizes="(min-width: 1024px) 20vw, 50vw" />
                      {(photo.kind !== 'result' || photo.captionNl) && (
                        <span className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] truncate bg-denra-ivory/90 px-2 py-1 text-[12px] font-medium text-denra-ink">
                          {pick(photo.captionNl, photo.captionEn) || kindLabel(photo.kind)}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {review && (
              <figure className="mt-14 border-t border-denra-ink/70 pt-8">
                <p className="eyebrow-plain">{t('site.customerSaid')}</p>
                <Stars rating={review.rating} size={16} />
                <blockquote className="mt-4 whitespace-pre-line font-serif text-2xl leading-snug text-denra-ink md:text-[1.75rem]">“{review.text}”</blockquote>
                <figcaption className="mt-5 text-denra-muted">{review.name}{review.city ? `, ${review.city}` : ''} · {review.date}</figcaption>
                <Link to="/ervaringen" className="link-arrow mt-6">{t('site.readFullReview')}<ArrowRight size={15} aria-hidden="true" /></Link>
              </figure>
            )}
          </div>
        </div>

        {projects.length > 1 && (
          <nav className="border-y border-denra-line" aria-label={t('nav.projects')}>
            <div className="shell grid grid-cols-2">
              <Link to={`/projecten/${previous.slug}`} className="flex min-h-20 items-center gap-3 py-5 pr-4 text-denra-muted hover:text-denra-ink">
                <ArrowLeft size={18} aria-hidden="true" className="shrink-0" />
                <span className="min-w-0"><span className="block text-xs uppercase tracking-[0.18em]">{t('site.previousProject')}</span><span className="block truncate font-serif text-xl text-denra-ink">{title(previous)}</span></span>
              </Link>
              <Link to={`/projecten/${next.slug}`} className="flex min-h-20 items-center justify-end gap-3 border-l border-denra-line py-5 pl-4 text-right text-denra-muted hover:text-denra-ink">
                <span className="min-w-0"><span className="block text-xs uppercase tracking-[0.18em]">{t('site.nextProject')}</span><span className="block truncate font-serif text-xl text-denra-ink">{title(next)}</span></span>
                <ArrowRight size={18} aria-hidden="true" className="shrink-0" />
              </Link>
            </div>
          </nav>
        )}
      </article>

      {related.length > 0 && (
        <section className="py-16 md:py-24" aria-labelledby="related-heading">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related-heading" className="display-md">{fill(t('site.moreProjects'), { category: categoryLabel(project.category, true).toLowerCase() })}</h2>
              <Link to={`/projecten?categorie=${project.category}`} className="link-arrow">{t('site.allProjects')}<ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => <li key={item.id}><ProjectCard project={item} /></li>)}
            </ul>
          </div>
        </section>
      )}

      <CTASection title={t('site.quoteForSimilar')} text={fill(t('site.quoteForSimilarText'), { category: categoryNoun(project.category) })} service={service} />

      <Lightbox items={gallery} index={photoIndex} title={title(project)} onClose={() => setPhotoIndex(null)} onIndexChange={setPhotoIndex} />
    </>
  );
}
