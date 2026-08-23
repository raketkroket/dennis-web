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
  'Tegelvloer',
];

const projects = [
  {
    image: sitePhotos[8],
    title: 'WC-renovatie',
    desc: 'Modern en stijlvol, warme stenen tonen en vaste afwerking',
  },
  {
    image: sitePhotos[9],
    title: 'WC-renovatie',
    desc: 'Naturel tinten, lichte materialen en een luxe uitstraling',
  },
];

const luxePricing = [
  { label: 'Sloop en afvoer', price: '€300 tot €500' },
  { label: 'Leidingwerk aanpassen', price: '€400 tot €900' },
  { label: 'Geberit inbouwreservoir plaatsen', price: '€700 tot €1.000' },
  { label: 'Hangtoilet monteren', price: '€250 tot €450' },
  { label: 'Tegelwerk tot plafond', price: '€900 tot €1.500' },
  { label: 'Stuc- en plafondafwerking', price: '€250 tot €450' },
  { label: 'Kit- en afwerking', price: '€150 tot €300' },
];

const luxeAdvies = [
  { label: 'Basisprijs', price: '€4.250' },
  { label: 'Geberit Duofix inclusief montage', price: '+ €1.250' },
  { label: 'Tegelwerk in verstek', price: '+ €350' },
  { label: 'Nis', price: '+ €450' },
  { label: 'Inbouwkraan fonteintje', price: '+ €350' },
];

export default function WCRenovatie() {
  return (
    <>
      <Header />
      <main>
        <section className="relative pt-40 pb-24 bg-[#f2eee9]" aria-label="WC-renovatie hero">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 xl:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="order-2 lg:order-1 rounded-[30px] overflow-hidden aspect-[4/3] border border-[#d3c5b6] shadow-[0_20px_40px_rgba(40,30,25,0.08)] bg-[#e9dfd3]"
              >
                <img
                  src={sitePhotos[8]}
                  alt="Luxe WC-renovatie met serene, hoogwaardige afwerking"
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="order-1 lg:order-2 max-w-xl ml-auto"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="denra-line" />
                  <span className="denra-label bg-[#e6ddd3] text-[#42362d]">Stijlvol toilet</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#231A12] leading-[0.96] mb-6">
                  WC-renovatie
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-8 text-lg">
                  Maak van uw toilet een stijlvolle en comfortabele ruimte. Wij verzorgen complete WC-renovaties in Almere en Amsterdam — snel, netjes en binnen budget.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/configurator"
                    className="inline-flex items-center justify-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] transition-all duration-200 text-sm"
                  >
                    Prijs berekenen
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 border border-[#7a6552]/20 text-[#231A12] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#231A12] hover:text-white transition-all duration-200 text-sm"
                  >
                    Plan adviesgesprek
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#faf6f0]" aria-labelledby="wc-features-heading">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 id="wc-features-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-4">
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
                  className="flex items-center gap-3 p-4 bg-[#faf6f0] rounded-sm border border-[#cfbca7]/55"
                >
                  <div className="w-6 h-6 rounded-full bg-[#e8ddcf] flex items-center justify-center shrink-0">
                    <Check size={12} className="text-[#7a6552]" />
                  </div>
                  <span className="text-sm font-medium text-[#4A3F35]">{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f4efe8]" aria-labelledby="wc-begeleiding-heading">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="denra-line" />
              <span className="denra-label">Van ontwerp tot oplevering</span>
              <div className="denra-line" />
            </div>
            <h2 id="wc-begeleiding-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-6">
              Ook hulp nodig bij sanitair en tegels?
            </h2>
            <p className="text-[#6B5D50] leading-relaxed mb-4">
              Ook voor sanitair en tegels voor uw nieuwe toilet kunnen wij u uiteraard helpen. Via een van onze vaste partners kunnen wij dit voor u verzorgen en mogelijk een aantrekkelijkere prijs aanbieden.
            </p>
            <p className="text-[#6B5D50] leading-relaxed mb-4">
              Daarnaast kunnen we een vakkundig ontwerp inclusief 3D-tekening laten maken, zodat u vooraf een duidelijk beeld krijgt van het eindresultaat.
            </p>
            <p className="text-[#4A3F35] font-medium leading-relaxed">
              Zo verzorgen wij het complete traject: van ontwerp, sanitair en tegels tot de volledige renovatie en oplevering.
            </p>
          </div>
        </section>

        <section className="py-20 bg-[#f6f0e8]" aria-labelledby="wc-luxe-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-sm bg-[#faf6f0] border border-[#cfbca7]/55 p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="denra-line" />
                  <span className="denra-label">Luxe toiletrenovatie</span>
                </div>
                <h2 id="wc-luxe-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-4">
                  Indicatieve calculatorprijzen voor een luxe toiletrenovatie.
                </h2>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-2xl">
                  Werkzaamheden en prijsindicaties.
                </p>
                <div className="space-y-3">
                  {luxePricing.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 rounded-sm border border-[#cfbca7] bg-[#f6f0e8] px-4 py-3"
                    >
                      <p className="font-medium text-[#231A12]">{item.label}</p>
                      <p className="text-sm font-semibold text-[#7a6552]">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-sm bg-[#231A12] p-6 text-white">
                  <p className="denra-label text-[#cfbca7] mb-2">Totaal luxe toiletrenovatie</p>
                  <p className="font-serif text-4xl font-semibold mb-2">€3.800 tot €5.200</p>
                  <p className="text-sm text-[#B7A892]">Prijsindicatie op basis van de opgegeven werkzaamheden.</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-sm bg-[#231A12] p-8 text-white"
              >
                <p className="denra-label text-[#cfbca7] mb-3">Advies calculator basisprijs DENRA</p>
                <h3 className="font-serif text-3xl font-semibold mb-6">Luxe uitvoering totaal</h3>
                <div className="space-y-4 mb-8">
                  {luxeAdvies.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                      <p className="text-sm text-[#E6DED1]">{item.label}</p>
                      <p className="text-sm font-semibold text-white">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-white/5 p-5">
                  <p className="denra-label text-[#cfbca7] mb-2">Luxe uitvoering totaal</p>
                  <p className="font-serif text-4xl font-semibold">€5.500 tot €6.500</p>
                </div>
                <p className="mt-6 text-sm text-[#B7A892]">Basisprijs: €4.250. Geberit Duofix inclusief montage: + €1.250. Tegelwerk in verstek: + €350. Nis: + €450. Inbouwkraan fonteintje: + €350.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#faf6f0]" aria-labelledby="wc-projecten-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 id="wc-projecten-heading" className="font-serif text-4xl font-semibold text-[#231A12]">
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
                  <h3 className="font-serif text-lg font-semibold text-[#231A12] mb-1">{p.title}</h3>
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