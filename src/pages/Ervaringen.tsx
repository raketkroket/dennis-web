import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewsSection from '../components/ReviewsSection';
import WhatsAppButton from '../components/WhatsAppButton';
import { reviews } from '../data/reviews';

export default function Ervaringen() {
  const averageRating = '4,1';

  return (
    <>
      <Header />
      <main className="pt-[74px]">
        <section className="denra-review-background overflow-hidden px-6 py-20 md:py-24 lg:px-8" aria-labelledby="ervaringen-hero-heading">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mb-6 flex items-center gap-3"><div className="denra-line" /><span className="denra-label">Ervaringen</span></div>
              <h1 id="ervaringen-hero-heading" className="max-w-3xl font-serif text-5xl font-semibold leading-[0.96] text-[#231A12] md:text-6xl lg:text-7xl">Wat onze klanten<br />over Denra zeggen.</h1>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }} className="border-l border-[#bdaa95]/60 pl-6 md:pl-8">
              <div className="flex items-end gap-4"><div><div className="mb-2 flex gap-1 text-[#8b6b45]" aria-label="5 sterren">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}</div><p className="font-serif text-5xl font-semibold leading-none text-[#231A12]">{averageRating}<span className="ml-1 text-xl text-[#8a7a6a]">/ 5</span></p></div><p className="pb-1 text-[10px] font-medium uppercase tracking-[0.15em] leading-relaxed text-[#6b5d50]">Gebaseerd op<br />{reviews.length} ervaringen</p></div>
              <p className="mt-8 max-w-md font-serif text-xl leading-relaxed text-[#514237]">Kwaliteit zit niet alleen in het eindresultaat, maar ook in de samenwerking ernaartoe.</p>
            </motion.div>
          </div>
        </section>
        <ReviewsSection showIntro={false} />
        <section className="bg-[#231A12] px-6 py-20 text-[#f6f0e8] lg:px-8" aria-labelledby="ervaringen-cta-heading">
          <div className="mx-auto max-w-7xl border-y border-[#cfbca7]/25 py-12 md:flex md:items-end md:justify-between md:gap-10">
            <div className="max-w-2xl"><p className="denra-label mb-5 text-[#cfbca7]">Klaar voor uw eigen renovatie?</p><h2 id="ervaringen-cta-heading" className="font-serif text-4xl font-semibold leading-tight md:text-5xl">Van eerste idee tot zorgvuldige oplevering.</h2><p className="mt-5 max-w-xl leading-relaxed text-[#ddd3c5]">Bespreek vrijblijvend uw wensen met Denra.</p></div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-0"><Link to="/contact" className="denra-button-primary bg-[#f6f0e8] text-[#231A12] hover:bg-white">Plan een kennismaking <ArrowRight size={16} /></Link><Link to="/configurator" className="denra-button-secondary border-[#cfbca7]/45 text-[#f6f0e8] hover:bg-white/10 hover:text-[#f6f0e8]">Bereken uw prijs</Link></div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}