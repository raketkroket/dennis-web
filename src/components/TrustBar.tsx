import type { ReactNode } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { averageRating } from '../data/reviews';
import { usePublishedReviews } from '../hooks/usePublishedReviews';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { fill } from '../i18n/format';
import { formatNumber } from '../lib/calculator';

// Facts taken from the site's own data (reviews and projects), never typed in.
export default function TrustBar() {
  const { language, t } = useLanguage();
  const reviews = usePublishedReviews(language);
  const { projects } = useSiteContent();
  const rating = averageRating(reviews);

  const items = [
    rating !== null && {
      key: 'rating',
      to: '/ervaringen',
      value: <span className="inline-flex items-center gap-2">{formatNumber(rating, language, 1)}<Star size={18} className="text-denra-bronze" fill="currentColor" aria-hidden="true" /></span>,
      label: fill(t('site.factReviews'), { count: reviews.length }),
    },
    { key: 'projects', to: '/projecten', value: String(projects.length), label: t('site.factProjects') },
    { key: 'scope', to: '/badkamerrenovatie', value: null, label: t('site.factScope') },
    { key: 'region', to: '/contact', value: null, label: t('site.factRegion') },
  ].filter(Boolean) as { key: string; to: string; value: ReactNode; label: string }[];

  return (
    <section className="border-y border-denra-line" aria-label={t('home.promises')}>
      <ul className="shell grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <li key={item.key} className={`border-denra-line ${index % 2 === 1 ? 'border-l' : ''} ${index >= 2 ? 'border-t lg:border-t-0' : ''} ${index === 2 ? 'lg:border-l' : ''}`}>
            <Link to={item.to} className="flex h-full min-h-[92px] flex-col justify-center gap-1 px-4 py-5 transition-colors hover:bg-denra-stone/50 sm:px-6">
              {item.value && <span className="font-serif text-3xl leading-none text-denra-ink">{item.value}</span>}
              <span className={item.value ? 'text-sm text-denra-muted' : 'font-serif text-xl leading-snug text-denra-ink'}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
