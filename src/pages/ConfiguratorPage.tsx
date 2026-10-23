import Configurator from '../components/Configurator';
import { useLanguage } from '../i18n/useLanguage';
import { usePageTitle } from '../i18n/format';

export default function ConfiguratorPage() {
  const { t } = useLanguage();
  usePageTitle(t('common.calculatePrice'), t('configuratorPage.description'));
  return (
    <section className="pb-20 pt-8 md:pb-28 md:pt-14" aria-labelledby="calculator-page-heading">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t('configuratorPage.label')}</p>
            <h1 id="calculator-page-heading" className="display-xl mt-6">
              {t('configuratorPage.title').split('|').map((line, index) => <span key={line} className={`block ${index ? 'italic text-denra-bronze' : ''}`}>{line}</span>)}
            </h1>
          </div>
          <p className="lede lg:col-span-4 lg:col-start-9">{t('configuratorPage.description')}</p>
        </div>
        <div className="mt-12 md:mt-16">
          <Configurator />
        </div>
      </div>
    </section>
  );
}
