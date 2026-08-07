import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bath, Toilet, Home, Layers, Paintbrush, Grid3x3, Waves, ChevronRight } from 'lucide-react';
import { sitePhotos } from '../data/sitePhotos';

const services = [
  { icon: Bath, title: 'Badkamerrenovatie', desc: 'Complete renovatie van A tot Z. Stijlvol, modern en luxe.', path: '/badkamerrenovatie' },
  { icon: Waves, title: 'Vloeren leggen', desc: 'Tegels, laminaat en visgraatpatronen.', path: '/binnenrenovatie' },
  { icon: Toilet, title: 'WC-renovatie', desc: 'Maak van je toilet een stijlvolle en comfortabele ruimte.', path: '/wc-renovatie' },
  { icon: Paintbrush, title: 'Schilderwerk', desc: 'Perfect afgewerkt voor een duurzaam resultaat.', path: '/binnenrenovatie' },
  { icon: Layers, title: 'Stucwerk', desc: 'Strak afgewerkte wanden en plafonds.', path: '/binnenrenovatie' },
  { icon: Grid3x3, title: 'Verlaagd plafond & spotjes', desc: 'Voor sfeer, functionaliteit en een moderne uitstraling.', path: '/binnenrenovatie' },
];

export default function ServicesSection() {
  return (
    <section className="py-24 lg:py-28 bg-transparent" aria-labelledby="diensten-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-16 items-start">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="denra-line" />
                <span className="denra-label">Onze diensten</span>
              </div>
              <h2 id="diensten-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#1d1712] leading-tight mb-6">
                Voor elke ruimte<br />een rustig en precies resultaat
              </h2>
              <p className="text-[#5f544a] leading-relaxed mb-10 max-w-md">
                Van badkamerrenovatie tot complete binnenrenovaties. Alles wordt opgebouwd met aandacht voor materiaal, verhoudingen en afwerking.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    to={service.path}
                    className="group flex items-start gap-4 p-5 bg-[#d8cdbd]/42 border border-[#5c5147]/12 hover:border-[#5c5147]/22 transition-all duration-300"
                  >
                    <div className="w-10 h-10 border border-[#5c5147]/14 flex items-center justify-center shrink-0 group-hover:border-[#5c5147]/28 transition-colors duration-300">
                      <service.icon size={18} className="text-[#302922]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1d1712] mb-1">{service.title}</p>
                      <p className="text-xs text-[#5f544a] leading-relaxed">{service.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10"
            >
              <Link
                to="/projecten"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1712] border border-[#5c5147]/18 px-6 py-3 rounded-sm tracking-[0.16em] uppercase hover:bg-[#d8d0c4] transition-all duration-200"
              >
                Bekijk alle diensten
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Right — Configurator teaser */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="bg-[#1b1611] p-10 text-white relative overflow-hidden rounded-sm">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-white/30" />
                  <span className="denra-label text-white/55">Binnen 2 minuten een indicatie</span>
                </div>
                <h3 className="font-serif text-3xl font-semibold leading-tight mb-6 text-[#f7f2ea]">
                  Bereken eenvoudig<br />jouw renovatieprijs
                </h3>
                <ul className="space-y-3 mb-8">
                  {['Vul de afmetingen in', 'Kies jouw wensen en extra\'s', 'Ontvang direct een prijsindicatie'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                      <div className="w-5 h-5 border border-white/18 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-px bg-white/60" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/configurator"
                  className="inline-flex items-center gap-2 bg-[#f6f0e8] text-[#1d1712] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#e0d6c7] transition-all duration-200 text-sm w-full justify-center"
                >
                  Start prijsberekening
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Decorative image */}
            <div className="mt-6 overflow-hidden h-48 border border-[#5c5147]/12">
              <img
                src={sitePhotos[1]}
                alt="Luxe badkamer detail met marmeren tegels"
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}