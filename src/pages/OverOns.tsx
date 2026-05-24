import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function OverOns() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-40 pb-24 bg-[#FAF8F5]" aria-label="Over ons">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-[#8B6F47]" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Ons verhaal</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#2C2416] leading-tight mb-6">
                  Over Nivora
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-6">
                  Nivora is een premium renovatiebedrijf gespecialiseerd in luxe badkamerrenovaties, WC-renovaties en complete binnenrenovaties in Almere en Amsterdam.
                </p>
                <p className="text-[#6B5D50] leading-relaxed mb-6">
                  Met meer dan 5 jaar ervaring en 100+ tevreden klanten leveren wij vakmanschap tot in detail. Wij werken uitsluitend met premium materialen en staan garant voor een strakke planning en vaste prijs vooraf.
                </p>
                <p className="text-[#6B5D50] leading-relaxed mb-10">
                  Uitvoering door <strong className="text-[#2C2416]">Denra Montage en Onderhoud</strong> — uw betrouwbare partner voor alle renovatiewerkzaamheden.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#8B6F47] text-white font-medium px-8 py-4 rounded-full hover:bg-[#7A5F3A] hover:scale-105 transition-all duration-200 text-sm"
                >
                  Neem contact op
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="rounded-3xl overflow-hidden aspect-[4/3]"
              >
                <img
                  src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=85"
                  alt="Nivora team aan het werk aan een luxe badkamerrenovatie"
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white" aria-labelledby="waarden-heading">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 id="waarden-heading" className="font-serif text-4xl font-semibold text-[#2C2416] mb-6">
                Onze waarden
              </h2>
              <p className="text-[#6B5D50] leading-relaxed mb-12">
                Wij geloven dat een renovatie meer is dan alleen bouwen. Het gaat om vertrouwen, kwaliteit en het realiseren van uw droominterieur.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Vakmanschap', desc: 'Elk detail telt. Wij werken met precisie en passie voor het vak.' },
                { title: 'Transparantie', desc: 'Vaste prijs vooraf, geen verrassingen. Eerlijk en duidelijk.' },
                { title: 'Kwaliteit', desc: 'Alleen premium materialen. Garantie op al ons werk.' },
              ].map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#E8DDD0]/60"
                >
                  <h3 className="font-serif text-xl font-semibold text-[#2C2416] mb-3">{v.title}</h3>
                  <p className="text-sm text-[#6B5D50] leading-relaxed">{v.desc}</p>
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