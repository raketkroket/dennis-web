import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bath, Toilet, Home, Layers, Paintbrush, Grid3x3, Waves, ChevronRight } from 'lucide-react';

const services = [
  { icon: Bath, title: 'Badkamerrenovatie', desc: 'Complete renovatie van A tot Z. Stijlvol, modern en luxe.', path: '/badkamerrenovatie' },
  { icon: Waves, title: 'Vloeren leggen', desc: 'PVC, tegels, laminaat en visgraatpatronen.', path: '/binnenrenovatie' },
  { icon: Toilet, title: 'WC-renovatie', desc: 'Maak van je toilet een stijlvolle en comfortabele ruimte.', path: '/wc-renovatie' },
  { icon: Paintbrush, title: 'Schilderwerk', desc: 'Perfect afgewerkt voor een duurzaam resultaat.', path: '/binnenrenovatie' },
  { icon: Layers, title: 'Stucwerk', desc: 'Strak afgewerkte wanden en plafonds.', path: '/binnenrenovatie' },
  { icon: Grid3x3, title: 'Verlaagd plafond & spotjes', desc: 'Voor sfeer, functionaliteit en een moderne uitstraling.', path: '/binnenrenovatie' },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-[#FAF8F5]" aria-labelledby="diensten-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-[#D5C0A7]" />
                <span className="text-xs tracking-[0.25em] uppercase text-[#D5C0A7] font-medium">Onze diensten</span>
              </div>
              <h2 id="diensten-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#2C2416] leading-tight mb-6">
                Voor elke ruimte<br />de perfecte oplossing
              </h2>
              <p className="text-[#6B5D50] leading-relaxed mb-10 max-w-md">
                Van badkamerrenovatie tot complete binnenrenovaties. Wij leveren maatwerk met oog voor detail en gebruiken alleen materialen van de hoogste kwaliteit.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#E8DDD0]/60 hover:border-[#D5C0A7]/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] flex items-center justify-center shrink-0 group-hover:bg-[#D5C0A7]/10 transition-colors duration-300">
                      <service.icon size={18} className="text-[#D5C0A7]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C2416] mb-1">{service.title}</p>
                      <p className="text-xs text-[#8A7A6A] leading-relaxed">{service.desc}</p>
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
                className="inline-flex items-center gap-2 text-sm font-medium text-[#D5C0A7] border border-[#D5C0A7]/40 px-6 py-3 rounded-full hover:bg-[#D5C0A7] hover:text-[#2C2416] transition-all duration-200"
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
            <div className="bg-[#2C2416] rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D5C0A7]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D5C0A7]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-[#D5C0A7]" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[#D5C0A7] font-medium">Binnen 2 minuten een indicatie</span>
                </div>
                <h3 className="font-serif text-3xl font-semibold leading-tight mb-6">
                  Bereken eenvoudig<br />jouw renovatieprijs
                </h3>
                <ul className="space-y-3 mb-8">
                  {['Vul de afmetingen in', 'Kies jouw wensen en extra\'s', 'Ontvang direct een prijsindicatie'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#C4A882]">
                      <div className="w-5 h-5 rounded-full bg-[#D5C0A7]/30 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D5C0A7]" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/configurator"
                  className="inline-flex items-center gap-2 bg-[#D5C0A7] text-[#2C2416] font-medium px-8 py-4 rounded-full hover:bg-[#C7AF94] hover:scale-105 transition-all duration-200 text-sm tracking-wide w-full justify-center"
                >
                  Start prijsberekening
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Decorative image */}
            <div className="mt-6 rounded-2xl overflow-hidden h-48">
              <img
                src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"
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