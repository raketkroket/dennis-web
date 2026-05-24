import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Configurator from '../components/Configurator';
import WhatsAppButton from '../components/WhatsAppButton';

export default function ConfiguratorPage() {
  return (
    <>
      <Header />
      <main>
        <section className="pt-40 pb-24 bg-[#FAF8F5]" aria-label="Prijscalculator">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-[#8B6F47]" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Binnen 2 minuten</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#2C2416] leading-tight mb-6">
                  Bereken uw<br />renovatieprijs
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-md">
                  Gebruik onze configurator voor een directe prijsindicatie. Selecteer uw ruimte, voer de afmetingen in en kies uw gewenste opties.
                </p>
                <div className="space-y-4">
                  {[
                    { step: '01', title: 'Kies uw ruimte', desc: 'Badkamer of WC' },
                    { step: '02', title: 'Voer afmetingen in', desc: 'Lengte en breedte in meters' },
                    { step: '03', title: 'Selecteer opties', desc: 'Extra\'s naar wens' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <span className="font-serif text-2xl font-semibold text-[#8B6F47]/30 w-10 shrink-0">{item.step}</span>
                      <div>
                        <p className="font-semibold text-[#2C2416] text-sm">{item.title}</p>
                        <p className="text-xs text-[#8A7A6A]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl overflow-hidden aspect-[16/9]">
                  <img
                    src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80"
                    alt="Luxe badkamer als inspiratie voor uw renovatie"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Configurator />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}