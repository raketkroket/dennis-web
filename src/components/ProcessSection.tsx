import { useLanguage } from '../i18n/useLanguage';
import Reveal from './ui/Reveal';

// "Werkwijze": the four stages described elsewhere on the site (assessment
// on site, itemised quote, one point of contact, handover).
export default function ProcessSection() {
  const { t } = useLanguage();
  const steps = t('site.processSteps').split('|');
  const descriptions = t('site.processDescriptions').split('|');

  return (
    <section className="py-20 md:py-28" aria-labelledby="werkwijze-heading">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{t('site.processLabel')}</p>
          <h2 id="werkwijze-heading" className="display-lg mt-5">{t('site.processTitle')}</h2>
        </Reveal>
        <ol className="mt-12 grid border-t border-denra-ink/80 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal as="li" key={step} delay={index * 0.06} className={`border-b border-denra-line py-8 sm:pr-8 lg:border-b-0 ${index > 0 ? 'lg:border-l lg:pl-8' : ''} ${index % 2 === 1 ? 'sm:border-l sm:pl-8 lg:pl-8' : ''}`}>
              <span className="font-serif text-5xl leading-none text-denra-greige">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="mt-6 font-serif text-2xl">{step}</h3>
              <p className="mt-3 leading-relaxed text-denra-muted">{descriptions[index]}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
