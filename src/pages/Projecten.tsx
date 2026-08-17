import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';

const allProjects = [
  { id: 1, title: 'Luxe badkamer Almere', category: 'Badkamer', location: 'Almere', image: sitePhotos[0], desc: 'Complete renovatie met luxe materialen en een rustige uitstraling' },
  { id: 2, title: 'Japandi badkamer Amsterdam', category: 'Badkamer', location: 'Amsterdam', image: sitePhotos[1], desc: 'Houten detail, ronde vormen en een zachte neutraliteit' },
  { id: 3, title: 'Badkamer renovatie Lelystad', category: 'Badkamer', location: 'Lelystad', image: sitePhotos[2], desc: 'Warm, licht en tijdloos met hoogwaardige afwerking' },
  { id: 4, title: 'Moderne badkamer Lelystad', category: 'Badkamer', location: 'Lelystad', image: sitePhotos[3], desc: 'Inloopdouche, warm licht en luxe details' },
  { id: 5, title: 'Boutique badkamer Almere', category: 'Badkamer', location: 'Almere', image: sitePhotos[4], desc: 'Zachte materialen en een rustige premium uitstraling' },
  { id: 6, title: 'Badkamerproject Almere', category: 'Badkamer', location: 'Almere', image: sitePhotos[12], desc: 'Premium badkamer met een rustige, luxe materialenmix' },
  { id: 7, title: 'Badkamerproject Amsterdam', category: 'Badkamer', location: 'Amsterdam', image: sitePhotos[13], desc: 'Houten accenten en een tijdloze, warme uitstraling' },
  { id: 8, title: 'Badkamerproject Almere Poort', category: 'Badkamer', location: 'Almere', image: sitePhotos[14], desc: 'Natuurlijke afwerkingen en een moderne ruimtelijke indeling' },
  { id: 9, title: 'Badkamerproject Lelystad', category: 'Badkamer', location: 'Lelystad', image: sitePhotos[15], desc: 'Licht, elegant en functioneel in een moderne badkamer' },
  { id: 10, title: 'Badkamerproject Almere', category: 'Badkamer', location: 'Almere', image: sitePhotos[16], desc: 'Premium materiaalgebruik en zachte neutraliteit' },
  { id: 11, title: 'Badkamerproject Amsterdam', category: 'Badkamer', location: 'Amsterdam', image: sitePhotos[17], desc: 'Minimalistisch en strak met warme materialen' },
  { id: 12, title: 'Badkamerproject Almere', category: 'Badkamer', location: 'Almere', image: sitePhotos[18], desc: 'Luxe badkamer met subtiele natuurlijke details' },
  { id: 13, title: 'Badkamerproject Lelystad', category: 'Badkamer', location: 'Lelystad', image: sitePhotos[19], desc: 'Zachte texturen en verfijnde, functionele badkamerarchitectuur' },
  { id: 14, title: 'Badkamerproject Amsterdam', category: 'Badkamer', location: 'Amsterdam', image: sitePhotos[20], desc: 'Warmte, rust en hoogwaardige afwerking in een compacte ruimte' },
  { id: 15, title: 'Badkamerproject Haarlem', category: 'Badkamer', location: 'Haarlem', image: sitePhotos[21], desc: 'Luxe badkamer met duidelijke verticale lijnen en rust' },
  { id: 16, title: 'Badkamerproject Utrecht', category: 'Badkamer', location: 'Utrecht', image: sitePhotos[22], desc: 'Premium badkamer met een warme natuurlijke sfeer' },
  { id: 17, title: 'Badkamerproject Almere', category: 'Badkamer', location: 'Almere', image: sitePhotos[23], desc: 'Een duurzamer, stijlvol en functioneel badkamerconcept' },
  { id: 18, title: 'WC-renovatie Amsterdam', category: 'WC', location: 'Amsterdam', image: sitePhotos[8], desc: 'Modern en stijlvol met warme stenen tinten' },
  { id: 19, title: 'WC-renovatie Haarlem', category: 'WC', location: 'Haarlem', image: sitePhotos[9], desc: 'Functioneel, elegant en compact met luxe details' },
  { id: 20, title: 'WC-renovatie Utrecht', category: 'WC', location: 'Utrecht', image: sitePhotos[10], desc: 'Een nobele uitstraling met warme natuurlijke texturen' },
  { id: 21, title: 'WC-renovatie Amsterdam 2', category: 'WC', location: 'Amsterdam', image: sitePhotos[11], desc: 'Minimalistisch en premium met een zachtere materiaalkeuze' },
  { id: 22, title: 'Binnenrenovatie Almere Poort', category: 'Binnen', location: 'Almere', image: sitePhotos[5], desc: 'Stucwerk, vloeren en een heldere, natuurlijke finish' },
  { id: 23, title: 'Woonkamer renovatie Almere', category: 'Binnen', location: 'Almere', image: sitePhotos[6], desc: 'Helder, luxe en functioneel met een premium interieurgevoel' },
  { id: 24, title: 'Binnenrenovatie Amsterdam', category: 'Binnen', location: 'Amsterdam', image: sitePhotos[7], desc: 'Lichte ruimtes, natuurlijke materialen en een warme sfeer' },
];

const categories = ['Alle', 'Badkamer', 'WC', 'Binnen'];

export default function Projecten() {
  const [activeCategory, setActiveCategory] = useState('Alle');

  const filtered = activeCategory === 'Alle'
    ? allProjects
    : allProjects.filter((p) => p.category === activeCategory);

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
                Bekijk een selectie van onze gerealiseerde renovaties in Almere, Amsterdam en omgeving.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-[#faf6f0]" aria-labelledby="projecten-grid-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Filter */}
            <div className="flex items-center gap-3 mb-12 flex-wrap" role="group" aria-label="Filter projecten">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-sm text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7a6552] focus:ring-offset-2 ${
                    activeCategory === cat
                      ? 'bg-[#231A12] text-[#F6F0E8] shadow-[0_8px_18px_rgba(29,23,18,0.12)]'
                      : 'border border-[#cfbca7] text-[#4A3F35] hover:border-[#7a6552] hover:text-[#231A12]'
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
                  <div className="relative overflow-hidden rounded-[20px] aspect-[4/3] mb-4 border border-[#dccdb4] bg-[#f3ebdf] shadow-[0_16px_36px_rgba(29,23,18,0.04)]">
                    <img
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1d1712]/30 via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-[10px] bg-[#f7f1e8]/90 text-[#7a6552] px-3 py-1 rounded-sm font-medium tracking-[0.14em] uppercase">
                        {project.category}
                      </span>
                      <span className="text-[10px] bg-[#f7f1e8]/90 text-[#4A3F35] px-3 py-1 rounded-sm tracking-[0.14em] uppercase">
                        {project.location}
                      </span>
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="font-serif text-xl md:text-[1.7rem] font-semibold text-[#231A12] mb-1 leading-tight group-hover:text-[#7a6552] transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#8A7A6A] leading-relaxed">{project.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}