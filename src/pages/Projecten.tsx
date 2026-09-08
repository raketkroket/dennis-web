import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';

const allProjects = [
  { id: 1, title: 'Luxe badkamer', category: 'Badkamer', image: sitePhotos[0], desc: 'Complete renovatie met luxe materialen en een rustige uitstraling', location: 'Beelthoven' },
  { id: 28, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[27], desc: 'Zachte tinten en hoogwaardige afwerking voor dagelijks comfort', location: 'Beelthoven' },
  { id: 44, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[20], desc: 'Warme materialen, zachte verlichting en een verfijnde afwerking', location: 'Beelthoven' },
  { id: 45, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[21], desc: 'Een rustige badkamer met natuurlijke tinten en luxe details', location: 'Beelthoven' },
  { id: 46, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[26], desc: 'Een moderne badkamer met donkere tegels en warme accenten', location: 'Beelthoven' },
  { id: 2, title: 'Japandi badkamer', category: 'Badkamer', image: sitePhotos[1], desc: 'Houten detail, ronde vormen en een zachte neutraliteit', location: 'Almere Overgooi' },
  { id: 3, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[2], desc: 'Warm, licht en tijdloos met hoogwaardige afwerking', location: 'Almere Overgooi' },
  { id: 5, title: 'Boutique badkamer', category: 'Badkamer', image: sitePhotos[29], desc: 'Rustige materialen en een moderne, praktische indeling', location: 'Almere Overgooi' },
  { id: 6, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[12], desc: 'Premium badkamer met een rustige, luxe materialenmix', location: 'Almere Poort' },
  { id: 8, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[14], desc: 'Natuurlijke afwerkingen en een moderne ruimtelijke indeling', location: 'Almere Poort' },
  { id: 11, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[17], desc: 'Minimalistisch en strak met warme materialen', location: 'Almere Poort' },
  { id: 7, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[13], desc: 'Houten accenten en een tijdloze, warme uitstraling', location: 'Almere Poort' },
  { id: 10, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[16], desc: 'Premium materiaalgebruik en zachte neutraliteit', location: 'Almere Buiten' },
  { id: 12, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[18], desc: 'Luxe badkamer met subtiele natuurlijke details', location: 'Amsterdam Noord' },
  { id: 16, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[22], desc: 'Premium badkamer met een warme natuurlijke sfeer', location: 'Amsterdam Noord' },
  { id: 13, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[19], desc: 'Zachte texturen en verfijnde, functionele badkamerarchitectuur', location: 'Zoetermeer' },
  { id: 48, title: 'Badkamerproject', category: 'Badkamer', image: sitePhotos[43], desc: 'Een stijlvolle badkamer met rustige materialen en een verfijnde afwerking', location: 'Amsterdam West' },
  { id: 25, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[24], desc: 'Warme materialen, zacht licht en een rustige afwerking', location: 'Amsterdam Noord' },
  { id: 30, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[4], desc: 'Zachte materialen en een rustige premium uitstraling', location: 'Amsterdam Centrum' },
  { id: 52, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[3], desc: 'Een stijlvolle badkamer met hoogwaardige materialen en een rustige afwerking', location: 'Beelthoven' },
  { id: 53, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[28], desc: 'Een lichte badkamer met een verfijnde en tijdloze afwerking', location: 'Almere Overgooi' },
  { id: 50, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[45], desc: 'Zachte materialen en een rustige premium uitstraling', location: 'Amsterdam' },
  { id: 51, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[46], desc: 'Een stijlvolle badkamer met hoogwaardige materialen en een rustige afwerking', location: 'Almere' },
  { id: 18, title: 'WC-renovatie', category: 'WC', image: sitePhotos[8], desc: 'Een sfeervolle WC met warme natuursteenlook en zachte verlichting.', location: 'Amsterdam Centrum' },
  { id: 19, title: 'WC-renovatie', category: 'WC', image: sitePhotos[9], desc: 'Een compacte WC met luxe materialen en een rustige uitstraling.', location: 'Almere Poort' },
  { id: 21, title: 'WC-renovatie', category: 'WC', image: sitePhotos[11], desc: 'Een minimalistische WC met verfijnde details en warme tinten.', location: 'Amsterdam Zuid' },
  { id: 26, title: 'Badkamer renovatie', category: 'Badkamer', image: sitePhotos[25], desc: 'Een tijdloze badkamer met marmerlook, gouden kraan en sfeervolle nisverlichting.', location: 'Almere' },
  { id: 40, title: 'WC-renovatie', category: 'WC', image: sitePhotos[39], desc: 'Een warme WC met houten wand, nisverlichting en decoratieve details.', location: 'Zoetermeer' },
  { id: 41, title: 'WC-renovatie', category: 'WC', image: sitePhotos[40], desc: 'Een stijlvolle WC met zachte tegels, nis en moderne afwerking.', location: 'Almere Buiten' },
  { id: 42, title: 'WC-renovatie', category: 'WC', image: sitePhotos[41], desc: 'Een moderne WC met marmerlook, wit sanitair en warme accessoires.', location: 'Almere Stad' },
  { id: 43, title: 'WC-renovatie', category: 'WC', image: sitePhotos[42], desc: 'Een rustige WC met houtlook, ingebouwde planken en een zwevend toilet.', location: 'Amsterdam Centrum' },
  { id: 49, title: 'WC-renovatie', category: 'WC', image: sitePhotos[44], desc: 'Een moderne WC met een rustige uitstraling en nette afwerking.', location: 'Amsterdam West' },
  { id: 22, title: 'Binnenrenovatie', category: 'Binnen', image: sitePhotos[5], desc: 'Stucwerk, vloeren en een heldere, natuurlijke finish', location: 'Amsterdam Oost' },
  { id: 23, title: 'Woonkamer renovatie', category: 'Binnen', image: sitePhotos[7], desc: 'Helder, luxe en functioneel met een premium interieurgevoel', location: 'Amsterdam Oost' },
  { id: 24, title: 'Binnenrenovatie', category: 'Binnen', image: sitePhotos[6], desc: 'Lichte ruimtes, natuurlijke materialen en een warme sfeer', location: 'Amsterdam Centrum' },
  { id: 37, title: 'Woonkamer renovatie', category: 'Binnen', image: sitePhotos[37], desc: 'Een lichte leefruimte met natuurlijke materialen', location: 'Amsterdam Centrum' },
  { id: 34, title: 'Binnenrenovatie', category: 'Binnen', image: sitePhotos[34], desc: 'Zorgvuldig gelegd vloerwerk voor een warme basis', location: 'Amsterdam Centrum' },
  { id: 31, title: 'Binnenrenovatie', category: 'Binnen', image: sitePhotos[30], desc: 'Strakke wanden, natuurlijke vloeren en een lichte woonbasis', location: 'Amsterdam Centrum' },
  { id: 32, title: 'Binnenrenovatie', category: 'Binnen', image: sitePhotos[31], desc: 'Een frisse interieurafwerking met aandacht voor proportie', location: 'Almere Stad' },
  { id: 47, title: 'Binnenrenovatie', category: 'Binnen', image: sitePhotos[32], desc: 'Een lichte binnenrenovatie met een rustige, moderne afwerking', location: 'Almere Poort' },
  { id: 33, title: 'Binnenrenovatie', category: 'Binnen', image: sitePhotos[33], desc: 'Licht, ruimte en een rustige afwerking van vloer tot plafond', location: 'Almere Stad' },
  { id: 35, title: 'Slaapkamer renovatie', category: 'Binnen', image: sitePhotos[38], desc: 'Een serene slaapkamer met een hoogwaardige afwerking', location: 'Almere Poort' },
  { id: 36, title: 'Slaapkamer renovatie', category: 'Binnen', image: sitePhotos[36], desc: 'Rustige kleuren en maatwerkdetails voor meer comfort', location: 'Almere Poort' },
  { id: 38, title: 'Binnenrenovatie', category: 'Binnen', image: sitePhotos[35], desc: 'Een compleet vernieuwd interieur met tijdloze uitstraling', location: 'Amsterdam Oostzaan' },
];

const categories = ['Alle', 'Badkamer', 'WC', 'Binnen'];

export default function Projecten() {
  const [activeCategory, setActiveCategory] = useState('Alle');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const filtered = activeCategory === 'Alle'
    ? allProjects
    : allProjects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    if (!selectedImage) return undefined;
    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedImage]);

  return (
    <>
      <Header />
      <main>
        <section className="pt-40 pb-16 bg-[#f6f0e8]" aria-label="Projecten header">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="denra-line" />
                <span className="denra-label">Portfolio</span>
                <div className="denra-line" />
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#231A12] leading-tight mb-6">
                Onze projecten
              </h1>
              <p className="text-[#6B5D50] max-w-xl mx-auto leading-relaxed">
                Bekijk een selectie van onze gerealiseerde renovaties.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-[#faf6f0]" aria-labelledby="projecten-grid-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Filter */}
            <div className="-mx-6 px-6 sm:mx-0 sm:px-0 flex items-center gap-2 mb-12 overflow-x-auto pb-2" role="group" aria-label="Filter projecten">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 min-h-11 px-5 py-2 rounded-sm text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7a6552] focus:ring-offset-2 ${
                    activeCategory === cat
                      ? 'bg-[#231A12] text-[#F6F0E8] shadow-[0_8px_18px_rgba(29,23,18,0.12)]'
                      : 'border border-[#cfbca7] bg-white/35 text-[#4A3F35] hover:border-[#7a6552] hover:bg-white/70 hover:text-[#231A12]'
                  }`}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 id="projecten-grid-heading" className="sr-only">Projecten overzicht</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((project, i) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group h-full"
                >
                  <button
                    type="button"
                    className="relative block w-full overflow-hidden rounded-sm aspect-[4/3] mb-4 border border-[#dccdb4] bg-[#f3ebdf] shadow-[0_12px_30px_rgba(29,23,18,0.06)] transition-shadow duration-300 group-hover:shadow-[0_18px_38px_rgba(29,23,18,0.12)] focus:outline-none focus:ring-2 focus:ring-[#7a6552] focus:ring-offset-2"
                    onClick={() => setSelectedImage(project.image)}
                    aria-label={`Bekijk foto: ${project.title}`}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-[10px] bg-[#f7f1e8]/90 text-[#7a6552] px-3 py-1 rounded-sm font-medium tracking-[0.14em] uppercase">
                        {project.category}
                      </span>
                    </div>
                  </button>
                  <div className="px-1">
                    <h3 className="font-serif text-xl md:text-[1.7rem] font-semibold text-[#231A12] mb-1 leading-tight group-hover:text-[#7a6552] transition-colors duration-200">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="mb-1 flex items-center gap-1 text-sm font-medium text-[#6B5D50]">
                        <MapPin size={14} aria-hidden="true" />
                        {project.location}
                      </p>
                    )}
                    <p className="text-sm text-[#8A7A6A] leading-relaxed">{project.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#120d09]/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Vergrote projectfoto"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            ref={closeButtonRef}
            className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-11 w-11 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setSelectedImage(null)}
            aria-label="Sluit vergrote foto"
          >
            <X size={20} />
          </button>
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            src={selectedImage}
            alt="Vergrote projectfoto"
            width={1400}
            height={1000}
            className="max-h-[86vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </motion.div>
      )}
      <Footer />
      <WhatsAppButton />
    </>
  );
}