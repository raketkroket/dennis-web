import React from 'react';
import { useSiteContent } from '../content/SiteContentProvider';
import type { FaqPage } from '../content/defaults';
import { useLanguage } from '../i18n/useLanguage';
import { useLocalized } from '../i18n/format';

/**
 * Frequently asked questions as managed in the admin (Website aanpassen →
 * Veelgestelde vragen). Answers are in the HTML even while folded shut.
 */
export default function FaqList({ pages, id }: { pages: FaqPage[]; id: string }) {
  const { t } = useLanguage();
  const pick = useLocalized();
  const { faqs } = useSiteContent();
  const items = faqs
    .filter((faq) => faq.isVisible && pages.includes(faq.page))
    .sort((first, second) => pages.indexOf(first.page) - pages.indexOf(second.page) || first.sortOrder - second.sortOrder);
  if (!items.length) return null;

  return (
    <section className="py-20 bg-c-faf6f0" aria-labelledby={`${id}-heading`}>
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="denra-line" />
          <span className="denra-label">{t('site.faqLabel')}</span>
        </div>
        <h2 id={`${id}-heading`} className="font-serif text-4xl font-semibold text-c-231a12 mb-8">{t('site.faqTitle')}</h2>
        <div className="divide-y divide-c-cfbca7/55 border-y border-c-cfbca7/55">
          {items.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-xl font-semibold text-c-231a12 [&::-webkit-details-marker]:hidden">
                <h3 className="font-serif text-xl font-semibold">{pick(faq.questionNl, faq.questionEn)}</h3>
                <span aria-hidden="true" className="mt-1 text-c-7a6552 transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-c-6b5d50 leading-relaxed">{pick(faq.answerNl, faq.answerEn)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
