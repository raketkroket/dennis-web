import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';

const allProjects = [
  { id: 1, title: 'Luxe badkamer', category: 'Badkamer', style: 'Modern Luxe', image: sitePhotos[0], desc: 'Complete renovatie met luxe materialen en een rustige uitstraling', location: 'Beelthoven' },
  { id: 28, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Modern Luxe', image: sitePhotos[27], desc: 'Zachte tinten en hoogwaardige afwerking voor dagelijks comfort', location: 'Beelthoven' },
  { id: 44, title: 'Badkamerproject', category: 'Badkamer', style: 'Warm Minimal', image: sitePhotos[20], desc: 'Warme materialen, zachte verlichting en een verfijnde afwerking', location: 'Beelthoven' },
  { id: 45, title: 'Badkamerproject', category: 'Badkamer', style: 'Scandinavisch', image: sitePhotos[21], desc: 'Een rustige badkamer met natuurlijke tinten en luxe details', location: 'Beelthoven' },
  { id: 46, title: 'Badkamerproject', category: 'Badkamer', style: 'Modern Minimal', image: sitePhotos[26], desc: 'Een moderne badkamer met donkere tegels en warme accenten', location: 'Beelthoven' },
  { id: 2, title: 'Badkamerproject', category: 'Badkamer', style: 'Natural Luxury', image: sitePhotos[1], desc: 'Houten detail, ronde vormen en een zachte neutraliteit', location: 'Almere Overgooi' },
  { id: 3, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Modern Luxe', image: sitePhotos[2], desc: 'Warm, licht en tijdloos met hoogwaardige afwerking', location: 'Almere Overgooi' },
  { id: 5, title: 'Boutique badkamer', category: 'Badkamer', style: 'Japandi', image: sitePhotos[29], desc: 'Rustige materialen en een moderne, praktische indeling', location: 'Almere Overgooi' },
  { id: 6, title: 'Badkamerproject', category: 'Badkamer', style: 'Natural Luxury', image: sitePhotos[12], desc: 'Premium badkamer met een rustige, luxe materialenmix', location: 'Almere Poort' },
  { id: 8, title: 'Badkamerproject', category: 'Badkamer', style: 'Hotel Chique', image: sitePhotos[14], desc: 'Natuurlijke afwerkingen en een moderne ruimtelijke indeling', location: 'Almere Poort' },
  { id: 11, title: 'Badkamerproject', category: 'Badkamer', style: 'Natural Luxury', image: sitePhotos[17], desc: 'Minimalistisch en strak met warme materialen', location: 'Almere Poort' },
  { id: 7, title: 'Badkamerproject', category: 'Badkamer', style: 'Modern Minimal', image: sitePhotos[13], desc: 'Houten accenten en een tijdloze, warme uitstraling', location: 'Almere Poort' },
  { id: 10, title: 'Badkamerproject', category: 'Badkamer', style: 'Modern Minimal', image: sitePhotos[16], desc: 'Premium materiaalgebruik en zachte neutraliteit', location: 'Almere Buiten' },
  { id: 12, title: 'Badkamerproject', category: 'Badkamer', style: 'Hotel Chique', image: sitePhotos[18], desc: 'Luxe badkamer met subtiele natuurlijke details', location: 'Amsterdam Noord' },
  { id: 16, title: 'Badkamerproject', category: 'Badkamer', style: 'Hotel Chique', image: sitePhotos[22], desc: 'Premium badkamer met een warme natuurlijke sfeer', location: 'Amsterdam Noord' },
  { id: 13, title: 'Badkamerproject', category: 'Badkamer', style: 'Industrial Luxe', image: sitePhotos[19], desc: 'Zachte texturen en verfijnde, functionele badkamerarchitectuur', location: 'Zoetermeer' },
  { id: 48, title: 'Badkamerproject', category: 'Badkamer', style: 'Modern Luxe', image: sitePhotos[43], desc: 'Een stijlvolle badkamer met rustige materialen en een verfijnde afwerking', location: 'Amsterdam West' },
  { id: 25, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Warm Minimal', image: sitePhotos[24], desc: 'Warme materialen, zacht licht en een rustige afwerking', location: 'Amsterdam Noord' },
  { id: 30, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Japandi', image: sitePhotos[4], desc: 'Zachte materialen en een rustige premium uitstraling', location: 'Amsterdam Centrum' },
  { id: 52, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Scandinavisch', image: sitePhotos[3], desc: 'Een stijlvolle badkamer met hoogwaardige materialen en een rustige afwerking', location: 'Beelthoven' },
  { id: 53, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Natural Luxury', image: sitePhotos[28], desc: 'Een lichte badkamer met een verfijnde en tijdloze afwerking', location: 'Almere Overgooi' },
  { id: 50, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Japandi', image: sitePhotos[45], desc: 'Zachte materialen en een rustige premium uitstraling', location: 'Amsterdam' },
  { id: 51, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Modern Minimal', image: sitePhotos[46], desc: 'Een stijlvolle badkamer met hoogwaardige materialen en een rustige afwerking', location: 'Almere' },
  { id: 18, title: 'WC-renovatie', category: 'WC', style: 'Japandi', image: sitePhotos[8], desc: 'Een sfeervolle WC met warme natuursteenlook en zachte verlichting.', location: 'Amsterdam Centrum' },
  { id: 19, title: 'WC-renovatie', category: 'WC', style: 'Modern Luxe', image: sitePhotos[9], desc: 'Een compacte WC met luxe materialen en een rustige uitstraling.', location: 'Almere Poort' },
  { id: 21, title: 'WC-renovatie', category: 'WC', style: 'Japandi', image: sitePhotos[11], desc: 'Een minimalistisch WC met verfijnde details en warme tinten.', location: 'Amsterdam Zuid' },
  { id: 26, title: 'Badkamer renovatie', category: 'Badkamer', style: 'Modern Luxe', image: sitePhotos[25], desc: 'Een tijdloze badkamer met marmerlook, gouden kraan en sfeervolle nisverlichting.', location: 'Almere' },
  { id: 40, title: 'WC-renovatie', category: 'WC', image: sitePhotos[39], desc: 'Een warme WC met houten wand, nisverlichting en decoratieve details.', location: 'Zoetermeer' },
  { id: 41, title: 'WC-renovatie', category: 'WC', style: 'Modern Minimal', image: sitePhotos[40], desc: 'Een stijlvolle WC met zachte tegels, nis en moderne afwerking.', location: 'Almere Buiten' },
  { id: 42, title: 'WC-renovatie', category: 'WC', style: 'Natural Luxury', image: sitePhotos[41], desc: 'Een moderne WC met marmerlook, wit sanitair en warme accessoires.', location: 'Almere Stad' },
  { id: 43, title: 'WC-renovatie', category: 'WC', style: 'Japandi', image: sitePhotos[42], desc: 'Een rustige WC met houtlook, ingebouwde planken en een zwevend toilet.', location: 'Amsterdam Centrum' },
  { id: 49, title: 'WC-renovatie', category: 'WC', style: 'Warm Minimal', image: sitePhotos[44], desc: 'Een moderne WC met een rustige uitstraling en nette afwerking.', location: 'Amsterdam West' },
  { id: 22, title: 'Binnenrenovatie', category: 'Binnen', style: 'Warm Minimal', image: sitePhotos[5], desc: 'Stucwerk, vloeren en een heldere, natuurlijke finish', location: 'Amsterdam Oost' },
  { id: 23, title: 'Slaapkamer renovatie', category: 'Binnen', style: 'Warm Minimal', image: sitePhotos[7], desc: 'Helder, luxe en functioneel met een premium interieurgevoel', location: 'Amsterdam Oost' },
  { id: 24, title: 'Binnenrenovatie', category: 'Binnen', style: 'Scandinavisch', image: sitePhotos[6], desc: 'Lichte ruimtes, natuurlijke materialen en een warme sfeer', location: 'Amsterdam Centrum' },
  { id: 37, title: 'Woonkamer renovatie', category: 'Binnen', style: 'Scandinavisch', image: sitePhotos[37], desc: 'Een lichte leefruimte met natuurlijke materialen', location: 'Amsterdam Centrum' },
  { id: 34, title: 'Binnenrenovatie', category: 'Binnen', style: 'Scandinavisch', image: sitePhotos[34], desc: 'Zorgvuldig gelegd vloerwerk voor een warme basis', location: 'Amsterdam Centrum' },
  { id: 31, title: 'Binnenrenovatie', category: 'Binnen', style: 'Scandinavisch', image: sitePhotos[30], desc: 'Strakke wanden, natuurlijke vloeren en een lichte woonbasis', location: 'Amsterdam Centrum' },
  { id: 32, title: 'Binnenrenovatie', category: 'Binnen', style: 'Modern Classic', image: sitePhotos[31], desc: 'Een frisse interieurafwerking met aandacht voor proportie', location: 'Almere Stad' },
  { id: 47, title: 'Binnenrenovatie', category: 'Binnen', style: 'Modern Classic', image: sitePhotos[32], desc: 'Een lichte binnenrenovatie met een rustige, moderne afwerking', location: 'Almere Poort' },
  { id: 33, title: 'Binnenrenovatie', category: 'Binnen', style: 'Modern Classic', image: sitePhotos[33], desc: 'Licht, ruimte en een rustige afwerking van vloer tot plafond', location: 'Almere Stad' },
  { id: 35, title: 'Slaapkamer renovatie', category: 'Binnen', style: 'Modern Classic', image: sitePhotos[38], desc: 'Een serene slaapkamer met een hoogwaardige afwerking', location: 'Almere Poort' },
  { id: 36, title: 'Slaapkamer renovatie', category: 'Binnen', style: 'Hotel Chique', image: sitePhotos[36], desc: 'Rustige kleuren en maatwerkdetails voor meer comfort', location: 'Almere Poort' },
  { id: 38, title: 'Binnenrenovatie', category: 'Binnen', style: 'Modern Classic', image: sitePhotos[35], desc: 'Een compleet vernieuwd interieur met tijdloze uitstraling', location: 'Amsterdam Oostzaan' },
];

const categories = ['Alle', 'Badkamer', 'WC', 'Binnen'];
const styles = ['Alles', 'Japandi', 'Warm Minimal', 'Modern Minimal', 'Modern Luxe', 'Natural Luxury', 'Hotel Chique', 'Modern Classic', 'Scandinavisch', 'Industrial Luxe'];
type Project = (typeof allProjects)[number];

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
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [activeStyle, setActiveStyle] = useState('Alles');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const filtered = allProjects.filter((project) =>
    (activeCategory === 'Alle' || project.category === activeCategory) &&
    (activeStyle === 'Alles' || project.style === activeStyle),
  );

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
    setActiveStyle('Alles');
    document.getElementById('projecten-grid-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Header />
      <main>
        <section className="denra-portfolio-hero pt-36 pb-16 lg:pt-44 lg:pb-20" aria-label="Projecten header">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="grid gap-12 border-b border-[#7a6552]/20 pb-12 lg:grid-cols-[minmax(0,1.45fr)_260px] lg:items-end lg:pb-16"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-7"><span className="denra-line" /><span className="denra-label">Portfolio</span></div>
                <p className="denra-label mb-4">Onze projecten</p>
                <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.9] text-[#231A12] sm:text-6xl lg:text-7xl">Ruimtes die<br />tot leven komen.</h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#5f544a]">Bekijk ons werk: gerealiseerde badkamers, toiletten en verfijnde interieurs.</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => browseCategory('Badkamer')} className="denra-button-primary">Bekijk badkamers <ArrowRight size={16} /></button><button type="button" onClick={() => browseCategory('WC')} className="denra-portfolio-hero-action">Bekijk toiletten <ArrowRight size={16} /></button></div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 border-l border-[#7a6552]/20 pl-6 text-xs uppercase tracking-[0.14em] text-[#5f544a] sm:max-w-sm lg:grid-cols-1 lg:gap-4">
                <span><strong className="block font-medium text-[#231A12]">{allProjects.length}</strong>Projecten</span><span>Badkamer</span><span>WC</span><span>Interieur</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="denra-portfolio-content py-12 lg:py-16" aria-labelledby="projecten-grid-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="denra-portfolio-toolbar mb-14">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0"><p className="denra-label mb-3">Wat wilt u bekijken?</p><div className="flex flex-wrap gap-2" role="group" aria-label="Filter projecten">{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`denra-portfolio-filter ${activeCategory === category ? 'is-active' : ''}`}>{category === 'Badkamer' ? 'Badkamers' : category}</button>)}</div></div>
                <label className="denra-portfolio-style"><span className="denra-label whitespace-nowrap">Stijl</span><select value={activeStyle} onChange={(event) => setActiveStyle(event.target.value)}>{styles.map((style) => <option key={style} value={style}>{style === 'Alles' ? 'Alle stijlen' : style}</option>)}</select></label>
              </div>
              <p className="mt-6 border-t border-[#7a6552]/15 pt-4 text-sm text-[#71665b]">{filtered.length} {filtered.length === 1 ? 'project' : 'projecten'} geselecteerd</p>
            </div>

            <h2 id="projecten-grid-heading" className="sr-only">Projecten overzicht</h2>
            {filtered.length > 0 ? <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-16">
              {filtered.map((project, index) => (
                <motion.article
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
                    onClick={(event) => { triggerButtonRef.current = event.currentTarget; setSelectedProject(project); }}
                    aria-label={`Bekijk foto: ${project.title}`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={600}
                      loading={index < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <span className="denra-project-overlay">Bekijk project <ArrowRight size={14} /></span>
                  </button>
                  <div className="denra-project-info min-w-0 px-0.5">
                    <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[#7a6552]"><span>{String(index + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</span><span>{project.category}</span></div>
                    <h3 className="break-words font-serif text-2xl font-semibold leading-tight text-[#231A12] transition-colors duration-200 group-hover:text-[#7a6552] md:text-[1.75rem]">{project.title}</h3>
                    <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6B5D50]">{project.location && <span className="flex min-w-0 items-center gap-1"><MapPin size={14} aria-hidden="true" /><span className="break-words">{project.location}</span></span>}{project.style && <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7a6552]">{project.style}</span>}</div>
                    <p className="mt-3 max-w-md break-words text-sm leading-relaxed text-[#71665b]">{project.desc}</p>
                    <button type="button" onClick={(event) => { triggerButtonRef.current = event.currentTarget; setSelectedProject(project); }} className="denra-project-link">Bekijk project <ArrowRight size={15} /></button>
                  </div>
                </motion.article>
              ))}
            </div> : <div className="border-y border-[#7a6552]/20 py-14 text-center"><h3 className="font-serif text-2xl font-semibold text-[#231A12]">Geen projecten gevonden</h3><p className="mt-2 text-sm text-[#5f544a]">binnen deze selectie.</p><button type="button" onClick={() => { setActiveCategory('Alle'); setActiveStyle('Alles'); }} className="mt-5 border-b border-[#7a6552]/50 pb-1 text-sm font-medium text-[#231A12]">Wis filters</button></div>}
          </div>
        </section>
        <section className="bg-[#231A12] py-20 text-[#F6F0E8] lg:py-24"><div className="max-w-7xl mx-auto px-6 lg:px-8"><div className="max-w-3xl"><p className="denra-label !text-[#d8c7b3] mb-5">Van inspiratie naar uw eigen ruimte</p><h2 className="font-serif text-4xl font-semibold leading-[0.95] sm:text-5xl">Een renovatie begint<br />met een goed gesprek.</h2><p className="mt-6 max-w-xl leading-relaxed text-[#ddd3c5]">Heeft u een stijl of project gezien dat bij uw wensen past? Bespreek de mogelijkheden vrijblijvend met Denra.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="/contact" className="denra-button-secondary border-[#f6f0e8]/45 bg-[#F6F0E8] !text-[#231A12] hover:bg-[#e5dbcd]">Plan een kennismaking <ArrowRight size={16} /></a><a href="/configurator" className="denra-button-secondary border-[#f6f0e8]/45 !text-[#F6F0E8] hover:bg-[#f6f0e8]/10">Bereken uw prijs</a></div></div></div></section>
      </main>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#17110d]/95 p-5 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Vergrote projectfoto"
          onClick={() => setSelectedProject(null)}
        >
          <button
            type="button"
            ref={closeButtonRef}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-11 w-11 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setSelectedProject(null)}
            aria-label="Sluit vergrote foto"
          >
            <X size={20} />
          </button>
          <div className="flex min-h-0 max-w-full flex-col items-center" onClick={(event) => event.stopPropagation()}><motion.img initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22 }} src={selectedProject.image} alt={selectedProject.title} width={1400} height={1000} className="max-h-[72vh] max-w-[90vw] object-contain shadow-[0_20px_55px_rgba(0,0,0,0.35)]" /><div className="mt-4 flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 text-[#f6f0e8]"><div><p className="font-serif text-xl">{selectedProject.title}</p><p className="mt-1 text-sm text-[#d8c7b3]">{selectedProject.location}{selectedProject.style ? ` · ${selectedProject.style}` : ''} · {String(selectedIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</p></div><div className="flex gap-2"><button type="button" onClick={() => navigateLightbox(-1)} className="flex h-10 w-10 items-center justify-center border border-white/30 text-white hover:bg-white/10" aria-label="Vorig project"><ArrowLeft size={17} /></button><button type="button" onClick={() => navigateLightbox(1)} className="flex h-10 w-10 items-center justify-center border border-white/30 text-white hover:bg-white/10" aria-label="Volgend project"><ArrowRight size={17} /></button></div></div></div>
        </motion.div>
      )}
      <Footer />
      <WhatsAppButton />
    </>
  );
}