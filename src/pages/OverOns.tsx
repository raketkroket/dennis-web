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
          className="pt-36 pb-20 bg-[radial-gradient(circle_at_top_left,_rgba(213,192,167,0.20),_transparent_34%),linear-gradient(180deg,_#FAF8F5_0%,_#F4EEE6_100%)] overflow-hidden"
          aria-label="Over ons"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-3 mb-6 rounded-full border border-[#D9C8B0]/80 bg-white/60 px-4 py-2 backdrop-blur-sm">
                  <Sparkles size={14} className="text-[#8B6F47]" />
                  <span className="text-[11px] tracking-[0.24em] uppercase text-[#8B6F47] font-medium">Over Nivora</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold text-[#2C2416] leading-[0.95] mb-6 max-w-xl">
                  Renovaties die
                  <span className="block text-[#8B6F47]">rust en klasse</span>
                  uitstralen.
                </h1>
                <p className="text-[#6B5D50] text-lg leading-relaxed mb-6 max-w-xl">
                  Nivora maakt badkamers, wc&apos;s en interieurs die strak aanvoelen, slim zijn opgebouwd en premium ogen zonder overdreven te worden.
                </p>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-xl">
                  Wij sturen op helderheid, afwerking en een proces dat soepel loopt. Geen opgeblazen praat, wel vakwerk, strakke communicatie en een eindresultaat waar u dagelijks plezier van heeft.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#8B6F47] text-white font-medium px-8 py-4 rounded-full hover:bg-[#7A5F3A] hover:scale-[1.02] transition-all duration-200 text-sm tracking-wide"
                  >
                    Plan een kennismaking
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/projecten"
                    className="inline-flex items-center justify-center gap-2 border border-[#2C2416]/15 text-[#2C2416] font-medium px-8 py-4 rounded-full hover:bg-white/80 transition-all duration-200 text-sm tracking-wide"
                  >
                    Bekijk projecten
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  {[
                    { value: '100+', label: 'Tevreden klanten' },
                    { value: '5+ jaar', label: 'Ervaring' },
                    { value: 'Premium', label: 'Materialen' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/70 bg-white/70 px-5 py-4 shadow-[0_12px_30px_rgba(44,36,22,0.06)] backdrop-blur-sm"
                    >
                      <div className="font-serif text-2xl font-semibold text-[#2C2416]">{item.value}</div>
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
                <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-[#D5C0A7]/35 blur-2xl" />
                <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[2rem] overflow-hidden min-h-[420px] shadow-[0_24px_60px_rgba(44,36,22,0.15)]">
                    <img
                      src={sitePhotos[0]}
                      alt="Afgewerkte luxe badkamer van Nivora"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-[1.75rem] overflow-hidden h-[250px] shadow-[0_18px_40px_rgba(44,36,22,0.12)]">
                      <img
                        src={sitePhotos[4]}
                        alt="Strakke renovatie details en afwerking"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="rounded-[1.75rem] bg-[#2C2416] text-white p-6 flex flex-col justify-between min-h-[154px] shadow-[0_18px_40px_rgba(44,36,22,0.18)]">
                      <div className="flex items-center gap-2 text-[#D5C0A7] text-xs tracking-[0.22em] uppercase">
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

        <section className="py-20 bg-white" aria-labelledby="waarom-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mb-12"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-[#8B6F47]" />
                <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Waarom Nivora</span>
              </div>
              <h2 id="waarom-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#2C2416] leading-tight mb-5">
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
                    className={`rounded-[1.75rem] p-8 border shadow-[0_18px_45px_rgba(44,36,22,0.06)] ${index === 1 ? 'bg-[#2C2416] text-white border-[#2C2416]' : 'bg-[#FAF8F5] border-[#E8DDD0]/70'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 ${index === 1 ? 'bg-white/10 text-[#D5C0A7]' : 'bg-white text-[#8B6F47]'}`}>
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

        <section className="py-20 bg-[#FAF8F5] border-y border-[#E8DDD0]/60" aria-labelledby="belofte-heading">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-6 h-px bg-[#8B6F47]" />
                  <span className="text-xs tracking-[0.25em] uppercase text-[#8B6F47] font-medium">Onze belofte</span>
                </div>
                <h2 id="belofte-heading" className="font-serif text-4xl md:text-5xl font-semibold text-[#2C2416] leading-tight mb-6">
                  Wat u van ons mag verwachten
                </h2>
                <p className="text-[#6B5D50] leading-relaxed mb-8 max-w-lg">
                  Wij houden het simpel: duidelijke verwachtingen, nette uitvoering en een afwerking waar u niet naar hoeft te kijken omdat alles vanzelf klopt.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#2C2416] text-white font-medium px-8 py-4 rounded-full hover:bg-[#1f190f] hover:scale-[1.02] transition-all duration-200 text-sm tracking-wide"
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
                    className="flex items-center gap-4 rounded-[1.5rem] bg-white px-6 py-5 border border-[#E8DDD0]/70 shadow-[0_14px_30px_rgba(44,36,22,0.05)]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#D5C0A7]/20 text-[#8B6F47] flex items-center justify-center shrink-0">
                      <Handshake size={18} />
                    </div>
                    <p className="text-[#2C2416] font-medium">{promise}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white" aria-label="Contact CTA">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[2rem] bg-[#2C2416] text-white p-10 md:p-14 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(213,192,167,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5 text-[#D5C0A7]">
                  <div className="w-6 h-px bg-[#D5C0A7]" />
                  <span className="text-xs tracking-[0.25em] uppercase font-medium">Klaar om te starten?</span>
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
                      className="inline-flex items-center justify-center gap-2 bg-[#D5C0A7] text-[#2C2416] font-medium px-8 py-4 rounded-full hover:bg-[#C7AF94] transition-all duration-200 text-sm tracking-wide"
                    >
                      Neem contact op
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      to="/configurator"
                      className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 transition-all duration-200 text-sm tracking-wide"
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