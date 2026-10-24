import { useLanguage } from '../i18n/useLanguage';

export default function LanguageSwitcher({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { language, setLanguage, t } = useLanguage();
  const base = tone === 'dark' ? 'border-denra-ink/20 text-denra-muted' : 'border-denra-ivory/30 text-denra-ivory/70';
  const active = tone === 'dark' ? 'bg-denra-ink text-denra-ivory' : 'bg-denra-ivory text-denra-ink';

  return (
    <div className={`inline-flex items-center border text-[12px] font-medium tracking-[0.08em] ${base}`} role="group" aria-label={t('common.language')}>
      {(['nl', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
          lang={option}
          aria-label={option === 'nl' ? 'Nederlands' : 'English'}
          className={`min-h-9 min-w-10 px-2.5 uppercase transition-colors ${language === option ? active : 'hover:text-current'}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
