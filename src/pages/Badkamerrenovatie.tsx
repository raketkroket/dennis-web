import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';

const features = [
  'Complete sloopwerkzaamheden',
  'Waterdichte afwerking (betegeling)',
  'Installatie sanitair en kranen',
  'Tegelwerk (ook in verstek)',
  'Verlaagd plafond met spotjes',
  'Vloerverwarming',
  'Niche en inbouwkranen',
  'Elektra en ventilatie',
  'Tegelvloer',
  'Stucwerk en schilderwerk',
];

const projects = [
  {
    image: sitePhotos[0],
    title: 'Luxe badkamer',
    desc: 'Vrijstaand bad, natuurstenen details en warme verlichting',
  },
  {
    image: sitePhotos[1],
    title: 'Moderne badkamer',
    desc: 'Strakke lijnen, zachte materialen en een rustige luxe sfeer',
  },
  {
    image: sitePhotos[2],
    title: 'Japandi badkamer',
    desc: 'Houten accenten, ronde vormen en natuurlijke texturen',
  },
];

export default function Badkamerrenovatie() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-40 pb-24 bg-[#f7f1ea] overflow-hidden" aria-label="Badkamerrenovatie hero">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-14 xl:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="denra-line" />
                  <span className="denra-label bg-[#efe2d2] text-[#4d3d33]">Onze specialiteit</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#231A12] leading-[0.96] mb-6">
                  Badkamer & WC Renovatie in Flevoland en Noord-Holland
                </h1>
                <p className="text-[#6B5D50] leading-relaxed mb-8 text-lg">
                  Denra Badkamers is gespecialiseerd in complete badkamer- en WC-renovaties in Flevoland en Noord-Holland. Van sloopwerk, leidingwerk en tegelwerk tot sanitair, stucwerk en de complete afwerking: wij verzorgen uw renovatie van begin tot eind.
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
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative rounded-[32px] overflow-hidden aspect-[4/3] border border-[#d6c3a9] shadow-[0_20px_40px_rgba(40,30,25,0.08)] bg-[#efe4d5]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a120d]/10 to-transparent" />
                <img
                  src={sitePhotos[0]}
                  alt="Moderne badkamer met warme, elegante afwerking"
                  width={900}
                  height={675}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-[#faf6f0]" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 id="features-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-6">
                  Alles onder één dak,<br />niets vergeten
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
                      <div className="w-5 h-5 rounded-full bg-[#e8ddcf] flex items-center justify-center shrink-0">
                        <Check size={11} className="text-[#7a6552]" />
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
                  src={sitePhotos[8]}
                  alt="Moderne badkamer met natuurlijke materialen en rustige uitstraling"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f4efe8]" aria-labelledby="badkamer-begeleiding-heading">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="denra-line" />
              <span className="denra-label">Van ontwerp tot oplevering</span>
              <div className="denra-line" />
            </div>
            <h2 id="badkamer-begeleiding-heading" className="font-serif text-4xl font-semibold text-[#231A12] mb-6">
              Ook hulp nodig bij sanitair en tegels?
            </h2>
            <p className="text-[#6B5D50] leading-relaxed mb-4">
              Ook voor sanitair en tegels voor uw nieuwe badkamer kunnen wij u uiteraard helpen. Via een van onze vaste partners kunnen wij dit voor u verzorgen en mogelijk een aantrekkelijkere prijs aanbieden.
            </p>
            <p className="text-[#6B5D50] leading-relaxed mb-4">
              Daarnaast kunnen we een vakkundig badkamerontwerp inclusief 3D-tekening laten maken, zodat u vooraf een duidelijk beeld krijgt van het eindresultaat.
            </p>
            <p className="text-[#4A3F35] font-medium leading-relaxed">
              Zo verzorgen wij het complete traject: van ontwerp, sanitair en tegels tot de volledige renovatie en oplevering.
            </p>
          </div>
        </section>

        {/* Projects */}
        <section className="py-20 bg-[#f6f0e8]" aria-labelledby="badkamer-projecten-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <h2 id="badkamer-projecten-heading" className="font-serif text-4xl font-semibold text-[#231A12]">
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