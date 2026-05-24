import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Paintbrush, Grid3x3, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const services = [
  { icon: Layers, title: 'Stucwerk', desc: 'Strak afgewerkte wanden en plafonds voor een moderne uitstraling.' },
  { icon: Paintbrush, title: 'Schilderwerk', desc: 'Perfect afgewerkt voor een duurzaam en mooi resultaat.' },
  { icon: Waves, title: 'Vloeren leggen', desc: 'PVC, tegels, laminaat en visgraatpatronen op maat.' },
  { icon: Grid3x3, title: 'Verlaagd plafond & spotjes', desc: 'Voor sfeer, functionaliteit en een moderne uitstraling.' },
];

export default function Binnenrenovatie() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-40 pb-24 bg-[#FAF8F5]" aria-label="Binnenrenovatie hero">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-[#8B6F47]" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Compleet interieur</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#2C2416] leading-tight mb-6">
                  Binnenrenovatie
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-lg">
                  Van stucwerk en schilderwerk tot vloeren en verlaagde plafonds. Wij verzorgen complete binnenrenovaties in Almere en Amsterdam met oog voor detail en kwaliteit.
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
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85"
                  alt="Luxe binnenrenovatie woonkamer met stucwerk en houten vloer"
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white" aria-labelledby="binnen-diensten-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 id="binnen-diensten-heading" className="font-serif text-4xl font-semibold text-[#2C2416]">
                Onze binnenrenovatie diensten
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-6 p-8 bg-[#FAF8F5] rounded-2xl border border-[#E8DDD0]/60 hover:border-[#8B6F47]/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#8B6F47]/10 flex items-center justify-center shrink-0">
                    <s.icon size={22} className="text-[#8B6F47]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[#2C2416] mb-2">{s.title}</h3>
                    <p className="text-sm text-[#6B5D50] leading-relaxed">{s.desc}</p>
                  </div>
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