import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';

const features = [
  'Sloopwerkzaamheden',
  'Nieuwe tegelwanden en vloer',
  'Installatie toilet en fontein',
  'Verlaagd plafond met spotjes',
  'Stucwerk en schilderwerk',
  'Elektra en ventilatie',
  'PVC of tegelvloer',
];

const projects = [
  {
    image: sitePhotos[12],
    title: 'WC-renovatie Amsterdam',
    desc: 'Modern en stijlvol, zwarte accenten',
  },
  {
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    title: 'WC-renovatie Almere',
    desc: 'Naturel tinten, marmerlook tegels',
  },
];

export default function WCRenovatie() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-40 pb-24 bg-[#FAF8F5]" aria-label="WC-renovatie hero">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-[#8B6F47]" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Stijlvol toilet</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#2C2416] leading-tight mb-6">
                  WC-renovatie
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-lg">
                  Maak van uw toilet een stijlvolle en comfortabele ruimte. Wij verzorgen complete WC-renovaties in Almere en Amsterdam — snel, netjes en binnen budget.
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
                  src={sitePhotos[11]}
                  alt="Luxe badkamerrenovatie met vrijstaand bad"
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white" aria-labelledby="wc-features-heading">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 id="wc-features-heading" className="font-serif text-4xl font-semibold text-[#2C2416] mb-4">
                Wat is inbegrepen?
              </h2>
              <p className="text-[#6B5D50]">Complete WC-renovatie van A tot Z, zonder verrassingen.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-center gap-3 p-4 bg-[#FAF8F5] rounded-xl"
                >
                  <div className="w-6 h-6 rounded-full bg-[#8B6F47]/15 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#8B6F47]" />
                  </div>
                  <span className="text-sm font-medium text-[#4A3F35]">{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#FAF8F5]" aria-labelledby="wc-projecten-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 id="wc-projecten-heading" className="font-serif text-4xl font-semibold text-[#2C2416]">
                Gerealiseerde WC's
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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