import React, { useEffect, useMemo, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import ServiceLinks from '../components/ServiceLinks';
import { track } from '../lib/analytics';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLocalized } from '../i18n/format';
import { useLanguage } from '../i18n/useLanguage';
import { useStartedOnClient } from '../lib/hydration';

interface Project {
  id: string;
  title: string;
  category: 'Badkamer' | 'WC' | 'Binnen';
  image: string;
  srcSet?: string;
  alt: string;
  desc: string;
  location?: string;
}

const categories = ['Alle', 'Badkamer', 'WC', 'Binnen'];

const gridVariant = (index: number) => {
  const variants = [
    'lg:col-span-7 aspect-[16/11]',
    'lg:col-span-5 aspect-[4/3]',
    'lg:col-span-5 aspect-[3/4] sm:aspect-[4/3]',
    'lg:col-span-4 aspect-[4/3]',
    'lg:col-span-8 aspect-[16/10]',
  ];
  return variants[index % variants.length];
};

export default function Projecten() {
  const { t } = useLanguage();
  // First page load: show the prerendered content at once; animate on later visits.
  const animateIn = useStartedOnClient();
  const pick = useLocalized();
  const { projects } = useSiteContent();
  // Projects as Dennis manages them in the admin, in his order.
  const allProjects = useMemo<Project[]>(() => projects.filter((project) => project.cover).map((project) => ({
    id: project.id,
    title: pick(project.titleNl, project.titleEn),
    category: project.category === 'badkamer' ? 'Badkamer' : project.category === 'toilet' ? 'WC' : 'Binnen',
    image: project.cover?.image.src ?? '',
    srcSet: project.cover?.image.srcSet,
    alt: project.cover ? pick(project.cover.altNl, project.cover.altEn) : '',
    desc: pick(project.summaryNl, project.summaryEn),
    location: project.location ?? undefined,
  })), [projects, pick]);
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => allProjects.filter((project) => activeCategory === 'Alle' || project.category === activeCategory), [allProjects, activeCategory]);
  const categoryLabel = (category: string) => category === 'Badkamer' ? t('portfolioPage.bathroom') : category === 'WC' ? t('portfolioPage.toilet') : t('portfolioPage.interior');
  const projectTitle = (project: Project) => project.title;
  const projectDescription = (project: Project) => project.desc;

  useEffect(() => {
    if (!selectedProject) return undefined;
    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
      if (event.key === 'ArrowLeft') setSelectedProject((current) => current && filtered[(filtered.indexOf(current) - 1 + filtered.length) % filtered.length]);
      if (event.key === 'ArrowRight') setSelectedProject((current) => current && filtered[(filtered.indexOf(current) + 1) % filtered.length]);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      triggerButtonRef.current?.focus();
    };
  }, [selectedProject, filtered]);

  const selectedIndex = selectedProject ? filtered.indexOf(selectedProject) : -1;
  const navigateLightbox = (direction: number) => {
    if (selectedIndex < 0) return;
    setSelectedProject(filtered[(selectedIndex + direction + filtered.length) % filtered.length]);
  };

  const browseCategory = (category: string) => {
    setActiveCategory(category);
    document.getElementById('projecten-grid-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <section className="denra-portfolio-hero pt-36 pb-16 lg:pt-44 lg:pb-20" aria-label={t('portfolioPage.heroAria')}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <m.div
              initial={animateIn && { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="border-b border-[#7a6552]/20 pb-12 text-center lg:pb-16"
            >
              <div className="min-w-0">
                <div className="flex items-center justify-center gap-3 mb-7"><span className="denra-line" /><span className="denra-label">{t('portfolioPage.label')}</span><span className="denra-line" /></div>
                <p className="denra-label mb-4">{t('portfolioPage.eyebrow')}</p>
                <h1 className="mx-auto max-w-3xl font-serif text-5xl font-semibold leading-[0.9] text-[#231A12] sm:text-6xl lg:text-7xl">{t('portfolioPage.title').split('|')[0]}<br />{t('portfolioPage.title').split('|')[1]}</h1>
                <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-[#5f544a]">{t('portfolioPage.description')}</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button type="button" onClick={() => browseCategory('Badkamer')} className="denra-button-primary">{t('portfolioPage.bathrooms')} <ArrowRight size={16} /></button><button type="button" onClick={() => browseCategory('WC')} className="denra-portfolio-hero-action">{t('portfolioPage.toilets')} <ArrowRight size={16} /></button></div>
              </div>
              <div className="mx-auto mt-10 flex max-w-lg flex-wrap justify-center gap-x-6 gap-y-2 border-t border-[#7a6552]/20 pt-5 text-xs uppercase tracking-[0.14em] text-[#5f544a]">
                <span><strong className="mr-1 font-medium text-[#231A12]">{allProjects.length}</strong>{t('portfolioPage.projects')}</span><span>{t('portfolioPage.bathroom')}</span><span>{t('portfolioPage.toilet')}</span><span>{t('portfolioPage.interior')}</span>
              </div>
            </m.div>
          </div>
        </section>

        <section className="denra-portfolio-content py-12 lg:py-16" aria-labelledby="projecten-grid-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="denra-portfolio-toolbar mb-14">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0"><p className="denra-label mb-3">{t('portfolioPage.browse')}</p><div className="flex flex-wrap gap-2" role="group" aria-label={t('portfolioPage.filterAria')}>{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`denra-portfolio-filter ${activeCategory === category ? 'is-active' : ''}`}>{category === 'Alle' ? t('portfolioPage.all') : category === 'Badkamer' ? t('portfolioPage.bathroomsPlural') : categoryLabel(category)}</button>)}</div></div>
                
              </div>
              <p className="mt-6 border-t border-[#7a6552]/15 pt-4 text-sm text-[#71665b]">{filtered.length} {filtered.length === 1 ? t('portfolioPage.project') : t('portfolioPage.projectsPlural')} {t('portfolioPage.selected')}</p>
            </div>

            <h2 id="projecten-grid-heading" className="sr-only">{t('portfolioPage.overview')}</h2>
            {filtered.length > 0 ? <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
              {filtered.map((project, index) => (
                <m.article
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className={`group min-w-0 sm:col-span-1 ${index % 5 === 0 ? 'denra-project-featured sm:col-span-2' : ''} ${gridVariant(index)}`}
                >
                  <button
                    type="button"
                    className={`denra-project-image relative mb-4 block w-full overflow-hidden rounded-sm border border-[#cdb99f]/75 bg-[#f3ebdf] ${gridVariant(index)} focus:outline-none focus:ring-2 focus:ring-[#7a6552] focus:ring-offset-2`}
                    onClick={(event) => { triggerButtonRef.current = event.currentTarget; setSelectedProject(project); track('project_view', { project: project.id, category: project.category }); }}
                    aria-label={`${t('portfolioPage.viewPhoto')} ${projectTitle(project)}`}
                  >
                    <img
                      src={project.image}
                      srcSet={project.srcSet}
                      sizes="(min-width: 1024px) 60vw, (min-width: 640px) 50vw, 100vw"
                      alt={project.alt || projectTitle(project)}
                      width={800}
                      height={600}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <span className="denra-project-overlay">{t('portfolioPage.viewProject')} <ArrowRight size={14} /></span>
                  </button>
                  <div className="denra-project-info min-w-0 px-0.5">
                    <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#7a6552]"><span>{String(index + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</span><span>{categoryLabel(project.category)}</span></div>
                    <h3 className="break-words font-serif text-2xl font-semibold leading-tight text-[#231A12] transition-colors duration-200 group-hover:text-[#7a6552] md:text-[1.75rem]">{projectTitle(project)}</h3>
                    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6B5D50]">{project.location && <span className="flex min-w-0 items-center gap-1"><MapPin size={14} aria-hidden="true" /><span className="break-words">{project.location}</span></span>}</div>
                    <p className="mt-3 max-w-md break-words text-sm leading-relaxed text-[#71665b]">{projectDescription(project)}</p>
                    <button type="button" onClick={(event) => { triggerButtonRef.current = event.currentTarget; setSelectedProject(project); track('project_view', { project: project.id, category: project.category }); }} className="denra-project-link">{t('portfolioPage.viewProject')} <ArrowRight size={15} /></button>
                  </div>
                </m.article>
              ))}
            </div> : <div className="border-y border-[#7a6552]/20 py-14 text-center"><h3 className="font-serif text-2xl font-semibold text-[#231A12]">{t('portfolioPage.noProjects')}</h3><p className="mt-2 text-sm text-[#5f544a]">{t('portfolioPage.withinSelection')}</p><button type="button" onClick={() => setActiveCategory('Alle')} className="mt-5 border-b border-[#7a6552]/50 pb-1 text-sm font-medium text-[#231A12]">{t('portfolioPage.clearFilters')}</button></div>}
          </div>
        </section>
        <section className="bg-[#231A12] py-20 text-[#F6F0E8] lg:py-24"><div className="max-w-7xl mx-auto px-6 lg:px-8"><div className="max-w-3xl"><p className="denra-label !text-[#d8c7b3] mb-5">{t('portfolioPage.ctaEyebrow')}</p><h2 className="font-serif text-4xl font-semibold leading-[0.95] sm:text-5xl">{t('portfolioPage.ctaTitle').split('|')[0]}<br />{t('portfolioPage.ctaTitle').split('|')[1]}</h2><p className="mt-6 max-w-xl leading-relaxed text-[#ddd3c5]">{t('portfolioPage.ctaDescription')}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="/contact" className="denra-button-secondary border-[#f6f0e8]/45 !bg-[#F6F0E8] !text-[#231A12] hover:!bg-[#e5dbcd]">{t('portfolioPage.consultation')} <ArrowRight size={16} /></a><a href="/configurator" className="denra-button-secondary border-[#f6f0e8]/45 !text-[#F6F0E8] hover:bg-[#f6f0e8]/10">{t('portfolioPage.calculate')}</a></div><ServiceLinks /></div></div></section>
      </main>
      {selectedProject && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#17110d]/95 p-5 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={t('portfolioPage.dialog')}
          onClick={() => setSelectedProject(null)}
        >
          <button
            type="button"
            ref={closeButtonRef}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-11 w-11 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setSelectedProject(null)}
            aria-label={t('portfolioPage.closeDialog')}
          >
            <X size={20} />
          </button>
          <div className="flex min-h-0 max-w-full flex-col items-center" onClick={(event) => event.stopPropagation()}><m.img initial={animateIn && { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22 }} src={selectedProject.image} alt={selectedProject.alt || projectTitle(selectedProject)} width={1400} height={1000} className="max-h-[72vh] max-w-[90vw] object-contain shadow-[0_20px_55px_rgba(0,0,0,0.35)]" /><div className="mt-4 flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 text-[#f6f0e8]"><div><p className="font-serif text-xl">{projectTitle(selectedProject)}</p><p className="mt-1 text-sm text-[#d8c7b3]">{selectedProject.location} · {String(selectedIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</p></div><div className="flex gap-2"><button type="button" onClick={() => navigateLightbox(-1)} className="flex h-10 w-10 items-center justify-center border border-white/30 text-white hover:bg-white/10" aria-label={t('portfolioPage.previous')}><ArrowLeft size={17} /></button><button type="button" onClick={() => navigateLightbox(1)} className="flex h-10 w-10 items-center justify-center border border-white/30 text-white hover:bg-white/10" aria-label={t('portfolioPage.next')}><ArrowRight size={17} /></button></div></div></div>
        </m.div>
      )}
      <Footer />
      <WhatsAppButton />
    </>
  );
}