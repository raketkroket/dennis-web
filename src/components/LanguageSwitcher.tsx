import { useLanguage } from '../i18n/useLanguage';

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center border border-c-5c5147/25 text-[11px] font-medium tracking-[0.08em]" aria-label={t('common.language')}>
      <button type="button" onClick={() => setLanguage('nl')} aria-pressed={language === 'nl'} className={`min-h-8 px-2.5 transition-colors ${language === 'nl' ? 'bg-c-231a12 text-c-f6f0e8' : 'text-c-4a4037 hover:text-c-12100d'}`}>NL</button>
      <button type="button" onClick={() => setLanguage('en')} aria-pressed={language === 'en'} className={`min-h-8 border-l border-c-5c5147/25 px-2.5 transition-colors ${language === 'en' ? 'bg-c-231a12 text-c-f6f0e8' : 'text-c-4a4037 hover:text-c-12100d'}`}>EN</button>
    </div>
  );
}