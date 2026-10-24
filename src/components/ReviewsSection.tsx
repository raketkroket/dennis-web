import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { averageRating, reviewCategory } from '../data/reviews';
import { usePublishedReviews } from '../hooks/usePublishedReviews';
import { useLanguage } from '../i18n/useLanguage';
import { fill } from '../i18n/format';
import { formatNumber } from '../lib/calculator';
import ReviewCard, { Stars } from './ReviewCard';
import Reveal from './ui/Reveal';

interface ReviewsSectionProps {
  preview?: boolean;
  showIntro?: boolean;
}

const filters = ['Alle', 'Badkamer', 'Toilet', 'Renovatie', 'Aanbouw'] as const;

export default function ReviewsSection({ preview = false, showIntro = true }: ReviewsSectionProps) {
  const { language, t } = useLanguage();
  const reviews = usePublishedReviews(language);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>('Alle');
  const filterLabels = [t('reviewsPage.filterAll'), t('reviewsPage.filterBathroom'), t('reviewsPage.filterToilet'), t('reviewsPage.filterRenovation'), t('reviewsPage.filterExtension')];
  const rating = averageRating(reviews);

  if (preview) {
    // The newest five-star review about a bathroom or toilet leads; the next two follow.
    const featured = reviews.find((review) => review.rating === 5 && ['Badkamer', 'Toilet'].includes(reviewCategory(review)) && review.text.length > 120) ?? reviews[0];
    const others = reviews.filter((review) => review !== featured && review.text.length > 60).slice(0, 2);
    if (!featured) return null;
    return (
      <section className="py-20 md:py-28" aria-labelledby="ervaringen-heading">
        <div className="shell">
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{t('shared.customerReviews')}</p>
              <h2 id="ervaringen-heading" className="display-lg mt-5">{t('shared.whatCustomersSay')}</h2>
            </div>
            {rating !== null && (
              <Link to="/ervaringen" className="flex items-center gap-4 self-start border-l border-denra-line pl-5 md:self-auto">
                <span className="font-serif text-5xl leading-none">{formatNumber(rating, language, 1)}</span>
                <span>
                  <Stars rating={Math.round(rating)} />
                  <span className="mt-1 block text-sm text-denra-muted">{fill(t('site.reviewsBasedOn'), { count: reviews.length })}</span>
                </span>
              </Link>
            )}
          </Reveal>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7"><ReviewCard review={featured} variant="featured" /></Reveal>
            <div className="grid gap-10 lg:col-span-5">
              {others.map((review, index) => <Reveal key={review.id} delay={0.06 * (index + 1)}><ReviewCard review={review} variant="compact" /></Reveal>)}
            </div>
          </div>
          <Link to="/ervaringen" className="link-arrow mt-12">
            {t('shared.viewAllReviews')}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  const displayed = reviews.filter((review) => activeFilter === 'Alle' || reviewCategory(review) === activeFilter);
  return (
    <section className="pb-20 md:pb-28" aria-labelledby={showIntro ? 'ervaringen-heading' : undefined} aria-label={showIntro ? undefined : t('shared.customerReviews')}>
      <div className="shell">
        {showIntro && <h2 id="ervaringen-heading" className="display-lg">{t('shared.whatCustomersSay')}</h2>}
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label={t('site.reviewsFilter')}>
          <div className="flex min-w-max gap-2 border-b border-denra-line pb-4">
            {filters.map((filter, index) => {
              const count = filter === 'Alle' ? reviews.length : reviews.filter((review) => reviewCategory(review) === filter).length;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`min-h-11 border px-4 text-sm transition-colors ${activeFilter === filter ? 'border-denra-ink bg-denra-ink text-denra-ivory' : 'border-denra-ink/20 text-denra-ink hover:border-denra-ink'}`}
                >
                  {filterLabels[index]} <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        {displayed.length ? (
          <ul className="mt-10 grid items-start gap-x-12 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
            {displayed.map((review) => (
              <li key={review.id}>
                <ReviewCard review={review} />
              </li>
            ))}
          </ul>
        ) : <p className="mt-10 text-denra-muted">{t('site.noReviews')}</p>}
      </div>
    </section>
  );
}
