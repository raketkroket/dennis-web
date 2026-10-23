import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import { usePageTitle } from '../i18n/format';

export default function NotFound() {
  const { t } = useLanguage();
  usePageTitle(t('notFound.title'));
  return (
    <section className="shell flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="font-serif text-8xl leading-none text-denra-greige">404</p>
      <h1 className="display-lg mt-6">{t('notFound.title')}</h1>
      <p className="lede mt-4 max-w-md">{t('notFound.description')}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary"><ArrowLeft size={16} aria-hidden="true" />{t('notFound.backHome')}</Link>
        <Link to="/projecten" className="btn-secondary">{t('site.notFoundProjects')}</Link>
      </div>
    </section>
  );
}
