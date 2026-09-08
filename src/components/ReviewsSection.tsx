import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reviews, reviewCategory } from '../data/reviews';
import ReviewCard from './ReviewCard';

interface ReviewsSectionProps {
  preview?: boolean;
  showIntro?: boolean;
}

const filters = ['Alle', 'Badkamer', 'Toilet', 'Renovatie', 'Aanbouw'] as const;

export default function ReviewsSection({ preview = false, showIntro = true }: ReviewsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Alle');
  const displayedReviews = preview ? reviews.slice(0, 3) : reviews.filter((review) => activeFilter === 'Alle' || reviewCategory(review) === activeFilter);
  const averageRating = '4,1';

  return (
    <section className="denra-review-background relative overflow-hidden border-y border-[#5c5147]/12 py-20 md:py-24" aria-labelledby={showIntro ? 'ervaringen-heading' : undefined} aria-label={showIntro ? undefined : 'Klantervaringen'}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {showIntro && <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="grid gap-8 border-b border-[#bdaa95]/55 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3"><div className="denra-line" /><span className="denra-label">Ervaringen van klanten</span></div>
            <h2 id="ervaringen-heading" className="font-serif text-4xl font-semibold leading-tight text-[#231A12] md:text-5xl">Wat onze klanten zeggen</h2>
            <p className="mt-4 leading-relaxed text-[#6b5d50]">Lees hoe klanten de samenwerking met Denra Badkamers hebben ervaren.</p>
          </div>
          <div className="flex items-center gap-4 border-l border-[#bdaa95]/60 pl-5"><div className="flex gap-0.5 text-[#8b6b45]" aria-hidden="true">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={13} fill="currentColor" />)}</div><div><p className="font-serif text-3xl font-semibold leading-none text-[#231A12]">{averageRating}</p><p className="mt-1 text-[10px] uppercase tracking-[0.13em] text-[#6b5d50]">{reviews.length} ervaringen</p></div></div>
        </motion.div>}
        {!preview && <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }} className="mt-8 overflow-x-auto pb-2 [scrollbar-width:none]" role="group" aria-label="Filter ervaringen"><div className="inline-flex min-w-max gap-1 border border-[#bdaa95]/55 bg-transparent p-1 shadow-[0_8px_22px_rgba(72,50,32,0.06)]">{filters.map((filter) => <button key={filter} type="button" onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter} className={`relative min-h-11 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${activeFilter === filter ? 'text-[#231A12]' : 'text-[#6b5d50] hover:text-[#231A12]'}`}>{activeFilter === filter && <motion.span layoutId="active-review-filter" className="absolute inset-0 -z-0 border border-[#7a6552]/70 shadow-[0_4px_10px_rgba(72,50,32,0.08)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}{filter}</button>)}</div></motion.div>}
        {preview ? <div className="mt-10 grid gap-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch"><motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}><ReviewCard review={displayedReviews[0]} featured /></motion.div><div className="grid gap-5"><motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.52, delay: 0.08 }}><ReviewCard review={displayedReviews[1]} compact /></motion.div><motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.52, delay: 0.16 }}><ReviewCard review={displayedReviews[2]} compact /></motion.div></div></div> : <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{displayedReviews.map((review, index) => <motion.div key={review.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, delay: index * 0.025, ease: 'easeOut' }} className="min-w-0"><ReviewCard review={review} featured={index === 0} /></motion.div>)}</div>}
        {preview && <div className="mt-12"><Link to="/ervaringen" className="inline-flex items-center gap-2 text-sm font-semibold text-[#231A12] underline decoration-[#a99278] underline-offset-8 transition-colors hover:text-[#7a6552]">Bekijk alle ervaringen <ArrowRight size={16} aria-hidden="true" /></Link></div>}
      </div>
    </section>
  );
}