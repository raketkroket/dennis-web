import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Star, X } from 'lucide-react';
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
  const hasImages = Boolean(review.images?.length);
  const selectedImage = selectedImageIndex === null ? null : review.images?.[selectedImageIndex];

  useEffect(() => {
    if (!selectedImage) return undefined;
    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImageIndex(null);
      if (event.key === 'ArrowLeft' && selectedImageIndex > 0) setSelectedImageIndex(selectedImageIndex - 1);
      if (event.key === 'ArrowRight' && selectedImageIndex < (review.images?.length ?? 0) - 1) setSelectedImageIndex(selectedImageIndex + 1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [review.images, selectedImage, selectedImageIndex]);

  return (
    <article className={`denra-review-card group relative flex h-full flex-col overflow-hidden p-6 transition-all duration-500 motion-reduce:transform-none sm:p-7 ${featured ? 'md:p-9' : ''} ${compact ? 'p-6' : ''}`}>
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
            <button key={image} type="button" onClick={() => setSelectedImageIndex(index)} className={`overflow-hidden bg-[#eee3d6] focus:outline-none focus:ring-2 focus:ring-[#7a6552] focus:ring-offset-2 ${review.images?.length === 1 ? 'aspect-[16/9]' : index === 0 ? 'row-span-2 aspect-[4/3]' : 'aspect-[4/3]'}`} aria-label={`Bekijk projectfoto ${index + 1} van ${review.name}`}>
              <img src={image} alt={`Projectfoto bij review van ${review.name}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
            </button>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#bdaa95]/45 pt-5">
        <h3 className="font-serif text-xl font-semibold leading-tight text-[#231A12]">{review.name}</h3>
        {review.city && <p className="flex shrink-0 items-center gap-1.5 text-xs text-[#6b5d50]"><MapPin size={13} aria-hidden="true" />{review.city}</p>}
      </div>
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#120d09]/92 p-4 sm:p-6" role="dialog" aria-modal="true" aria-label={`Projectfoto van ${review.name}`} onClick={() => setSelectedImageIndex(null)}>
            <button ref={closeButtonRef} type="button" onClick={() => setSelectedImageIndex(null)} className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-white transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white sm:right-6 sm:top-6" aria-label="Sluit vergrote foto"><X size={21} /></button>
            {selectedImageIndex > 0 && <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedImageIndex(selectedImageIndex - 1); }} className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white sm:left-6" aria-label="Vorige foto"><ChevronLeft size={24} /></button>}
            <motion.img initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} src={selectedImage} alt={`Vergrote projectfoto bij review van ${review.name}`} className="max-h-[86vh] max-w-full object-contain" onClick={(event) => event.stopPropagation()} />
            {selectedImageIndex < (review.images?.length ?? 0) - 1 && <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedImageIndex(selectedImageIndex + 1); }} className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white sm:right-6" aria-label="Volgende foto"><ChevronRight size={24} /></button>}
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}