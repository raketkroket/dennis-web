import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Handshake, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { sitePhotos } from '../data/sitePhotos';

const values = [
  {
    icon: ShieldCheck,
    title: 'Rust en zekerheid',
    desc: 'Duidelijke afspraken, vaste planning en een team dat doet wat het belooft.',
  },
  {
    icon: Sparkles,
    title: 'Premium afwerking',
    desc: 'Strakke details, verfijnde materialen en een resultaat dat meteen goed voelt.',
  },
  {
    icon: Layers,
    title: 'Totaalregie',
    desc: 'Van voorbereiding tot oplevering houden wij het overzicht en de kwaliteit scherp.',
  },
];

const promises = [
  'Heldere communicatie van begin tot eind',
  'Afspraken die we nakomen zonder gedoe',
  'Een resultaat dat functioneel en stijlvol is',
];

export default function OverOns() {
  return (
    <>
      <Header />
      <main>
        <section
          className="pt-36 pb-20 bg-[radial-gradient(circle_at_top_left,_rgba(203,185,165,0.18),_transparent_34%),linear-gradient(180deg,_#f6f0e8_0%,_#eee3d6_100%)] overflow-hidden"
          aria-label="Over ons"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-3 mb-6 rounded-sm border border-[#cfbca7]/70 bg-white/50 px-4 py-2 backdrop-blur-sm">
                  <Sparkles size={14} className="text-[#7a6552]" />
                  <span className="text-[11px] tracking-[0.24em] uppercase text-[#7a6552] font-medium">Over DENRA</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-[#231A12] leading-[0.95] mb-6 max-w-xl">
                  Renovaties die
                  <span className="block text-[#7a6552]">rust en klasse</span>
                  uitstralen.
                </h1>
                <p className="text-[#6B5D50] text-lg leading-relaxed mb-6 max-w-xl">
                  DENRA maakt badkamers, wc&apos;s en interieurs die strak aanvoelen, slim zijn opgebouwd en premium ogen zonder overdreven te worden.
                </p>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-xl">
                  Wij sturen op helderheid, afwerking en een proces dat soepel loopt. Geen opgeblazen praat, wel vakwerk, strakke communicatie en een eindresultaat waar u dagelijks plezier van heeft.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] transition-all duration-200 text-sm"
                  >
                    Plan een kennismaking
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/projecten"
                    className="inline-flex items-center justify-center gap-2 border border-[#7a6552]/20 text-[#231A12] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-white/60 transition-all duration-200 text-sm"
                  >
                    Bekijk projecten
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  {[
                    { value: '100+', label: 'Tevreden klanten' },
                    { value: '10+ jaar', label: 'Ervaring' },
                    { value: 'Premium', label: 'Materialen' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-sm border border-white/70 bg-white/70 px-5 py-4 backdrop-blur-sm"
                    >
                      <div className="font-serif text-2xl font-semibold text-[#231A12]">{item.value}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-[#8A7A6A] mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="relative"
              >
                <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-[#cfbca7]/35 blur-2xl" />
                <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-sm overflow-hidden min-h-[420px] border border-[#cfbca7]/55">
                    <img
                      src={sitePhotos[0]}
                      alt="Afgewerkte luxe badkamer van DENRA"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-sm overflow-hidden h-[250px] border border-[#cfbca7]/55">
                      <img
                        src={sitePhotos[4]}
                        alt="Strakke renovatie details en afwerking"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-sm bg-[#231A12] text-white p-6 flex flex-col justify-between min-h-[154px]">
                      <div className="flex items-center gap-2 text-[#cfbca7] text-xs tracking-[0.22em] uppercase">
                        <BadgeCheck size={14} />
                        Vast, strak, betrouwbaar
                      </div>
                      <p className="font-serif text-2xl leading-tight mt-4">
                        Een renovatie moet niet alleen mooi zijn, maar ook logisch voelen.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#faf6f0]" aria-labelledby="waarom-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                  <div className="denra-line" />
                  <span className="denra-label">Waarom DENRA</span>
              </div>
              <h2 id="waarom-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#231A12] leading-tight mb-5">
                Minder chaos. Meer controle. Een resultaat dat blijft staan.
              </h2>
              <p className="text-[#6B5D50] leading-relaxed text-lg">
                Wij werken niet met losse beloftes, maar met een manier van bouwen die rust geeft: duidelijke keuzes, scherpe afwerking en een team dat het overzicht bewaakt.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                    className={`rounded-sm p-8 border ${index === 1 ? 'bg-[#231A12] text-white border-[#231A12]' : 'bg-[#faf6f0] border-[#cfbca7]/70'}`}
                  >
                    <div className={`w-12 h-12 rounded-sm flex items-center justify-center mb-6 ${index === 1 ? 'bg-white/10 text-[#cfbca7]' : 'bg-white text-[#7a6552]'}`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold mb-4">{value.title}</h3>
                    <p className={`leading-relaxed ${index === 1 ? 'text-white/75' : 'text-[#6B5D50]'}`}>{value.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f6f0e8] border-y border-[#cfbca7]/60" aria-labelledby="belofte-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="denra-line" />
                  <span className="denra-label">Onze belofte</span>
                </div>
                <h2 id="belofte-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#231A12] leading-tight mb-6">
                  Wat u van ons mag verwachten
                </h2>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-lg">
                  Wij houden het simpel: duidelijke verwachtingen, nette uitvoering en een afwerking waar u niet naar hoeft te kijken omdat alles vanzelf klopt.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#231A12] text-[#F6F0E8] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#3a2d23] transition-all duration-200 text-sm"
                >
                  Start uw project
                  <ArrowRight size={16} />
                </Link>
              </motion.div>

              <div className="grid gap-4">
                {promises.map((promise, index) => (
                  <motion.div
                    key={promise}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.08 }}
                    className="flex items-center gap-4 rounded-sm bg-white px-6 py-5 border border-[#cfbca7]/70"
                  >
                    <div className="w-10 h-10 rounded-sm bg-[#e8ddcf] text-[#7a6552] flex items-center justify-center shrink-0">
                      <Handshake size={18} />
                    </div>
                    <p className="text-[#231A12] font-medium">{promise}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-[#f6f0e8]" aria-label="Contact CTA">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-sm bg-[#231A12] text-white p-10 md:p-14 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(203,185,165,0.14),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5 text-[#cfbca7]">
                  <div className="w-6 h-px bg-[#cfbca7]" />
                  <span className="denra-label text-[#cfbca7]">Klaar om te starten?</span>
                </div>
                <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-end">
                  <div>
                    <h2 className="font-serif text-4xl md:text-5xl font-semibold leading-tight mb-5">
                      Laat ons uw renovatie strak en zorgeloos uitvoeren.
                    </h2>
                    <p className="text-white/75 leading-relaxed max-w-2xl">
                      Als u zoekt naar een afwerking die luxe voelt zonder schreeuwerig te zijn, dan zitten we waarschijnlijk op dezelfde lijn.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row md:flex-col gap-4 md:justify-end">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 bg-[#f6f0e8] text-[#231A12] font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-[#e8ddcf] transition-all duration-200 text-sm"
                    >
                      Neem contact op
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      to="/configurator"
                      className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-medium px-8 py-4 rounded-sm tracking-[0.16em] uppercase hover:bg-white/10 transition-all duration-200 text-sm"
                    >
                      Prijs berekenen
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}