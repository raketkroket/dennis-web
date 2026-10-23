import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import type { Review } from '../data/reviews';
import { useLanguage } from '../i18n/useLanguage';
import Lightbox from './ui/Lightbox';

interface ReviewCardProps {
  review: Review;
  variant?: 'default' | 'featured' | 'compact';
}

export function Stars({ rating, size = 15 }: { rating: number; size?: number }) {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-0.5 text-denra-bronze" role="img" aria-label={`${rating} ${t('shared.outOfFiveStars')}`}>
      {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={size} fill={star <= rating ? 'currentColor' : 'none'} strokeWidth={1.5} aria-hidden="true" />)}
    </span>
  );
}

export default function ReviewCard({ review, variant = 'default' }: ReviewCardProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const limit = variant === 'compact' ? 220 : variant === 'featured' ? 520 : 320;
  const long = review.text.length > limit;
  const text = long && !expanded ? `${review.text.slice(0, limit).replace(/\s+\S*$/, '')}…` : review.text;
  const images = review.images ?? [];

  return (
    <article className={`flex h-full flex-col border-t border-denra-ink/70 pt-6 ${variant === 'featured' ? 'md:pt-8' : ''}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Stars rating={review.rating} size={variant === 'featured' ? 18 : 15} />
        <time className="text-[12px] uppercase tracking-[0.16em] text-denra-muted">{review.date}</time>
      </div>
      <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.14em] text-denra-bronze">{review.project}</p>
      <blockquote className={`mt-4 whitespace-pre-line text-denra-ink ${variant === 'featured' ? 'font-serif text-2xl leading-snug md:text-[2rem] md:leading-[1.25]' : 'text-[16px] leading-relaxed'}`}>
        {variant === 'featured' ? `“${text}”` : text}
      </blockquote>
      {long && (
        <button type="button" onClick={() => setExpanded((open) => !open)} aria-expanded={expanded} className="mt-3 self-start py-2 text-sm font-medium text-denra-ink underline decoration-denra-line underline-offset-4 hover:decoration-denra-ink">
          {expanded ? t('shared.readLess') : t('shared.readMore')}
        </button>
      )}
      {images.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={t('site.reviewsPhotos')}>
          {images.map((image, index) => (
            <li key={image}>
              <button type="button" onClick={() => setPhotoIndex(index)} className="frame block h-20 w-20 sm:h-24 sm:w-24" aria-label={`${t('shared.viewProjectPhoto')} ${index + 1} – ${review.name}`}>
                <img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <footer className="mt-auto flex items-end justify-between gap-4 pt-6">
        <p className="font-serif text-xl text-denra-ink">{review.name}</p>
        {review.city && <p className="flex items-center gap-1.5 text-sm text-denra-muted"><MapPin size={14} aria-hidden="true" />{review.city}</p>}
      </footer>
      <Lightbox
        items={images.map((image, index) => ({ image: { src: image, width: 1280, height: 960 }, alt: `${t('shared.projectPhotoFor')} ${review.name} (${index + 1})`, caption: `${review.name}${review.city ? `, ${review.city}` : ''} – ${review.project}` }))}
        index={photoIndex}
        title={`${t('shared.projectPhotoOf')} ${review.name}`}
        onClose={() => setPhotoIndex(null)}
        onIndexChange={setPhotoIndex}
      />
    </article>
  );
}
