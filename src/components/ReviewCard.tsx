import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Star, X } from 'lucide-react';
import type { Review } from '../data/reviews';

interface ReviewCardProps {
  review: Review;
  featured?: boolean;
  compact?: boolean;
}

export default function ReviewCard({ review, featured = false, compact = false }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const hasImages = Boolean(review.images?.length);
  const selectedImage = selectedImageIndex === null ? null : review.images?.[selectedImageIndex];
  const imageCount = review.images?.length ?? 0;

  useEffect(() => {
    if (!selectedImage) return undefined;
    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImageIndex(null);
      if (event.key === 'ArrowLeft') setSelectedImageIndex((current) => current === null ? null : (current - 1 + imageCount) % imageCount);
      if (event.key === 'ArrowRight') setSelectedImageIndex((current) => current === null ? null : (current + 1) % imageCount);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
      triggerButtonRef.current?.focus();
    };
  }, [imageCount, selectedImage]);

  const navigateLightbox = (direction: number) => {
    setSelectedImageIndex((current) => current === null ? null : (current + direction + imageCount) % imageCount);
  };

  return (
    <article className={`denra-review-card group relative flex flex-col overflow-hidden p-6 transition-all duration-500 motion-reduce:transform-none sm:p-7 ${featured ? 'md:p-9' : ''} ${compact ? 'p-6' : ''}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-white/90" aria-hidden="true" />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-[#8b6b45]" aria-label={`${review.rating} van 5 sterren`}>
          {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill={star <= review.rating ? 'currentColor' : 'none'} strokeWidth={1.6} />)}
        </div>
        <time className="shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a7a6a]">{review.date}</time>
      </div>
      <p className="mt-6 border-l border-[#bdaa95]/80 pl-3 text-[10px] font-semibold uppercase tracking-[0.15em] leading-relaxed text-[#6b5d50]">{review.project}</p>
      <div className={`relative mt-5 ${featured ? 'md:mt-7' : ''}`}>
        <span className="pointer-events-none absolute -left-1 -top-8 font-serif text-7xl leading-none text-[#af9980]/20" aria-hidden="true">“</span>
        <p className={`relative overflow-hidden text-[#4a3f35] ${expanded ? '' : compact ? 'max-h-24' : featured ? 'max-h-44' : 'max-h-32'} ${featured ? 'font-serif text-xl leading-relaxed md:text-2xl' : 'text-[15px] leading-relaxed'}`}>
          {review.text}
        </p>
        {!expanded && review.text.length > 260 && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#f9f3ec] via-[#f9f3ec]/85 to-transparent" aria-hidden="true" />}
        {review.text.length > 260 && (
          <button type="button" className="relative mt-4 min-h-11 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#231A12] underline decoration-[#a99278] underline-offset-4 transition-colors hover:text-[#7a6552]" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
            {expanded ? 'Lees minder' : 'Lees meer'}
          </button>
        )}
      </div>
      {hasImages && (
        <div className={`mt-7 grid gap-2 ${review.images?.length === 1 ? 'grid-cols-1' : 'grid-cols-[1.45fr_0.8fr] grid-rows-2'}`}>
          {review.images?.map((image, index) => (
            <button key={image} type="button" onClick={(event) => { triggerButtonRef.current = event.currentTarget; setSelectedImageIndex(index); }} className={`overflow-hidden bg-[#eee3d6] focus:outline-none focus:ring-2 focus:ring-[#7a6552] focus:ring-offset-2 ${review.images?.length === 1 ? 'aspect-[16/9]' : index === 0 ? 'row-span-2 aspect-[4/3]' : 'aspect-[4/3]'}`} aria-label={`Bekijk projectfoto ${index + 1} van ${review.name}`}>
              <img src={image} alt={`Projectfoto bij review van ${review.name}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            </button>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#bdaa95]/45 pt-5">
        <h3 className="font-serif text-xl font-semibold leading-tight text-[#231A12]">{review.name}</h3>
        {review.city && <p className="flex shrink-0 items-center gap-1.5 text-xs text-[#6b5d50]"><MapPin size={13} aria-hidden="true" />{review.city}</p>}
      </div>
      {createPortal(<AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#17110d]/95 p-5 sm:p-8" role="dialog" aria-modal="true" aria-label={`Vergrote projectfoto van ${review.name}`} onClick={() => setSelectedImageIndex(null)}>
            <button ref={closeButtonRef} type="button" onClick={() => setSelectedImageIndex(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-sm bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white sm:right-6 sm:top-6" aria-label="Sluit vergrote foto"><X size={20} /></button>
            <div className="flex min-h-0 max-w-full flex-col items-center" onClick={(event) => event.stopPropagation()}>
              <motion.img initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.22 }} src={selectedImage} alt={`Vergrote projectfoto bij review van ${review.name}`} width={1400} height={1000} className="max-h-[72vh] max-w-[90vw] object-contain shadow-[0_20px_55px_rgba(0,0,0,0.35)]" />
              <div className="mt-4 flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 text-[#f6f0e8]"><div><p className="font-serif text-xl">Projectfoto van {review.name}</p><p className="mt-1 text-sm text-[#d8c7b3]">{review.city ?? 'Denra Badkamers'} · {String((selectedImageIndex ?? 0) + 1).padStart(2, '0')} / {String(imageCount).padStart(2, '0')}</p></div>{imageCount > 1 && <div className="flex gap-2"><button type="button" onClick={() => navigateLightbox(-1)} className="flex h-10 w-10 items-center justify-center border border-white/30 text-white hover:bg-white/10" aria-label="Vorige foto"><ArrowLeft size={17} /></button><button type="button" onClick={() => navigateLightbox(1)} className="flex h-10 w-10 items-center justify-center border border-white/30 text-white hover:bg-white/10" aria-label="Volgende foto"><ArrowRight size={17} /></button></div>}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </article>
  );
}