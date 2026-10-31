import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { fill } from '../i18n/format';

// The places the business lists as its service area (same list as the
// structured data in index.html). Almere and Amsterdam have their own pages.
const places = ['Almere', 'Amsterdam', 'Amstelveen', 'Lelystad', 'Haarlem', 'Blaricum', 'Hilversum', 'Laren', 'Weesp', 'Muiden', 'Eemnes', 'Diemen', 'Muiderberg', 'Naarden', 'Amersfoort'];

export default function ServiceArea({ service, id }: { service: 'badkamer' | 'wc' | 'binnen'; id: string }) {
  const { t } = useLanguage();
  const pagePrefix = service === 'wc' ? '/wc-renovatie-' : '/badkamer-renovatie-';
  const serviceName = t(service === 'wc' ? 'form.toilet' : service === 'binnen' ? 'form.interior' : 'form.bathroom');

  return (
    <section className="py-16 bg-c-faf6f0 border-t border-c-cfbca7/40" aria-labelledby={`${id}-heading`}>
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="denra-line" />
          <span className="denra-label">{t('site.regions')}</span>
        </div>
        <h2 id={`${id}-heading`} className="font-serif text-3xl font-semibold text-c-231a12 mb-4">{fill(t('site.areaTitle'), { service: serviceName })}</h2>
        <p className="text-c-6b5d50 leading-relaxed mb-6 max-w-3xl">{t('site.areaIntro')}</p>
        <ul className="flex flex-wrap gap-2">
          {places.map((place) => {
            const page = service !== 'binnen' && (place === 'Almere' || place === 'Amsterdam') ? `${pagePrefix}${place.toLowerCase()}` : null;
            const className = 'inline-flex items-center gap-1.5 text-sm text-c-4a3f35 bg-c-efe6dc border border-c-5c5147/12 px-3 py-1.5 rounded-sm';
            return (
              <li key={place}>
                {page ? (
                  <Link to={page} className={`${className} underline decoration-c-5c5147/30 underline-offset-4 hover:text-c-1d1712`}>
                    <MapPin size={13} aria-hidden="true" />
                    {fill(t('site.areaPageLink'), { service: serviceName, place })}
                  </Link>
                ) : (
                  <span className={className}>{place}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
