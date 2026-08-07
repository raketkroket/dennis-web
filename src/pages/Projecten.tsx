import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const allProjects = [
  { id: 1, title: 'Luxe badkamer Almere', category: 'Badkamer', location: 'Almere', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', desc: 'Complete renovatie met vrijstaand bad en marmeren tegels' },
  { id: 2, title: 'WC-renovatie Amsterdam', category: 'WC', location: 'Amsterdam', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80', desc: 'Modern en stijlvol met zwarte accenten' },
  { id: 3, title: 'Binnenrenovatie Almere Poort', category: 'Binnen', location: 'Almere', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', desc: 'Stucwerk, vloeren en schilderwerk' },
  { id: 4, title: 'Japandi badkamer Amsterdam', category: 'Badkamer', location: 'Amsterdam', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80', desc: 'Houten meubel, ronde spiegel, naturel tinten' },
  { id: 5, title: 'Moderne badkamer Lelystad', category: 'Badkamer', location: 'Lelystad', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', desc: 'Inloopdouche, verlaagd plafond, vloerverwarming' },
  { id: 6, title: 'Woonkamer renovatie Almere', category: 'Binnen', location: 'Almere', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', desc: 'Stucwerk, nieuwe vloer en schilderwerk' },
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
                      ? 'bg-[#231A12] text-[#F6F0E8]'
                      : 'border border-[#cfbca7] text-[#4A3F35] hover:border-[#7a6552] hover:text-[#231A12]'
                  }`}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 id="projecten-grid-heading" className="sr-only">Projecten overzicht</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-xs bg-[#f7f1e8]/90 text-[#7a6552] px-3 py-1 rounded-sm font-medium">
                        {project.category}
                      </span>
                        <span className="text-xs bg-[#f7f1e8]/90 text-[#4A3F35] px-3 py-1 rounded-sm">
                        {project.location}
                      </span>
                    </div>
                  </div>
                    <h3 className="font-serif text-xl font-semibold text-[#231A12] mb-1 group-hover:text-[#7a6552] transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#8A7A6A]">{project.desc}</p>
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