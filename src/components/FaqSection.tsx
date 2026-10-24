import { Plus } from 'lucide-react';
import type { FaqPage } from '../content/defaults';
import { useSiteContent } from '../content/SiteContentProvider';
import { useLanguage } from '../i18n/useLanguage';
import { useLocalized } from '../i18n/format';
import Reveal from './ui/Reveal';

interface FaqSectionProps {
  pages: FaqPage[];
  /** Extra questions that are not managed in the admin (local service pages). */
  extra?: { question: string; answer: string }[];
  tone?: 'ivory' | 'stone';
}

export default function FaqSection({ pages, extra = [], tone = 'ivory' }: FaqSectionProps) {
  const { faqs } = useSiteContent();
  const { t } = useLanguage();
  const pick = useLocalized();
  const items = [
    ...faqs
      .filter((faq) => faq.isVisible && pages.includes(faq.page))
      .sort((first, second) => pages.indexOf(first.page) - pages.indexOf(second.page) || first.sortOrder - second.sortOrder)
      .map((faq) => ({ id: faq.id, question: pick(faq.questionNl, faq.questionEn), answer: pick(faq.answerNl, faq.answerEn) })),
    ...extra.map((item, index) => ({ id: `extra-${index}`, ...item })),
  ];
  if (!items.length) return null;

  return (
    <section className={`py-20 md:py-28 ${tone === 'stone' ? 'bg-denra-stone' : ''}`} aria-labelledby="faq-heading">
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow">{t('site.faqLabel')}</p>
          <h2 id="faq-heading" className="display-lg mt-5">{t('site.faqTitle')}</h2>
        </Reveal>
        <div className="border-t border-denra-line">
          {items.map((item) => (
            <details key={item.id} className="group border-b border-denra-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-xl leading-snug text-denra-ink marker:content-none sm:text-2xl [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus size={20} className="shrink-0 text-denra-bronze transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="max-w-2xl pb-6 pr-10 leading-relaxed text-denra-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
