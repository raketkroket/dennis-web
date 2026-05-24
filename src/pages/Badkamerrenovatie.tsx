import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const features = [
  'Complete sloopwerkzaamheden',
  'Waterdichte afwerking (betegeling)',
  'Installatie sanitair en kranen',
  'Tegelwerk (ook in verstek)',
  'Verlaagd plafond met spotjes',
  'Vloerverwarming',
  'Niche en inbouwkranen',
  'Elektra en ventilatie',
  'PVC of tegelvloer',
  'Stucwerk en schilderwerk',
];

const projects = [
  {
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    title: 'Luxe badkamer Almere',
    desc: 'Vrijstaand bad, marmeren tegels, houten accenten',
  },
  {
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    title: 'Moderne badkamer Amsterdam',
    desc: 'Inloopdouche, verlaagd plafond, vloerverwarming',
  },
  {
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
    title: 'Japandi badkamer Almere Poort',
    desc: 'Houten meubel, ronde spiegel, naturel tinten',
  },
];

export default function Badkamerrenovatie() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-40 pb-24 bg-[#FAF8F5] overflow-hidden" aria-label="Badkamerrenovatie hero">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-[#8B6F47]" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Onze specialiteit</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#2C2416] leading-tight mb-6">
                  Badkamer&shy;renovatie
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-lg">
                  Wij realiseren complete badkamerrenovaties in Almere en Amsterdam. Van ontwerp tot oplevering — stijlvol, luxe en binnen budget. Uw droomkamer in vakkundige handen.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/configurator"
                    className="inline-flex items-center justify-center gap-2 bg-[#8B6F47] text-white font-medium px-8 py-4 rounded-full hover:bg-[#7A5F3A] hover:scale-105 transition-all duration-200 text-sm"
                  >
                    Prijs berekenen
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-[#2C2416]/20 text-[#2C2416] font-medium px-8 py-4 rounded-full hover:bg-[#2C2416] hover:text-white transition-all duration-200 text-sm"
                  >
                    Plan adviesgesprek
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="rounded-3xl overflow-hidden aspect-[4/3]"
              >
                <img
                  src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85"
                  alt="Luxe badkamerrenovatie met vrijstaand bad"
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 id="features-heading" className="font-serif text-4xl font-semibold text-[#2C2416] mb-6">
                  Alles inbegrepen,<br />niets vergeten
                </h2>
                <p className="text-[#6B5D50] leading-relaxed mb-8">
                  Onze complete badkamerrenovatie omvat alle werkzaamheden van A tot Z. U hoeft geen aparte aannemers in te schakelen — wij regelen alles.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#8B6F47]/15 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-[#8B6F47]" />
                      </div>
                      <span className="text-sm text-[#4A3F35]">{f}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl overflow-hidden aspect-square"
              >
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                  alt="Moderne badkamer met inloopdouche en marmeren tegels"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-20 bg-[#FAF8F5]" aria-labelledby="badkamer-projecten-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 id="badkamer-projecten-heading" className="font-serif text-4xl font-semibold text-[#2C2416]">
                Gerealiseerde badkamers
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group"
                >
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                    <img
                      src={p.image}
                      alt={p.title}
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#2C2416] mb-1">{p.title}</h3>
                  <p className="text-sm text-[#8A7A6A]">{p.desc}</p>
                </motion.div>
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